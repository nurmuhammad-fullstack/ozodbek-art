const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8263605074:AAG3cIDxY-CnZpXWtUE5MfmPwPDmG541Ms8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '5337490769';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

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
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ ok: false, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API endpoint for orders
  if (req.url === '/api/order' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const orderData = JSON.parse(body);
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
          `🌐 *Manba:* OZODBEK-ART rasmiy do'koni`;

        const tgResult = await sendTelegramMessage(messageText);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: tgResult.ok, result: tgResult }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
