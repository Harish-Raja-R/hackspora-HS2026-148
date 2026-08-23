# 🛡️ SCAMCHECK — AI Opportunity Intelligence

> **"Don't just detect scams. Investigate the opportunity."**  
> *AI-powered threat verification for internships, jobs, scholarships, and online opportunities.*

---

## 🌟 Overview

**SCAMCHECK** is a competition-grade cybersecurity and AI opportunity intelligence platform designed to protect students, early-career engineers, and professionals from fraudulent job offers, advance-fee internships, task-based rating scams, and phantom scholarship programs.

Moving beyond simple sentiment or binary spam classifiers, SCAMCHECK performs a multi-dimensional forensic investigation across **22+ deterministic scam pattern rules**, entity recognition, domain & recruiter consistency matrices, and explainable evidence chains.

---

## 🚀 Key Features

- **Multi-Modal Intake Station:**
  - 📝 **Paste Text:** Job/internship offer letters, recruiter emails, WhatsApp/Telegram messages, and DMs.
  - 📄 **Upload Document:** Automatic text parsing of `.pdf`, `.docx`, and `.txt` files.
  - 🖼️ **Screenshot OCR:** Optical character recognition via Tesseract for mobile chat screenshots.
  - 🔗 **Analyze URL:** Sandboxed web inspector evaluating domains, lookalikes, and unverified Google Forms.

- **Live SOC Radar Pipeline:**
  - Real-time animated cyber investigation feed displaying step-by-step triage from content normalization to brand detection, domain consistency, pattern matching, and score synthesis.

- **Hybrid Risk & Assessment Confidence Engine:**
  - **Risk Score (0–100):** Calibrated into `LOW RISK`, `NEEDS VERIFICATION`, and `HIGH RISK`.
  - **Assessment Confidence (0–100%):** Separated from the risk score to ensure uncertainty is never equated with safety.

- **Explainable Evidence Chain:**
  - Interactive expandable visual graph linking **Finding $\rightarrow$ Verbatim Extracted Quote $\rightarrow$ Security Rationale $\rightarrow$ Risk Contribution (+35, +25, -15)**.

- **5-Point Organization Intelligence Matrix:**
  - Evaluates Organization Identity, Official Domain, Recruiter Domain, Application Ingestion Platform, and Recruitment Workflow.

- **Multi-Dimensional Potential Exposure:**
  - Quantifies threat surfaces across Financial ($/₹), Credential Takeover, Identity Document Theft, Labor Exploitation, and Contact Privacy.

- **Responsible AI Refusal Gate:**
  - *"ScamCheck does not guess when evidence is insufficient."* Inconclusive submissions trigger an explicit information gap breakdown and guidance on what proof to request from the recruiter.

- **Dual-Pane Comparison Workspace:**
  - Side-by-side comparative analysis of two opportunities with comparative delta metrics, key differences, and safer option recommendations.

- **Threat Telemetry Dashboard & Case History:**
  - Real-time KPI metrics, tri-color risk distribution meters, top threat pattern histograms, and persistent case history with search and PDF export.

---

## 🏗️ Architecture

```
SCAMCHECK/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Investigation & comparison controllers
│   │   ├── engine/              # Hybrid risk engine, 22+ rules, consistency matrix, confidence engine
│   │   ├── parsers/             # PDF, DOCX, OCR, URL parsers
│   │   ├── routes/              # Express API endpoints
│   │   ├── data/                # Benchmark demo cases & known enterprise databases
│   │   └── server.ts            # Server entry point (Port 5001)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Cyber SOC Dark UI components
│   │   ├── services/            # API client & local persistence storage
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Main view coordinator
│   │   ├── main.tsx
│   │   └── index.css            # Tailwind + Glassmorphic design tokens
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
└── tests/
    └── test_risk_engine.ts      # 29 automated test cases (100% precision)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5001` (Health: `http://localhost:5001/api/health`)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 4. Run Automated Test Suite
```bash
cd backend
npm test
```

---

## 🛡️ Responsible AI Disclosure

ScamCheck provides algorithmic risk indicators and evidence-based threat signals, not definitive legal proof of criminal fraud. Always independently verify high-impact academic, financial, and career opportunities through official corporate channels.

---

*SCAMCHECK // 2026*
