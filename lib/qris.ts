export const STATIC_QRIS = '00020101021126650013ID.CO.BCA.WWW011893600014000439327702150008850043932770303UKE51440014ID.CO.QRIS.WWW0215ID10264800258690303UKE5204581253033605802ID5912warkop astha6015JAKARTA SELATAN61051226062070703A0163041615';

export function generateDynamicQRIS(qrisString: string, amount: number): string {
  // Replace Point of Initiation Method from Static (11) to Dynamic (12)
  let payload = qrisString.replace('010211', '010212');
  
  // Remove existing CRC (last 8 characters)
  payload = payload.slice(0, -8);
  
  // Create Tag 54 for Transaction Amount
  const amountStr = amount.toString();
  const amountLength = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${amountLength}${amountStr}`;
  
  // Insert Tag 54 right before Tag 58 (Country Code) or append it if 58 is not found
  if (payload.includes('5802ID')) {
    payload = payload.replace('5802ID', `${tag54}5802ID`);
  } else {
    payload += tag54;
  }

  
  // Add Tag 63 ID and length (04)
  payload += '6304';
  
  // Calculate CRC16 CCITT
  const crc = crc16ccitt(payload);
  
  return payload + crc;
}

function crc16ccitt(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021);
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
