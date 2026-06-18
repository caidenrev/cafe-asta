export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['Pending', 'Processing', 'Completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing status update parameter' },
        { status: 400 }
      );
    }

    // Execute UPDATE query in MySQL
    const result = await executeQuery(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    ) as any;

    // Verify if order exists
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ id, status });
  } catch (error) {
    console.error('Failed to update order status in database:', error);
    return NextResponse.json(
      { error: 'Failed to process order update request' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch order from database
    const dbOrders = await executeQuery('SELECT * FROM orders WHERE id = ?', [id]) as any[];
    
    if (dbOrders.length === 0) {
      return NextResponse.json(
        { error: `Order with ID ${id} not found` },
        { status: 404 }
      );
    }

    const order = dbOrders[0];

    // Fetch items for this order
    const dbItems = await executeQuery('SELECT * FROM order_items WHERE order_id = ?', [id]) as any[];

    const items = dbItems.map((item) => ({
      menuItem: {
        id: item.menu_item_id,
        name: item.menu_item_name,
        price: parseFloat(item.menu_item_price),
        image: item.menu_item_image || '',
      },
      quantity: item.quantity,
    }));

    return NextResponse.json({
      id: order.id,
      customerName: order.customer_name || '',
      tableNumber: order.table_number,
      total: parseFloat(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
      items,
    });
  } catch (error) {
    console.error('Failed to retrieve order status from database:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order status' },
      { status: 500 }
    );
  }
}
