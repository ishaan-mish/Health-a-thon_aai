/*
  Pulse Sensor - Arduino
  Works with: Pulse Sensor Amped (analog output), or any analog PPG sensor
  Wiring:
    Sensor S -> A0
    Sensor + -> 5V
    Sensor - -> GND
  Output: prints raw signal + calculated BPM over Serial (for Python to read)
*/

const int PULSE_PIN = A0;
const int LED_PIN = 13;          // optional: blinks on each heartbeat
const int THRESHOLD = 550;       // adjust based on your sensor's baseline noise

unsigned long lastBeatTime = 0;
unsigned long lastSampleTime = 0;
int sampleIntervalMs = 5;        // ~200 Hz sampling

bool pulseSignalHigh = false;
float bpm = 0;

const int RATE_SIZE = 5;         // rolling average window
unsigned long rateBuffer[RATE_SIZE];
int rateIndex = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  for (int i = 0; i < RATE_SIZE; i++) rateBuffer[i] = 0;
}

void loop() {
  unsigned long now = millis();
  if (now - lastSampleTime < sampleIntervalMs) return;
  lastSampleTime = now;

  int signalValue = analogRead(PULSE_PIN);

  // simple peak detection
  if (signalValue > THRESHOLD && !pulseSignalHigh) {
    pulseSignalHigh = true;
    unsigned long beatInterval = now - lastBeatTime;
    lastBeatTime = now;

    if (beatInterval > 300 && beatInterval < 2000) { // filters noise (30-200 BPM range)
      rateBuffer[rateIndex++] = beatInterval;
      rateIndex %= RATE_SIZE;

      unsigned long sum = 0;
      for (int i = 0; i < RATE_SIZE; i++) sum += rateBuffer[i];
      float avgInterval = sum / (float)RATE_SIZE;
      bpm = 60000.0 / avgInterval;

      digitalWrite(LED_PIN, HIGH);
    }
  } else if (signalValue < THRESHOLD) {
    pulseSignalHigh = false;
    digitalWrite(LED_PIN, LOW);
  }

  // CSV output: raw_signal,bpm  (easy for Python / Serial Plotter to parse)
  Serial.print(signalValue);
  Serial.print(",");
  Serial.println(bpm);
}
