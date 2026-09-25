import streamlit as st
import numpy as np
import pandas as pd
from openai import OpenAI

# API Configuration
API_KEY = "--API-KEY--"  # Replace with your actual API key
BASE_URL = "https://api.perplexity.ai"
MODEL_NAME = "sonar-pro"

# Initialize Perplexity Client
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

# Streamlit Page Config & Styling
st.set_page_config(page_title="🏥 Medical AI Chatbot", layout="wide")

st.markdown("""
    <style>
        .reportview-container { background: #f8f9fa; }
        .stTextInput, .stTextArea { border-radius: 10px; padding: 15px; font-size: 18px; }
        .message-container { padding: 15px; border-radius: 10px; margin-bottom: 10px; font-size: 18px; }
        .user-message { background-color: #cce5ff; color: black; }
        .ai-message { background-color: #e6e6e6; color: black; }
        .stress-box { padding: 15px; border-radius: 10px; text-align: center; font-size: 20px; font-weight: bold; }
        .low-stress { background-color: #d4edda; color: #155724; }
        .moderate-stress { background-color: #fff3cd; color: #856404; }
        .high-stress { background-color: #f8d7da; color: #721c24; }
        .stButton>button { font-size: 18px !important; padding: 10px 20px; border-radius: 8px; }
        .stMarkdown { font-size: 18px; }
    </style>
""", unsafe_allow_html=True)

# App Title
st.title("🤖 Mitra - Personalized Health Assistant")

# *User Selectable Health Parameters*
st.sidebar.header("⚙ Select Health Monitoring Parameters:")
heart_rate_enabled = st.sidebar.checkbox("Heart Rate (BPM)", value=True)
gsr_enabled = st.sidebar.checkbox("Galvanic Skin Response (GSR)", value=True)
bp_enabled = st.sidebar.checkbox("Blood Pressure", value=True)
resp_rate_enabled = st.sidebar.checkbox("Respiratory Rate", value=False)  
blood_sugar_enabled = st.sidebar.checkbox("Blood Sugar Level", value=False)  

# Generate Demo Health Data
def generate_demo_health_data():
    np.random.seed(42)
    return pd.DataFrame({
        "heart_rate": np.random.randint(60, 120, 10),
        "gsr": np.random.uniform(0.5, 5.0, 10),
        "blood_pressure": np.random.randint(110, 160, 10),
        "respiratory_rate": np.random.randint(12, 30, 10),
        "blood_sugar": np.random.randint(70, 200, 10)
    })

# Classify Stress & Health Risks
def assess_health_status(df):
    risks = []
    
    if heart_rate_enabled and df["heart_rate"].iloc[-1] > 100:
        risks.append("High Heart Rate")
    if gsr_enabled and df["gsr"].iloc[-1] > 3.0:
        risks.append("Elevated Skin Response")
    if bp_enabled and df["blood_pressure"].iloc[-1] > 140:
        risks.append("High Blood Pressure")
    if resp_rate_enabled and df["respiratory_rate"].iloc[-1] > 22:
        risks.append("Rapid Breathing")
    if blood_sugar_enabled and df["blood_sugar"].iloc[-1] > 150:
        risks.append("Elevated Blood Sugar")

    if len(risks) > 2:
        return "High Health Risk", "high-stress", risks
    elif len(risks) == 1:
        return "Moderate Health Risk", "moderate-stress", risks
    else:
        return "Low Health Risk", "low-stress", ["Normal Readings"]

# Function to Determine Stress Response
def fetch_stress_level_response():
    if health_status == "High Health Risk":
        return "⚠ You are experiencing high stress. Consider relaxation techniques, hydration, and consulting a doctor."
    elif health_status == "Moderate Health Risk":
        return "🔶 You have moderate stress levels. Try deep breathing, light exercise, or listening to music."
    else:
        return "✅ Your stress level is low. Keep maintaining a healthy lifestyle!"

# Generate & Analyze Health Data
df = generate_demo_health_data()
health_status, stress_class, reasons = assess_health_status(df)

st.subheader("📊 Your Health Assessment:")
st.markdown(f'<div class="stress-box {stress_class}">{health_status}</div>', unsafe_allow_html=True)
st.write("*Health Indicators:*", ", ".join(reasons))

# *Medical Chat Section*
st.subheader("💬 Chat with the AI Doctor")

# Initialize Chat History
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "You are a medical AI chatbot that provides health advice based on user data."}
    ]

# Display Chat History
for message in st.session_state.messages[1:]:  
    role, content = message["role"], message["content"]
    class_name = "user-message" if role == "user" else "ai-message"
    st.markdown(f'<div class="message-container {class_name}"><b>{role.capitalize()}:</b> {content}</div>', unsafe_allow_html=True)

# User Input
user_input = st.text_area("💬 Ask a medical question:", key="user_input", height=100)

# Generate AI Response
if st.button("Send", help="Send your query to the AI chatbot"):
    if user_input.strip() == "":
        st.warning("Please enter a question!")
    else:
        st.session_state.messages.append({"role": "user", "content": user_input})

        # Detect stress-related questions
        if any(kw in user_input.lower() for kw in ["stress level", "how stressed", "am I stressed"]):
            response_text = fetch_stress_level_response()
        elif any(kw in user_input.lower() for kw in ["how to manage stress", "reduce stress", "relieve stress"]):
            response_text = "🧘 To reduce stress, try mindfulness meditation, deep breathing, regular exercise, and getting enough sleep."
        else:
            try:
                with st.spinner("🤖 Thinking..."):
                    response = client.chat.completions.create(
                        model=MODEL_NAME,
                        messages=st.session_state.messages
                    )
                    response_text = response.choices[0].message.content
            except Exception as e:
                response_text = f"⚠ Error: {e}"

        # Append AI Response
        st.session_state.messages.append({"role": "assistant", "content": response_text})
        st.markdown(f'<div class="message-container ai-message"><b>AI:</b> {response_text}</div>', unsafe_allow_html=True)

# Clear Chat Button
if st.button("🗑 Clear Chat", help="Clear chat history"):
    st.session_state.messages = [{"role": "system", "content": "You are a medical AI chatbot that provides health advice based on user data."}]
    st.experimental_rerun()