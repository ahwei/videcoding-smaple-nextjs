// 訂單相關的工具函數

/**
 * 將訂單項目轉換為購物車項目格式
 */
export function convertOrderItemsToCart(orderItems: any[]) {
  return orderItems.map((item) => ({
    id: item.productId,
    name: item.productName,
    description: "", // 可以從產品資料獲取
    price: item.price,
    calories: 0, // 可以從產品資料獲取
    image: item.image,
    quantity: item.quantity,
  }));
}

/**
 * 格式化訂單狀態為中文
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "待付款",
    CONFIRMED: "已確認",
    PREPARING: "準備中",
    READY: "已完成",
    DELIVERED: "已送達",
    CANCELLED: "已取消",
  };
  return statusMap[status] || status;
}

/**
 * 格式化付款方式為中文
 */
export function formatPaymentMethod(method: string): string {
  const methodMap: Record<string, string> = {
    CREDIT_CARD: "信用卡",
    MASTERCARD: "Mastercard",
    VISA: "Visa",
    APPLE_PAY: "Apple Pay",
  };
  return methodMap[method] || method;
}
