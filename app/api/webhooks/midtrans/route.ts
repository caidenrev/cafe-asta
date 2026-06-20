import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { executeQuery, getPool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validasi Signature Key Midtrans
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const signatureKey = body.signature_key;

    // sha512(order_id + status_code + gross_amount + server_key)
    const hash = crypto.createHash('sha512');
    hash.update(orderId + statusCode + grossAmount + serverKey);
    const expectedSignature = hash.digest('hex');

    if (signatureKey !== expectedSignature) {
      console.error('Invalid signature key');
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    // Identifikasi status transaksi
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let orderStatusToUpdate = 'Pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatusToUpdate = 'Pending'; // Butuh manual verification
      } else if (fraudStatus === 'accept') {
        orderStatusToUpdate = 'Processing';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatusToUpdate = 'Processing';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatusToUpdate = 'Cancelled'; // atau dihapus / diabaikan
    } else if (transactionStatus === 'pending') {
      orderStatusToUpdate = 'Pending';
    }

    // Update status pesanan di database MySQL
    if (orderStatusToUpdate !== 'Pending') {
      const pool = await getPool();
      await pool.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [orderStatusToUpdate, orderId]
      );
      console.log(`Order ${orderId} status updated to ${orderStatusToUpdate} via webhook.`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Midtrans webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
