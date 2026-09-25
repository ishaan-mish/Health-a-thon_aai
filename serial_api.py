import asyncio
import json
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import serial

SERIAL_PORT = "/dev/ttyUSB0"  # change to your port, e.g. "COM3"
BAUD_RATE = 115200

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this for production
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_reading = {"raw": None, "bpm": None, "timestamp": None}
ser = None


@app.on_event("startup")
async def startup():
    global ser
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    asyncio.create_task(read_serial_loop())


async def read_serial_loop():
    global latest_reading
    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if line and "," in line:
            try:
                raw, bpm = line.split(",")
                latest_reading = {
                    "raw": int(raw),
                    "bpm": float(bpm),
                    "timestamp": datetime.now().isoformat(),
                }
            except ValueError:
                pass
        await asyncio.sleep(0.005)


@app.get("/latest")
async def get_latest():
    return latest_reading


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_text(json.dumps(latest_reading))
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        pass