import argparse
import csv
import time
from collections import deque
from datetime import datetime

import matplotlib.animation as animation
import matplotlib.pyplot as plt
import serial


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--port", required=True, help="Serial port, e.g. COM3 or /dev/ttyUSB0"
    )
    parser.add_argument("--baud", type=int, default=115200)
    parser.add_argument(
        "--log", default="pulse_log.csv", help="Output CSV log file"
    )
    parser.add_argument(
        "--no-plot", action="store_true", help="Disable live plotting"
    )
    return parser.parse_args()


def main():
    args = parse_args()
    ser = serial.Serial(args.port, args.baud, timeout=1)
    time.sleep(2)  # allow Arduino to reset after serial connection opens

    log_file = open(args.log, "w", newline="")
    writer = csv.writer(log_file)
    writer.writerow(["timestamp", "raw_signal", "bpm"])

    window = 200
    signal_buffer = deque([0] * window, maxlen=window)
    bpm_buffer = deque([0] * window, maxlen=window)

    print(f"Reading from {args.port} @ {args.baud} baud. Ctrl+C to stop.")

    if args.no_plot:
        try:
            while True:
                line = (
                    ser.readline()
                    .decode("utf-8", errors="ignore")
                    .strip()
                )
                if not line or "," not in line:
                    continue
                raw, bpm = line.split(",")
                ts = datetime.now().isoformat()
                writer.writerow([ts, raw, bpm])
                log_file.flush()
                print(f"{ts}  raw={raw}  bpm={bpm}")
        except KeyboardInterrupt:
            pass
        finally:
            ser.close()
            log_file.close()
        return

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))
    (line1,) = ax1.plot(signal_buffer)
    (line2,) = ax2.plot(bpm_buffer, color="red")

    ax1.set_title("Raw Pulse Signal")
    ax2.set_title("BPM")
    ax2.set_ylim(30, 200)

    def update(frame):
        raw_line = ser.readline().decode("utf-8", errors="ignore").strip()
        if raw_line and "," in raw_line:
            raw, bpm = raw_line.split(",")
            try:
                raw_val = int(raw)
                bpm_val = float(bpm)
            except ValueError:
                return line1, line2

            ts = datetime.now().isoformat()
            writer.writerow([ts, raw_val, bpm_val])
            log_file.flush()

            signal_buffer.append(raw_val)
            bpm_buffer.append(bpm_val)

            line1.set_ydata(signal_buffer)
            line1.set_xdata(range(len(signal_buffer)))
            ax1.relim()
            ax1.autoscale_view()

            line2.set_ydata(bpm_buffer)
            line2.set_xdata(range(len(bpm_buffer)))

        return line1, line2

    ani = animation.FuncAnimation(fig, update, interval=20, blit=False)

    try:
        plt.tight_layout()
        plt.show()
    finally:
        ser.close()
        log_file.close()


if __name__ == "__main__":
    main()