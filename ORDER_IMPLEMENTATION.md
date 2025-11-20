# 訂單管理功能說明

## 功能概述

已實現完整的訂單管理功能，包括：
1. ✅ 創建訂單 (儲存到資料庫)
2. ✅ 查看訂單歷史 (從資料庫讀取)
3. ✅ 重新訂購功能
4. ✅ 訂單狀態顯示

## API 端點

### POST /api/orders
創建新訂單

**請求格式:**
```json
{
  "items": [
    {
      "productId": "產品ID",
      "name": "產品名稱",
      "quantity": 數量,
      "price": 價格
    }
  ],
  "paymentMethod": "MASTERCARD | VISA | APPLE_PAY | CREDIT_CARD"
}
```

**回應格式:**
```json
{
  "order": {
    "id": "訂單ID",
    "orderNumber": "#12345",
    "subtotal": 100.00,
    "total": 100.00,
    "status": "PENDING",
    "paymentMethod": "MASTERCARD",
    "estimatedTime": 15,
    "createdAt": "2025-11-20T...",
    "items": [...]
  }
}
```

### GET /api/orders
獲取訂單列表

**查詢參數:**
- `limit`: 每頁數量 (預設: 10)
- `offset`: 偏移量 (預設: 0)

**回應格式:**
```json
{
  "orders": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

## 資料庫結構

訂單相關的資料表包括：

### Order (訂單)
- `id`: 唯一識別碼
- `orderNumber`: 訂單編號 (格式: #12345)
- `subtotal`: 小計
- `total`: 總計
- `status`: 訂單狀態 (PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED)
- `paymentMethod`: 付款方式
- `estimatedTime`: 預估時間 (分鐘)
- `createdAt`: 建立時間
- `updatedAt`: 更新時間

### OrderItem (訂單項目)
- `id`: 唯一識別碼
- `orderId`: 關聯的訂單ID
- `productId`: 關聯的產品ID
- `productName`: 產品名稱快照
- `quantity`: 數量
- `price`: 價格快照
- `subtotal`: 小計 (quantity × price)

## 頁面流程

1. **首頁 (/)**: 瀏覽產品，加入購物車
2. **購物車 (/cart)**: 檢視購物車內容，前往結帳
3. **結帳 (/checkout)**: 選擇付款方式，確認訂單
4. **感謝頁面 (/thank-you)**: 顯示訂單編號和預估時間
5. **訂單歷史 (/orders)**: 查看所有訂單，可重新訂購

## 重新訂購功能

訂單歷史頁面的 "Reorder" 按鈕會：
1. 將該訂單的所有項目加回購物車
2. 自動導航到購物車頁面
3. 使用者可以調整數量後再次結帳

## 訂單狀態說明

- **PENDING** (待付款): 訂單已創建，等待付款
- **CONFIRMED** (已確認): 付款成功，訂單已確認
- **PREPARING** (準備中): 商家正在準備餐點
- **READY** (已完成): 餐點已準備完成，可以取餐
- **DELIVERED** (已送達): 訂單已送達/已取餐
- **CANCELLED** (已取消): 訂單已取消

## 付款方式

支援的付款方式：
- **MASTERCARD**: Mastercard 信用卡
- **VISA**: Visa 信用卡
- **APPLE_PAY**: Apple Pay
- **CREDIT_CARD**: 一般信用卡

## 開發注意事項

1. **交易處理**: 使用 Prisma Transaction 確保訂單和訂單項目同時創建
2. **價格快照**: 訂單項目儲存當時的產品名稱和價格，避免後續產品資料變更影響歷史訂單
3. **Decimal 類型**: 金額使用 Prisma.Decimal 類型處理，避免浮點數精度問題
4. **錯誤處理**: API 包含完整的錯誤處理和驗證

## 未來改進建議

1. 添加訂單搜尋和篩選功能
2. 實現付款整合 (Stripe, PayPal 等)
3. 添加訂單取消功能
4. 實現即時訂單狀態更新 (WebSocket)
5. 添加訂單評價功能
6. 支援訂單導出 (PDF, CSV)
