const escpos = require('escpos');
escpos.Network = require('escpos-network');
const QRCode = require('qrcode');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// IP address of your printer
const PRINTER_IP = '192.168.31.39';
const TEMP_FILE = path.join(__dirname, 'temp_qr.png');

// Optional image path argument: `node index.js custom-image.jpg`
const imagePathArg = process.argv[2];

async function prepareImageBuffer() {
  if (imagePathArg) {
    console.log(`🖼️ Using custom image: ${imagePathArg}`);
    const inputPath = path.resolve(imagePathArg);

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Image file does not exist: ${inputPath}`);
    }

    // Convert image to 3-channel PNG for escpos
    return await sharp(inputPath)
      .resize({ width: 384, fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png({ compressionLevel: 0 })
      .toBuffer();
  } else {
    console.log('🔳 Generating QR code...');
    const qrText = 'https://example.com';
    const qrBuffer = await QRCode.toBuffer(qrText, { type: 'png', width: 384 });

    return await sharp(qrBuffer)
      .resize({ width: 384 })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png({ compressionLevel: 0 })
      .toBuffer();
  }
}

(async () => {
  try {
    const imageBuffer = await prepareImageBuffer();
    fs.writeFileSync(TEMP_FILE, imageBuffer);

    escpos.Image.load(TEMP_FILE, function (image) {
      const device = new escpos.Network(PRINTER_IP);
      const printer = new escpos.Printer(device);

      device.open(function (err) {
        if (err) {
          console.error('❌ Printer connection error:', err);
          cleanupTempFile();
          return;
        }

        printer
          .align('ct')
          .image(image, 'd24')
          .then(() => {
            printer.feed(3).cut().close();
            console.log('✅ Printed successfully');
            cleanupTempFile();
          })
          .catch(err => {
            console.error('❌ Print error:', err);
            cleanupTempFile();
          });
      });
    });
  } catch (err) {
    console.error('❌ Error:', err);
    cleanupTempFile();
  }
})();

function cleanupTempFile() {
  if (fs.existsSync(TEMP_FILE)) {
    fs.unlink(TEMP_FILE, err => {
      if (err) {
        console.error('⚠️ Failed to delete temp file:', err);
      } else {
        console.log('🧹 Temp file deleted');
      }
    });
  }
}

