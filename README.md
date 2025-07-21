# AI-Agent-Hackathon

hackathon

=======

# AI Agent Hackathon – Brand Monitoring Dashboard

## Project Overview

This project is a full-stack application for advanced brand monitoring and competitive intelligence. It features:
- **Frontend**: React + TypeScript (with Vite, Tailwind CSS, and reusable UI components)
- **Backend**: FastAPI (Python) with an endpoint for uploading CSVs and generating executive-level brand analysis using the Perplexity API

## Features

- Upload a CSV of brands, competitors, and influencers
- Automated, in-depth brand analysis using LLMs
- Executive-style reports with actionable insights
- Modern, responsive UI

## Folder Structure

```
hacka/
│
├── backend/                # FastAPI backend
│   └── main.py
├── public/                 # Static assets
├── src/                    # React frontend source
│   ├── components/         # UI and dashboard components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── pages/              # App pages
├── package.json            # Frontend dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS config
├── vite.config.ts          # Vite config
├── tsconfig*.json          # TypeScript configs
└── README.md               # Project documentation
```

## Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (3.12+ recommended)
- **pip** (Python package manager)

## Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/W4RG0Dpk/AI-Agent-Hackathon.git
cd AI-Agent-Hackathon
```

### 2. Install Frontend Dependencies

```sh
npm install
```

### 3. Install Backend Dependencies

```sh
cd backend
pip install fastapi uvicorn requests python-multipart
cd ..
```

### 4. Set Perplexity API Key (Optional)

By default, a demo key is used. For production, set your own key as an environment variable:

```sh
# On Windows (PowerShell)
$env:PERPLEXITY_API_KEY="your-key-here"
# On Linux/macOS
export PERPLEXITY_API_KEY="your-key-here"
```

### 5. Run the Backend

From the project root:

```sh
& "C:/Program Files/Python312/python.exe" -m uvicorn backend.main:app --reload
```

Or, if `python` is in your PATH:

```sh
python -m uvicorn backend.main:app --reload
```

### 6. Run the Frontend

```sh
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend at http://127.0.0.1:8000.

---

## How to Push This Folder to GitHub

1. **Initialize Git (if not already):**
   ```sh
   git init
   ```

2. **Add all files:**
   ```sh
   git add .
   ```

3. **Commit your changes:**
   ```sh
   git commit -m "Initial commit"
   ```

4. **Add the remote and push:**
   ```sh
   git remote add origin https://github.com/W4RG0Dpk/AI-Agent-Hackathon.git
   git branch -M main
   git push -u origin main
   ```

