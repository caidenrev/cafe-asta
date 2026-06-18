import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'warkop123';

    if (password === correctPassword) {
      // Set session cookie
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 minggu
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan' }, { status: 500 });
  }
}
