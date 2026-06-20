export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { executeQuery, getPool } from '@/lib/db';

// Interfaces matching the Client-Side schema
export interface OrderItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    category?: string;
    description?: string;
    image: string;
  };
  selectedVariant?: {
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Completed';
  createdAt: string;
}

export async function GET() {
  try {
    // Query both tables
    const dbOrders = await executeQuery('SELECT * FROM orders ORDER BY created_at DESC') as any[];
    const dbItems = await executeQuery('SELECT * FROM order_items') as any[];

    // Group items by order_id
    const itemsByOrderId: Record<string, OrderItem[]> = {};
    for (const item of dbItems) {
      if (!itemsByOrderId[item.order_id]) {
        itemsByOrderId[item.order_id] = [];
      }
      itemsByOrderId[item.order_id].push({
        menuItem: {
          id: item.menu_item_id,
          name: item.menu_item_name,
          price: parseFloat(item.menu_item_price),
          image: item.menu_item_image,
        },
        quantity: item.quantity,
      });
    }

    // Merge database rows into typed Order objects
    const orders: Order[] = dbOrders.map((order) => ({
      id: order.id,
      customerName: order.customer_name || '',
      tableNumber: order.table_number,
      total: parseFloat(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
      items: itemsByOrderId[order.id] || [],
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to retrieve orders from database:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, customerName, items, total } = body;

    if (!tableNumber || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields (tableNumber, customerName, items)' },
        { status: 400 }
      );
    }

    // Generate random 4 digit uppercase order ID
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date();

    const pool = await getPool();
    const connection = await pool.getConnection();

    try {
      // Execute within a database transaction
      await connection.beginTransaction();

      // 1. Insert main order row
      await connection.execute(
        'INSERT INTO orders (id, customer_name, table_number, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, customerName, tableNumber, total, 'Pending', createdAt]
      );

      // 2. Insert corresponding items
      for (const item of items) {
        const itemName = item.selectedVariant 
          ? `${item.menuItem.name} (${item.selectedVariant.name})`
          : item.menuItem.name;
        
        const itemPrice = item.selectedVariant 
          ? item.selectedVariant.price
          : item.menuItem.price;

        await connection.execute(
          'INSERT INTO order_items (order_id, menu_item_id, menu_item_name, menu_item_price, menu_item_image, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [
            orderId,
            item.menuItem.id,
            itemName,
            itemPrice,
            item.menuItem.image || '',
            item.quantity,
          ]
        );
      }

      await connection.commit();
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError;
    } finally {
      connection.release();
    }

    // Return the created order model matching the expected structure
    const createdOrder: Order = {
      id: orderId,
      customerName,
      tableNumber,
      items,
      total,
      status: 'Pending',
      createdAt: createdAt.toISOString(),
    };

    // Integrate with Midtrans
    const snapToken = await createMidtransTransaction(createdOrder);

    return NextResponse.json({ ...createdOrder, snapToken }, { status: 201 });
  } catch (error) {
    console.error('Failed to save order to database:', error);
    return NextResponse.json(
      { error: 'Failed to process order checkout request' },
      { status: 500 }
    );
  }
}

// Helper function to create Midtrans transaction
async function createMidtransTransaction(order: Order): Promise<string | null> {
  try {
    const midtransClient = require('midtrans-client');
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
    });

    const itemDetails = order.items.map((item) => ({
      id: item.menuItem.id,
      price: item.selectedVariant ? item.selectedVariant.price : item.menuItem.price,
      quantity: item.quantity,
      name: item.selectedVariant ? `${item.menuItem.name} (${item.selectedVariant.name})` : item.menuItem.name
    }));

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.total
      },
      customer_details: {
        first_name: order.customerName,
      },
      item_details: itemDetails
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
  } catch (err) {
    console.error('Midtrans Transaction Error:', err);
    return null;
  }
}
