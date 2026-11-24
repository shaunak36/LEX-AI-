# ⚖️ LexAI — AI-Powered Legal Document Intelligence Platform

> Built for Indian legal workflows. Analyse contracts, verify clauses, flag risks, and manage client matters — all in one platform.

![LexAI](https://img.shields.io/badge/LexAI-Legal%20AI-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8) ![Vite](https://img.shields.io/badge/Vite-Build-646CFF)

---

## 📌 About

LexAI is an AI-powered legal document intelligence platform designed for Indian law firms, corporate legal teams, and legal departments. It aims to automate the most time-consuming parts of legal work — reading contracts, identifying risks, tracking obligations, managing clients, and routing documents through internal approval chains.

---

## 🚦 Current Status (Read This First)

LexAI is an **academic prototype**. The frontend is complete, but most analysis output is still **sample data**. Only the AI chat assistant talks to a real model.

| Area | Status |
|------|--------|
| Frontend UI (all pages) | ✅ Built |
| Role-based login / auth system | ✅ Built (see commit history) |
| Fine-tuned model (Qwen3-14B, Indian law) | ✅ Trained on Google Colab (LoRA / Unsloth, ~47K legal Q&A pairs) |
| AI Legal Assistant chat → Ollama | ✅ Working (`/api/chat`) |
| Ollama connection check + model list | ✅ Working (`/api/tags`) |
| Document upload & analysis | ⚠️ **Mocked** — simulated delay and canned results, not sent to the model |
| Clause verification, risk analysis, memo, obligations, defined terms | ⚠️ **Sample data** — hardcoded for 2 demo contracts |
| Local GGUF export for Ollama | 🕒 Planned |
| Backend REST API | 🚧 Separate backend repo, not yet wired into this frontend |
| Vector DB / RAG (ChromaDB) | 🕒 Planned (settings placeholder only) |

### What is real vs. simulated

- **Real:** The AI Assistant sends your question plus the selected document's context to an Ollama server and shows the model's reply.
- **Fallback:** If Ollama isn't connected, the assistant switches to a built-in keyword-matching "simulation engine" that answers from the sample data. The app still works, but these answers are **not** from an AI model.
- **Simulated:** Uploading a PDF/DOCX does not run any real analysis. The result is generated from templates (it only checks whether the filename looks like an NDA).

---

## 🚀 Features

### 🔵 Core — Contract Intelligence
| Page | Description |
|------|-------------|
| Dashboard | Overview of contracts, risk stats, health scores, and recent activity |
| Contract Analysis | Document summary — parties, jurisdiction, date, plain-English overview |
| Upload Documents | Drag-and-drop PDF/DOCX upload *(analysis is simulated)* |
| Clause Verification | Present / Missing / Modified clauses with confidence scores |
| Risk Analysis | High / Medium / Low risks with fix recommendations |
| Missing Clause Checklist | Missing clauses with criticality and suggested standard language |
| Memo Generator | Professional legal memo summarising risks and findings |
| Defined Terms Dictionary | Defined terms with page references |
| Obligation Tracker | Obligations per party — what, who, when, status |
| Multi Contract Comparison | Side-by-side comparison of two contracts |

### 🟣 Contracts+ — Advanced Legal Tools
| Page | Description |
|------|-------------|
| Negotiation Assistant | Negotiation positions and counter-language for risky clauses |
| Templates Library | Standard Indian legal contract templates |
| eSign Integration | Digital signature flow (Aadhaar-based eSign, UI only) |
| Limitation Tracker | Legal limitation period tracking |

### 🟡 LexCase — Client & Matter Management
| Page | Description |
|------|-------------|
| Client Portal | Clients, matters, documents, messages, and activity |
| Approval Workflows | Internal approval chain with stage tracking, comments, escalation |

### ⚙️ System
| Page | Description |
|------|-------------|
| AI Legal Assistant | Chat panel on every screen — ask questions about the active contract (**live with Ollama**) |
| Settings | Ollama URL and model, connection test, theme (light/dark), interface font, vector DB placeholder |

---

## 🇮🇳 Built for India

LexAI is designed around Indian legal language:

- IPC sections and bare acts
- RERA, Companies Act, Limitation Act references
- Indian jurisdiction and court terminology
- Model fine-tuned on 47,000+ Indian legal Q&A pairs

> Note: the bundled sample contracts are US-style agreements (Delaware / New York), used only as placeholder demo data.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| State Management | React Context API |
| Icons | Lucide React |
| AI Inference | Ollama |
| Model | Qwen3-14B, fine-tuned on Indian law (LoRA / Unsloth) |
| Training | Google Colab |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm or yarn
- Ollama (optional — needed for live AI chat)

### 1. Clone the repository
```bash
git clone https://github.com/yashraut2805/LEX-AI.git
cd LEX-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### 4. (Optional) Connect Ollama for live AI chat

**Option A — Ollama on your machine**
```bash
ollama run qwen2.5-coder:7b
```
Then in **LexAI → Settings → AI Inference Server**, keep the URL as `http://localhost:11434` and click **Verify and Save Config**.

**Option B — Fine-tuned model on Google Colab**
1. Run Ollama in Colab and load your fine-tuned Qwen3-14B.
2. Expose port `11434` with a tunnel (ngrok or Cloudflare).
3. In **Settings**, paste the public tunnel URL and type your fine-tuned model's name in the model field.
4. Click **Verify and Save Config**. The sidebar status should show "Inference Engine Online".

> The default model in Settings is `qwen2.5-coder:7b`. To use the fine-tuned model, you must enter its name manually.

---

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── AIAssistant.tsx
├── context/
│   └── AppContext.tsx      # app state, Ollama calls (/api/tags, /api/chat), sample data
├── pages/
│   ├── Dashboard.tsx
│   ├── DocumentAnalysis.tsx
│   ├── ClauseVerification.tsx
│   ├── RiskAnalysis.tsx
│   ├── MemoGenerator.tsx
│   ├── ObligationTracker.tsx
│   ├── DefinedTerms.tsx
│   ├── Comparison.tsx
│   ├── NegotiationAssistant.tsx
│   ├── TemplatesLibrary.tsx
│   ├── ESignIntegration.tsx
│   ├── LimitationTracker.tsx
│   ├── ClientPortal.tsx
│   ├── ApprovalWorkflows.tsx
│   ├── Upload.tsx
│   └── Settings.tsx
└── App.tsx
```

---

## 👥 Team

| Name | Role |
|------|------|
| Shaunak Paul | AI Engineering & Frontend |
| Yash Raut | Frontend Development |
| Parth Vibhute | Frontend Development |
| Mrudul Patil | UI/UX & Frontend |

---

## 📍 Roadmap

**Done**
- [x] Core contract analysis pages (10 pages, sample data)
- [x] Contracts+ advanced tools (4 pages)
- [x] LexCase client & approval management (2 pages)
- [x] Role-based auth system
- [x] Fine-tune Qwen3-14B on Indian law data
- [x] Ollama connection + live AI chat assistant
- [x] Settings: Ollama config, theme, font selection

**In progress / next**
- [ ] Run real document analysis through the model (replace mocked upload)
- [ ] Wire frontend to the backend REST API
- [ ] GGUF conversion for local Ollama deployment of the fine-tuned model
- [ ] LexResearch — RAG search across Indian statutes and SC judgments (ChromaDB)
- [ ] Court date tracker
- [ ] Mobile responsive layout

---

## 📄 License

This project is for academic and demonstration purposes as part of the B.E. AI & ML program at St. John College of Engineering and Management, Mumbai (Batch 2023–2027).

*"LexAI doesn't replace lawyers. It makes lawyers faster."*
