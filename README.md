# HPRT TP808S QR & Image Printer (Node.js)

This project allows you to print a **QR code** or a **custom image** to an **HPRT TP808S Wi-Fi thermal printer** using Node.js.

---

## ✅ Features

* 📷 Print a custom image (JPG/PNG)
* 🔳 Generate and print a QR code
* 🛱 Send print job via Wi-Fi using TCP/IP
* 🧠 Image processing with `sharp`
* 📨 ESC/POS printer support

---

## 📦 Requirements

* Node.js v14 or later
* HPRT TP808S connected via Wi-Fi
* Valid printer IP address (edit in code)
* Supported image formats: JPG, PNG

---

## 🛠 Installation

1. Clone or download this project:

```
git clone https://github.com/jcard202/img2ecspos.git
cd img2ecspos
```

2. Install dependencies:

```
npm install
```

---

## ✏️ Configuration

### 1. Set your printer IP address

Edit this line in `index.js`:

```
const PRINTER_IP = '192.168.31.39'; // Replace with your printer IP
```

### 2. Customize QR Code URL (optional)

If no image is passed, a default QR code is printed. You can customize the QR data:

```
const qrText = 'https://example.com'; // Change to your desired QR code value
```

---

## 🚀 Usage

### Option 1: Print a QR Code

Run without arguments to print a QR code:

```
node index.js
```

### Option 2: Print a Custom Image

Pass a file path as argument (JPG or PNG only):

```
node index.js ./images/sample.jpg
```

> 🧠 Note: Image will be automatically resized and processed to fit 384px width.

---

## 🖼 Example Output

```
node index.js qrsampledata
✔️ Printed QR code with value of "qrsampledata" to printer at 192.168.31.39

node index.js ./assets/logo.png
✔️ Printed image to printer at 192.168.31.39
```

---

## 📁 Project Structure

```
hprt_qr_node2/
├── index.js           # Main script to run
├── package.json       # Project dependencies
├── temp_qr.png        # Temporary QR image file (auto-generated)
└── README.md          # Documentation (this file)
```

---

## 🔍 Troubleshooting

* **Printer not printing?** Check the IP and power connection.
* **Image not showing correctly?** Use simple, high-contrast images.
* **BMP not working?** Only PNG and JPG are supported for conversion and print.
