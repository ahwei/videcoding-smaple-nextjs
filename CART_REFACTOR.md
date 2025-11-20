# 購物車架構更新說明

## 問題描述
原本的購物車使用硬編碼的假資料，與從資料庫讀取的產品列表沒有連結。首頁無法正常工作。

## 解決方案

### 1. 重構 CartContext (`lib/cart-context.tsx`)

#### 新架構特點：
- **分離存儲**：將數量和產品資料分開存儲
  - `cartQuantities`: 只存儲產品 ID 和數量的映射 `{ [productId]: quantity }`
  - `cartItemsData`: 存儲完整的產品資料
  
- **LocalStorage 持久化**：購物車數量會自動保存到 localStorage，刷新頁面後保留

- **動態產品支持**：不需要預先載入所有產品，產品資料在第一次加入購物車時才記錄

#### 新增的方法：
```typescript
getQuantity(id: string): number  // 獲取指定產品的購物車數量

updateQuantity(id: string, quantity: number, itemData?: Partial<CartItem>)
// itemData 參數讓我們在更新數量時同時更新產品資料
```

### 2. 更新 MenuList 組件 (`components/menu-list.tsx`)

#### 變更：
- 使用 `getQuantity()` 來獲取每個產品的購物車數量
- 在調用 `updateQuantity()` 時傳遞產品資料，確保購物車有完整的產品資訊

```typescript
// 之前：直接從 cartItems 找對應項目
const cartItem = cartItems.find((item) => item.id === product.id);

// 現在：使用 getQuantity 直接獲取數量
quantity: getQuantity(product.id)
```

### 3. 數據流程

```
資料庫 (Products)
    ↓
首頁 Server Component
    ↓ (傳遞產品列表)
MenuList Client Component
    ↓ (用戶點擊 +/-)
CartContext.updateQuantity(id, quantity, productData)
    ↓
存儲到 State + localStorage
    ↓
購物車頁面顯示
    ↓
結帳頁面
    ↓
創建訂單到資料庫
```

### 4. 購物車頁面 (`app/cart/page.tsx`)

- 更新 `updateQuantity` 調用，傳遞完整的產品資料
- 確保購物車中的產品資料始終完整

### 5. 訂單歷史頁面 (`app/orders/page.tsx`)

- 更新 `handleReorder` 函數
- 從資料庫訂單重新加入購物車時，傳遞產品資料

## 優勢

1. ✅ **真正的動態購物車**：支援從資料庫讀取的任意產品
2. ✅ **數據持久化**：使用 localStorage 保存購物車狀態
3. ✅ **性能優化**：只存儲必要的數據（數量），產品資料按需載入
4. ✅ **類型安全**：完整的 TypeScript 類型定義
5. ✅ **靈活性**：可以輕鬆擴展支援更多產品屬性

## 使用範例

### 在首頁增加產品到購物車：
```typescript
// 用戶點擊 + 按鈕
updateQuantity(productId, newQuantity, {
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image,
})
```

### 獲取產品的購物車數量：
```typescript
const quantity = getQuantity(productId)
```

### 清空購物車：
```typescript
clearCart()  // 移除所有數量，但保留產品資料緩存
```

## 注意事項

1. **產品資料更新**：如果產品價格或資訊在資料庫中更新，購物車中已有的項目不會自動更新。這是設計決策，確保用戶看到的是加入購物車時的價格。

2. **LocalStorage 限制**：
   - 大小限制約 5-10MB
   - 只在客戶端運行
   - 清除瀏覽器數據會丟失購物車

3. **未來改進建議**：
   - 將購物車同步到資料庫（需要用戶登入）
   - 實現購物車過期機制
   - 添加價格變動提示
   - 支援多設備同步

## 測試檢查清單

- [ ] 首頁可以正常增減產品數量
- [ ] 購物車圖標顯示正確的數量
- [ ] 購物車頁面顯示正確的產品和價格
- [ ] 重新整理頁面後購物車數量保留
- [ ] 結帳流程正常
- [ ] 訂單歷史的重新訂購功能正常
- [ ] 清空購物車功能正常
