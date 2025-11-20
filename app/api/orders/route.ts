import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// POST /api/orders - 創建新訂單
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, paymentMethod } = body;

    // 驗證必要欄位
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // 計算小計和總計
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal; // 目前沒有額外費用

    // 生成訂單編號
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;

    // 使用交易創建訂單和訂單項目
    const order = await prisma.$transaction(async (tx) => {
      // 創建訂單
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
          total: new Prisma.Decimal(total.toFixed(2)),
          status: "PENDING",
          paymentMethod,
          estimatedTime: 15,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              quantity: item.quantity,
              price: new Prisma.Decimal(item.price.toFixed(2)),
              subtotal: new Prisma.Decimal(
                (item.price * item.quantity).toFixed(2)
              ),
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: Number(order.subtotal),
          total: Number(order.total),
          status: order.status,
          paymentMethod: order.paymentMethod,
          estimatedTime: order.estimatedTime,
          createdAt: order.createdAt.toISOString(),
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: Number(item.price),
            subtotal: Number(item.subtotal),
            image: item.product.image,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders - 獲取訂單列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        total: Number(order.total),
        status: order.status,
        paymentMethod: order.paymentMethod,
        estimatedTime: order.estimatedTime,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
          image: item.product.image,
        })),
      })),
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
