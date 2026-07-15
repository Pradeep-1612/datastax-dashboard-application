# DataOnTheHouse — Getting Started

Welcome! This folder contains standalone executables for **DataOnTheHouse**.
Just download the right file for your system and run it.

---

## Step 1 — Download the right file for your system

| Your system | File to use |
|---|---|
| Windows | `DataOnTheHouse-win.exe` |
| macOS (Intel or Apple Silicon) | `DataOnTheHouse-macos` |
| Linux | `DataOnTheHouse-linux` |

---

## Step 2 — Run it

---

### macOS

macOS will block the app the first time because it was not downloaded from the App Store.
Follow below steps **once** to unblock it:

**Terminal (quickest, one command):**

```bash
# Go to your Downloads folder (or wherever you saved the file)
cd ~/Downloads

# Remove the macOS quarantine flag
xattr -d com.apple.quarantine DataOnTheHouse-macos

# Make it executable
chmod +x DataOnTheHouse-macos

# Run it
./DataOnTheHouse-macos
```

---

### Windows

Double-click `DataOnTheHouse-win.exe`, or from a terminal:

```cmd
.\DataOnTheHouse-win.exe
```

If Windows Defender shows a SmartScreen warning, click **"More info"** → **"Run anyway"**.

---

### Linux

Open a terminal in the folder where you downloaded the file:

```bash
chmod +x DataOnTheHouse-linux
./DataOnTheHouse-linux
```

## Step 3 — Open the app

Once the executable is running, open your browser and go to:

```
http://localhost:3000
```

The DataOnTheHouse dashboard will load automatically.

---

## Stopping the app

Press `Ctrl + C` in the terminal window where the app is running.

---

## Changing the port (optional)

By default the app runs on port **3000**. To use a different port, set the `PORT` environment variable before running:

**macOS / Linux:**
```bash
PORT=8080 ./DataOnTheHouse-macos
```

**Windows:**
```cmd
set PORT=8080 && DataOnTheHouse-win.exe
```

---

## Troubleshooting

**"Port already in use" error**
Another process is using port 3000. Either stop that process or set a different `PORT` as shown above.

**Nothing loads in the browser**
Make sure the terminal shows `Server running on http://localhost:3000` before opening the browser.
