const https = require('https');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8263605074:AAG3cIDxY-CnZpXWtUE5MfmPwPDmG541Ms8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '5337490769';

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ ok: false, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    let orderData = req.body;
    if (typeof orderData === 'string') {
      try { orderData = JSON.parse(orderData); } catch(e) {}
    }
    orderData = orderData || {};

    const { orderId, name, phone, address, paymentMethod, comment, itemsText, totalText, dateStr } = orderData;

    const messageText = `🛍 *YANGI BUYURTMA QABUL QILINDI!*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 *Buyurtma ID:* \`#${orderId || 'ORD-000'}\`\n` +
      `👤 *Mijoz:* ${name || "Noma'lum"}\n` +
      `📞 *Telefon:* ${phone || "Noma'lum"}\n` +
      `📍 *Manzil:* ${address || "Belgilanmagan"}\n` +
      `💳 *To'lov usuli:* ${paymentMethod || "Naqd"}\n` +
      `💬 *Izoh:* ${comment || "Yo'q"}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *BUYURTMA TARKIBI:*\n${itemsText || "Mahsulotlar"}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *JAMI SUMMA:* *${totalText || "0 so'm"}*\n` +
      `🕒 *Vaqt:* ${dateStr || new Date().toLocaleString()}\n` +
      `🌐 *Manba:* OZODBEK-ART (Vercel)`;

    const tgResult = await sendTelegramMessage(messageText);
    return res.status(200).json({ ok: tgResult.ok, result: tgResult });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
