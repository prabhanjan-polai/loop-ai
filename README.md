# 🔁 FeedbackLoop AI — Enterprise Customer Feedback Intelligence Engine
 
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![GitHub repo](https://img.shields.io/badge/GitHub-prabhanjan--polai%2Floop--ai-181717?style=flat&logo=github)](https://github.com/prabhanjan-polai/loop-ai)
 
An end-to-end AI-powered feedback intelligence platform that aggregates, classifies, analyzes, and extracts actionable product insights from omni-channel customer feedback in real time.
 
---
 
## 🌟 Key Features
 
- 📥 **Omnichannel Ingestion:** Real-time stream simulator, CSV batch uploads, and manual ingest forms.
- 🧠 **AI Classification & Sentiment Engine:** Sentiment scoring, urgency detection, root cause categorization, and automated tag assignment.
- ⚡ **Executive & Product Themes:** Dynamic cluster analysis, pain point heatmaps, feature request tracking, and revenue risk assessment.
- 💬 **Ask-Loop (RAG AI Assistant):** Natural language Q&A across the entire customer feedback knowledge base using vector embeddings.
- 🤖 **Copilot:** Assistant view for exploring and acting on feedback inside the dashboard.
- 📊 **Automated Report Generation:** One-click executive reports with charts, trends, and product recommendations.
---


## 🏗️ CI/CD Pipeline Architecture

Our DevOps & CI/CD workflow is powered by **GitHub Actions** and includes continuous testing, quality gates, security auditing, and automated deployment:

```mermaid
graph TD
    A[Git Push / PR to main] --> B[GitHub Actions Runner]
    
    subgraph "Continuous Integration (CI)"
        B --> C[TypeScript Type Check: tsc --noEmit]
        B --> D[ESLint Analysis: next lint]
        B --> E[Security Vulnerability Audit: npm audit]
        C & D & E --> F[Next.js Production Build: npm run build]
        F --> G[Upload Build Artifacts]
    end

    subgraph "Security Analysis"
        B --> H[CodeQL Static Analysis]
    end

    subgraph "Continuous Deployment (CD)"
        F --> I{Branch == main?}
        I -->|Yes| J[Deploy to Production / Vercel]
        I -->|No / PR| K[Generate Preview Deployment]
    end
```
 
## 🗂️ Project Structure
 
```text
loop-ai/
├── app/
│   ├── api/                  # Route handlers
│   │   ├── ask-loop/         # RAG Q&A endpoint
│   │   ├── classify/         # Sentiment & classification endpoint
│   │   ├── feedback/         # Feedback CRUD endpoint
│   │   └── reports/          # Report generation endpoint
│   ├── dashboard/            # Dashboard pages
│   │   ├── ask-loop/
│   │   ├── copilot/
│   │   ├── executive/
│   │   ├── inbox/
│   │   ├── ingestion/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── themes/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Landing page
├── components/
│   ├── feedback/             # FeedbackCard, FeedbackDrawer
│   ├── ingestion/            # CSVIngester, ManualIngestModal, SimulatedSourceStream
│   ├── layout/               # Header, Sidebar
│   └── ui/                   # StatCard
├── lib/
│   ├── ai/                   # classifier, embeddings, rag, reportGenerator
│   ├── seed-data.ts          # Demo data
│   ├── store.ts              # Client state store
│   └── utils.ts
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```
 
---
 
## 🧰 Tech Stack
 
| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Layer | Classifier, embeddings, and RAG pipeline in `lib/ai/` |
| Linting | ESLint (`next lint`) |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
- Node.js 18.x or 20.x
- npm 9+ (or yarn / pnpm)
### Local Installation
 
1. **Clone the repository:**
```bash
   git clone https://github.com/prabhanjan-polai/loop-ai.git
   cd loop-ai
```
 
2. **Install dependencies:**
```bash
   npm install
```
 
3. **Run the development server:**
```bash
   npm run dev
```
   Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard.
 
---
 
## 🛠️ Available Scripts
 
| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the local Next.js development server |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Runs ESLint analysis for code quality |
 
---
## Screenshots

### Home Page
![Home](images/home.jpg)

### Dashboard
![Dashboard](images/dashbord.png)

### Settings
![Settings](images/settings.png)
### Command Center
![Command Center](images/comandcenter.jpeg)

### Feedback Inbox

![Feedback Inbox](images/feedback%20inbox.jpeg)

---
 
## 🗺️ Roadmap
 
- [ ] Connect real sources (Zendesk, Intercom, G2, Discord)
- [ ] Persistent database instead of in-memory store
- [ ] Authentication and role-based access
- [ ] CI/CD with GitHub Actions and deployment to Vercel
---
 
## 👤 Author
 
**Prabhanjan Polai**
- GitHub: [@prabhanjan-polai](https://github.com/prabhanjan-polai)
- Email: prabhanjanpolai85@gmail.com
---
 
## 📄 License
 
This project is open-source and available under the [MIT License](LICENSE).
 
