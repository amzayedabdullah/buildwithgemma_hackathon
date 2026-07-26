# 🇧🇩 Hisab.AI (হিসাব.এআই) — Built by Team BrainForge | UIU

[![Build with Gemma Bangladesh](https://img.shields.io/badge/Build_With_Gemma-Bangladesh_2026-emerald?style=for-the-badge&logo=google)](https://kaggle.com)
[![Team](https://img.shields.io/badge/Team-BrainForge_%7C_UIU-orange?style=for-the-badge)](https://uiu.ac.bd)
[![Model](https://img.shields.io/badge/Model-Google_Gemma_4_31B_IT-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/gemma)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel_Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**Hisab.AI (হিসাব.এআই)** is an AI-driven, voice-first financial operating system built by **Team BrainForge | UIU** for Bangladesh's **15 Million+ micro-retailers** (*Mudi Dokan*, tea stalls, local pharmacies). Powered by **Google Gemma 4 (`gemma-4-31b-it`)**, it converts spoken regional Bangla audio and text into a structured financial credit (*Baki*) ledger, provides POS cashmemo billing, automatically predicts credit default risks, and generates relationship-preserving payment reminders in natural Bangla.

---

## 🎯 Unsolved Problem & Hackathon Focus
In Bangladesh, over **$50 Billion** in micro-credit flows through traditional paper notebooks (*Baki Khata*). Busy shopkeepers cannot manually type complex digital app menus during rush hours, and standard speech recognition models fail on regional dialects (*Noakhali, Chittagong, Sylhet, Barisal, Rangpur, Mymensingh*).

Hisab.AI (হিসাব.এআই) solves this gap by allowing shopkeepers to simply tap one button, speak naturally in regional Bangla, or use 1-click POS terminal billing with zero login friction for judges.

---

## 🏗️ System Architecture

```
[ Regional Spoken Bangla Audio / Dialect Preset ] ──> [ Browser Web Speech API ]
                                                             │
                                                             ▼
[ Google AI Studio Gemma 4 API (gemma-4-31b-it) ] <──────────┘
                       │
                       ▼
    [ Structured Financial Transaction JSON ]
   { "customerName", "items", "total", "netBaki", "riskLevel" }
                       │
                       ▼
   [ Next.js Reactive Dashboard + LocalStorage DB + POS Billing + WhatsApp Reminders ]
```

---

## 🚀 Key Features

1. **🎙️ Voice-to-Ledger Automation**: Speaks natural Bangla -> Extracted JSON transaction itemization.
2. **🗣️ 7-Region Dialect Support**: Built-in audio samples for judges to test Noakhali, Chittagong, Sylhet, Barisal, Rangpur, Mymensingh, and Dhaka spoken dialect parsing.
3. **🏬 Dokandar Login & POS Billing Software**: Integrated POS terminal cashmemo billing with instant inventory click-and-add and receipt printing.
4. **⚠️ Default Credit Risk Analytics**: Real-time risk categorization (High/Medium/Low) based on overdue debt and frequency.
5. **📱 Relationship-Preserving Reminders**: Gemma 4 generated polite & firm Bangla payment reminder messages with 1-click WhatsApp web integration.
6. **🔑 Flexible API Key System**: Instant demo execution with server keys or optional custom Google AI Studio key input.

---

## 💻 Tech Stack
- **AI Core**: Google Gemma 4 (`gemma-4-31b-it`) via Google AI Studio API
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Voice Engine**: Web Speech API (`bn-BD`) + Browser SpeechSynthesis Engine
- **Database**: Real-time LocalStorage Synchronization + CSV Export
- **Deployment**: Vercel Serverless Platform Ready

---

## 📦 Local Installation

```bash
# Clone the repository
git clone https://github.com/amzayedabdullah/buildwithgemma_hackathon.git
cd buildwithgemma_hackathon

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open `http://localhost:3000` to interact with Hisab.AI (হিসাব.এআই)!

---

Developed with ❤️ by **Team BrainForge | UIU** for Build With Gemma @ Bangladesh Hackathon 2026.
