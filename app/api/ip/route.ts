export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';

    // Loop through network interfaces to find the LAN IPv4 address
    for (const name of Object.keys(interfaces)) {
      const ifaceList = interfaces[name];
      if (ifaceList) {
        for (const iface of ifaceList) {
          // Skip internal loopback addresses (like 127.0.0.1)
          if (iface.family === 'IPv4' && !iface.internal) {
            localIp = iface.address;
            break;
          }
        }
      }
      if (localIp !== 'localhost') break;
    }

    return NextResponse.json({ ip: localIp });
  } catch (error) {
    console.error('Failed to detect server IP:', error);
    return NextResponse.json({ ip: 'localhost' });
  }
}
