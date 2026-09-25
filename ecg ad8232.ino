/*
  ECG - Arduino with AD8232 module
  Wiring:
    OUTPUT -> A0
    LO+    -> D10
    LO-    -> D11
    3.3V   -> 3.3V
    GND    -> GND
  Note: Use 3-lead electrode placement (RA, LA, RL).
  Output: prints raw ECG waveform value over Serial, or -1 if leads are off.
*/

const int ECG_PIN = A0;
const int LO_PLUS = 10;
const int LO_MINUS = 11;

void setup() {
  Serial.begin(115200);
  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);
}

void loop() {
  if (digitalRead(LO_PLUS) == HIGH || digitalRead(LO_MINUS) == HIGH) {
    Serial.println(-1); // leads off patient
  } else {
    int ecgValue = analogRead(ECG_PIN);
    Serial.println(ecgValue);
  }
  delay(2); // ~500 Hz sampling, standard for ECG
}
