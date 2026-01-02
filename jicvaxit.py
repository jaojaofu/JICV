import streamlit as st
import google.generativeai as genai
import os

# Lấy API Key từ hệ thống (Secret) để bảo mật
api_key = st.secrets["GOOGLE_API_KEY"]
genai.configure(api_key=api_key)

st.set_page_config(page_title="AI App của tôi", page_icon="🤖")
st.title("🤖 Trợ lý Gemini")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Hỏi tôi bất cứ điều gì..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        st.markdown(response.text)
        st.session_state.messages.append({"role": "assistant", "content": response.text})
