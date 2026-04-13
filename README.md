<div align="center">

<img src="https://img.shields.io/badge/MedGenius_AI-Autonomous_Pathology_Intelligence-0a0a0a?style=for-the-badge&labelColor=00d4ff&color=0a0a0a" alt="MedGenius AI"/>

# 🧠 MedGenius AI

### Autonomous Multi-Agent Pathology Intelligence Platform

> *The first autonomous medical intelligence layer engineered to sit inside the pathology workflow — transforming raw lab data into real-time, predictive, and actionable clinical insights.*

<br/>

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![LangChain](https://img.shields.io/badge/LangChain-Orchestration-1C3C3C?style=flat-square&logo=chainlink&logoColor=white)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)](https://groq.com)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-9945FF?style=flat-square&logo=solana&logoColor=white)](https://solana.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Silver_Oak_University-Hackathon_2026-gold?style=flat-square)](.)

<br/>

<img src="https://img.shields.io/badge/⚡_Status-Active_Development-brightgreen?style=for-the-badge" />

</div>

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Multi-Agent Architecture](#-multi-agent-architecture)
- [Key Innovation Features](#-key-innovation-features)
- [System Architecture](#️-system-architecture)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [User Guide](#-user-guide)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Team](#-team)

---

## 🚨 The Problem

> **Pathology is the brain of healthcare — yet it's running on legacy logic.**

Every year, billions of lab reports are generated worldwide. Most are:

| Issue | Impact |
|-------|--------|
| ⏳ **24–48 hour turnaround** | Delayed diagnosis of time-critical conditions |
| 📄 **Static, unreadable PDFs** | Zero historical context for patients or doctors |
| 🔁 **Reactive care model** | Diseases flagged only *after* becoming symptomatic |
| 💊 **No medication cross-referencing** | Silent drug-lab interactions go undetected |
| 🧩 **Siloed data** | No connection between lab results, telemedicine, and care workflows |

**The result?** Normal-looking reports hide early-stage decline. Doctors make decisions without predictive context. Patients are left confused.

---

## 💡 Our Solution

MedGenius AI replaces the static pathology report with a **living, intelligent medical layer**.

Instead of reading a PDF, patients and doctors interact with an **autonomous multi-agent network** that:

- ✅ Generates structured clinical summaries in real-time
- ✅ Tracks biomarker trends over time, not just point-in-time values
- ✅ Forecasts disease risk **6–12 months in advance**
- ✅ Cross-references medications against live FDA data
- ✅ Triggers telemedicine consultations when risk thresholds are crossed
- ✅ Secures patient data with blockchain-level auditability

---

## 🤖 Multi-Agent Architecture

Unlike standard medical chatbots, MedGenius AI operates as a **self-governing medical intelligence network**. Five specialized agents collaborate simultaneously on every report upload.
```
┌─────────────────────────────────────────────────────────────────┐
│                     MEDGENIUS AI AGENT SWARM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Lab Upload / Patient Data Input                               │
│           │                                                     │
│           ▼                                                     │
│   ┌───────────────┐                                             │
│   │ Agentic Engine│  ◄── LangChain Orchestration Layer          │
│   └───────┬───────┘                                             │
│           │                                                     │
│    ┌──────┴──────┬──────────────┬───────────────┐               │
│    ▼             ▼              ▼               ▼               │
│ ┌──────┐    ┌────────┐   ┌──────────┐   ┌────────────┐         │
│ │Report│    │Quality │   │ Disease  │   │    Med     │         │
│ │  Gen │    │Control │   │Prediction│   │  Safety    │         │
│ │Agent │    │ Agent  │   │  Agent   │   │   Agent    │         │
│ └──┬───┘    └───┬────┘   └────┬─────┘   └─────┬──────┘         │
│    └────────────┴─────────────┴───────────────┘                │
│                             │                                   │
│                             ▼                                   │
│                  ┌─────────────────────┐                        │
│                  │  Care Coordinator   │  ◄── Master Orchestrator│
│                  └──────────┬──────────┘                        │
│                             │                                   │
│          ┌──────────────────┼──────────────────┐               │
│          ▼                  ▼                  ▼               │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │Doctor Portal│  │ Patient App  │  │Lab Dashboard │         │
│   │Telemed Bridge│  │Wellness Score│  │  Ops Sync    │         │
│   └─────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Agent Breakdown

| Agent | Responsibility | Core Technology |
|-------|---------------|-----------------|
| 🔬 **Report Gen Agent** | Converts raw lab values into structured, human-readable clinical summaries | Groq LLaMA 3.3 70B |
| 🛡️ **Quality Control Agent** | Performs consistency checks, flags anomalies, detects data entry errors | Rule-based Logic + AI |
| 🧬 **Disease Prediction Agent** | Analyzes biomarker velocity to forecast health risks 6–12 months in advance | Predictive Modeling |
| 💊 **Med Safety Agent** | Cross-references lab data with OpenFDA database for real-time drug interactions | OpenFDA API |
| 🤝 **Care Coordinator** | Master orchestrator — triggers telemedicine, follow-ups, and patient notifications | LangChain |

---

## 🚀 Key Innovation Features

### 📈 Biomarker Velocity Tracking
> *"Normal" doesn't mean safe — it means not yet dangerous.*

Traditional labs give you a snapshot. MedGenius AI gives you a **trajectory**. By tracking the *rate of change* in biomarker values across multiple reports, the system detects early-stage decline *before* values hit critical thresholds — a concept we call **Biomarker Velocity**.
```python
# Simplified Velocity Calculation
def calculate_biomarker_velocity(history: list[float], timestamps: list[datetime]) -> float:
    """
    Returns rate of change (units/month) for a given biomarker.
    Negative velocity on key markers = early warning signal.
    """
    delta_value = history[-1] - history[0]
    delta_time = (timestamps[-1] - timestamps[0]).days / 30
    return delta_value / delta_time if delta_time > 0 else 0.0
```

---

### 🏥 Telemedicine Bridge
One-click consultation triggered **automatically** when the AI detects a *Vitality Gap* — a divergence between current biomarker trajectory and optimal health baseline.

- Patient receives an in-app alert
- Doctor portal pre-loaded with AI-generated summary
- Consult scheduled within minutes, not days

---

### 🧪 Longevity Agent
Transforms a routine "Normal" report into a **Wellness Roadmap** by calculating:

- **Biological Age** vs. **Chronological Age** gap
- Organ Health Score (Liver, Kidney, Metabolic, Immune)
- 90-day personalized optimization recommendations

---

### 🔗 Blockchain Data Ownership
Patient data secured on **Solana** with:
- Immutable audit trail for every report and AI inference
- Patient-controlled access grants for providers
- HIPAA-compliant on-chain attestations
- Zero-knowledge proof support for sensitive fields

---

## 🛠️ System Architecture
```mermaid
graph TD
    A[Lab Uploads Data] --> B{Agentic Engine}
    B --> C[Report Gen Agent]
    B --> D[QC Agent]
    B --> E[Disease Prediction Agent]
    B --> F[Med Safety Agent]
    C & D & E & F --> G[Care Coordinator]
    G --> H[Doctor Portal: Telemed Bridge]
    G --> I[Patient App: Wellness Score]
    G --> J[Lab Dashboard: Ops Sync]
```

### Data Flow
```
Patient / Lab
     │
     ├─► [Data Ingestion Layer]     → Node.js API + Redis Queue
     │
     ├─► [Agent Orchestration]      → LangChain + LlamaIndex
     │
     ├─► [AI Inference]             → Groq (LLaMA 3.3 70B) via SDK
     │
     ├─► [FDA Cross-Reference]      → OpenFDA REST API
     │
     ├─► [Data Persistence]         → PostgreSQL + Redis Cache
     │
     ├─► [Blockchain Audit]         → Solana Devnet/Mainnet
     │
     └─► [Client Delivery]          → Next.js / React / Mobile
```

---

## ⚙️ Tech Stack

### AI & Intelligence Layer
| Component | Technology |
|-----------|-----------|
| Agent Orchestration | LangChain, LlamaIndex |
| Core LLM | LLaMA 3.3 70B via Groq SDK |
| Predictive Modeling | Custom biomarker velocity models |
| External Intelligence | OpenFDA API |

### Application Layer
| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend API | Node.js, Express |
| AI Services | Python (FastAPI) |
| Database | PostgreSQL, Redis |
| Security | Solana Blockchain, JWT, RBAC |

---

## 🏁 Getting Started

### Prerequisites

- Node.js `v18+`
- Python `3.9+`
- PostgreSQL `14+`
- Redis `7+`
- Groq Cloud API Key → [console.groq.com](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/utkarsh-barad/medgenius-ai
cd medgenius-ai
```

### 2. Install Dependencies
```bash
# Backend (Node.js)
cd backend && npm install

# Frontend (Next.js)
cd ../frontend && npm install

# AI Services (Python)
cd ../ai-services && pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the project root:
```env
# AI Configuration
GROQ_API_KEY=your_groq_api_key_here
FDA_API_KEY=your_fda_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medgenius
REDIS_URL=redis://localhost:6379

# Blockchain
SOLANA_NETWORK=devnet
SOLANA_WALLET_PRIVATE_KEY=your_wallet_key_here

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Database Setup
```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 5. Launch All Services

#### Quick Start (Automated)
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh
```

#### Manual Start
```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Frontend
npm run dev
```

Visit `http://localhost:8081` (or the port shown in terminal) to access the MedGenius AI dashboard.

---

## 📖 User Guide

### 📚 Complete Documentation

**Quick Links**:
- 📘 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index
- 📗 **[USER_GUIDE.md](USER_GUIDE.md)** - Detailed user guide with workflows
- 📙 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - One-page cheat sheet
- 📊 **[FLOWCHARTS.md](FLOWCHARTS.md)** - Visual flowcharts and diagrams
- 🔧 **[SETUP.md](SETUP.md)** - Installation and setup guide
- 📡 **[RUNNING_SERVICES.md](RUNNING_SERVICES.md)** - Service status and management

### Quick User Flows

#### 🔬 Lab Administrator Flow
```
Login → Lab Dashboard → Upload Report → Enter Patient Info → 
Run AI Analysis (5-10s) → Review Results → Assign to Doctor → Save
```
**Time**: ~2 minutes per report

#### 🩺 Doctor Flow
```
Login → Doctor Dashboard → Select Patient → Review 5 Tabs 
(Overview/Lab Results/Diagnosis/Risks/Medications) → 
Create Treatment Plan → Schedule Follow-up → Approve
```
**Time**: ~5-10 minutes per patient

#### 👤 Patient Flow
```
Login → Patient Portal → View Health Score → Check Reports → 
Monitor Trends → View Medications → Download PDF → 
Access AI Features (Biological Age/Digital Twin/Telemedicine)
```
**Time**: ~3-5 minutes per session

### Visual System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MEDGENIUS AI WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

    LAB ADMIN              AI SYSTEM           DOCTOR/PATIENT
        │                      │                      │
        │  1. Upload Report    │                      │
        ├─────────────────────>│                      │
        │                      │                      │
        │                 2. Process                  │
        │                 (5 Agents)                  │
        │                      │                      │
        │  3. Results Ready    │                      │
        │<─────────────────────┤                      │
        │                      │                      │
        │  4. Assign Doctor    │                      │
        ├─────────────────────>│                      │
        │                      │  5. Notification     │
        │                      ├─────────────────────>│
        │                      │                      │
        │                      │  6. Review & Approve │
        │                      │<─────────────────────┤
        │                      │                      │
        │                      │  7. Patient Access   │
        │                      ├─────────────────────>│
```

### Demo Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Lab Admin | lab@pathologyai.com | demo123 | /lab-dashboard |
| Doctor | doctor@pathologyai.com | demo123 | /doctor-dashboard |
| Patient | patient@pathologyai.com | demo123 | /patient-portal |

### Key Features by Role

**Lab Administrator**:
- Upload and process lab reports
- Run AI analysis (5 agents)
- Assign reports to doctors
- Quality control oversight
- View all patient records

**Doctor**:
- Review assigned patient reports
- Access AI-generated diagnoses
- View lab results and biomarkers
- Analyze risk assessments
- Check medication safety
- Create treatment plans

**Patient**:
- View personal health reports
- Track health score trends
- Monitor biomarker changes
- Check medication information
- Download PDF reports
- Access biological age analysis
- Real-time health monitoring
- Digital twin simulation
- Telemedicine consultations

---

## 📡 API Reference

### Upload Lab Report
```http
POST /api/v1/reports/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "file": <lab_report.pdf>,
  "patient_id": "uuid",
  "report_type": "CBC | LFT | KFT | LIPID | THYROID"
}
```

### Get Biomarker Velocity
```http
GET /api/v1/patients/:id/biomarker-velocity
Authorization: Bearer <token>

Response:
{
  "patient_id": "uuid",
  "biomarkers": {
    "hemoglobin": { "current": 11.2, "velocity": -0.3, "risk_flag": true },
    "creatinine": { "current": 0.9, "velocity": 0.05, "risk_flag": false }
  },
  "overall_risk_score": 72,
  "telemedicine_trigger": true
}
```

### Trigger Telemedicine Bridge
```http
POST /api/v1/telemedicine/trigger
Authorization: Bearer <token>

{
  "patient_id": "uuid",
  "risk_score": 72,
  "urgency": "high | medium | low"
}
```

---

## 📍 Roadmap
```
Q1 2026  ✅  Multi-agent core architecture
         ✅  Report Gen + QC Agent
         ✅  Biomarker Velocity Engine
         ✅  OpenFDA Med Safety Integration
         ✅  Telemedicine Bridge (v1)

Q2 2026  🔄  Longevity Agent (Biological Age Calculator)
         🔄  Solana Blockchain Audit Layer
         🔄  Mobile App (React Native)
         🔄  Doctor Portal Dashboard

Q3 2026  📋  Hospital EHR Integration (HL7 FHIR)
         📋  Multi-language Support (Hindi, Gujarati, Tamil)
         📋  Regulatory Filing (CDSCO Medical Device)
         📋  Pilot with diagnostic labs

Q4 2026  📋  B2B SaaS Launch
         📋  Series A Fundraise
         📋  Pan-India Lab Network
```

---

## 🌍 Vision

> **MedGenius AI is building the Intelligence Layer of Healthcare.**

We aren't digitizing records. We are making them **autonomous, predictive, and human-centric**.

The next decade of healthcare won't be won by better hospitals — it'll be won by better **data infrastructure**. MedGenius AI is that infrastructure: the layer between raw lab data and clinical decisions that makes every data point smarter, every report actionable, and every patient outcome better.

---

## 👨‍💻 Team

<table>
<tr>
<td align="center">
<b>Utkarsh Barad</b><br/>
<i>Founder & Lead Engineer</i><br/>
🏆 7x Hackathon Winner<br/>
🚀 Builder since age 18<br/>
Silver Oak University<br/>
<a href="https://github.com/utkarsh-barad">GitHub</a> · <a href="#">LinkedIn</a>
</td>
</tr>
</table>

**Team Udaan** · Silver Oak University · Hackathon 2026

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by Team Udaan**

*Transforming pathology from reactive to predictive — one biomarker at a time.*

⭐ **Star this repo** if you believe healthcare deserves better intelligence.

</div>
