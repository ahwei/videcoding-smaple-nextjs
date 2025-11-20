import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: "CREDIT_CARD" | "MASTERCARD" | "VISA" | "APPLE_PAY";
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderRequest = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    // Get product details for items
    const productIds = body.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products not found" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: Array<{
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
      productId: string;
    }> = [];

    for (const item of body.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      const price = parseFloat(product.price.toString());
      const itemSubtotal = price * item.quantity;

      orderItems.push({
        productName: product.name,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
        productId: product.id,
      });

      subtotal += itemSubtotal;
    }

    const total = subtotal; // Can add tax/fees here if needed

    // Generate order number
    const orderNumber = `#${Math.random().toString().slice(2, 8).padStart(6, "0")}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        status: "PENDING",
        paymentMethod: body.paymentMethod,
        userId: body.userId || null,
        items: {
          create: orderItems.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number
    const serializedOrders = orders.map((order) => ({
      ...order,
      subtotal: parseFloat(order.subtotal.toString()),
      total: parseFloat(order.total.toString()),
      items: order.items.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
