# 🚀 Portfolio Projects: Complete Guide & Explanations

This guide explains **LuminateAI**, **RepoMind**, and **MAC-SPOT** from start to finish. It details how data flows through the files, defines core concepts in simple English, lists key functions, and explains real-world use cases and deployment strategies.

---

## 💡 Project 1: LuminateAI (Enterprise RAG & Data Analytics)

LuminateAI is a smart research assistant that reads through thousands of pages of academic papers and databases to answer user queries with high accuracy.

### 🔄 Step-by-Step File & Data Flow

```
[Next.js UI] (frontend/src/components/Chat.tsx)
    │  (Sends user question via WebSockets)
    ▼
[FastAPI Router] (api/routes/router.py)
    │  (Checks if query needs SQL or text search)
    ├──► [SQL Path]: [SQL Agent] (api/agents/sql_agent.py) ──► [Database] (Postgres)
    ▼
[RAG Path]: [Search Module] (api/rag/search.py)
    │  (Performs vector + keyword search)
    ▼
[Cohere Reranker] (api/rag/reranker.py)
    │  (Re-orders documents by relevance)
    ▼
[CRAG Grader] (api/rag/grader.py)
    │  (Checks if documents answer the question)
    ├──► [If Irrelevant]: [arXiv Client] (api/clients/arxiv.py) (Fetches live papers)
    ▼
[LLM Synthesis] (api/agents/generator.py)
    │  (Generates final markdown response)
    ▼
[Next.js UI] (frontend/src/components/Chat.tsx) (Streams text word-by-word)
```

---

### 📚 Core Concepts & Definitions

#### 1. Hybrid Search (Dense + Sparse)
*   **Definition**: Combining two search methods. **Dense search** understands the *meaning* (semantic search), while **Sparse search** (BM25) looks for *exact word matches* (keyword search).
*   **Functions/Libraries**: `LlamaIndex` / `ChromaDB` / `Qdrant` queries in `api/rag/search.py`.
*   **Real-World Example**: Searching a library catalog for "canine care". Dense search retrieves books on "dog health", while Sparse search makes sure books with the exact phrase "canine care" are at the top.

#### 2. RAPTOR (Tree-Organized Retrieval)
*   **Definition**: A method of chunking long documents, clustering them by topic using an LLM, summarizing those clusters, and organizing them into a tree structure. This allows searching for both broad themes (at the top of the tree) and specific details (at the leaves).
*   **Functions/Libraries**: Recursive clustering using Gaussian Mixture Models (GMM) and LLM summarization trees in `api/rag/raptor.py`.
*   **Real-World Example**: Reading a 500-page book. Instead of searching page-by-page, you look at the chapter summaries first (top-level nodes) to find the right section, and then read the specific page (leaf node).

#### 3. Corrective RAG (CRAG)
*   **Definition**: A safety step that evaluates the quality of search results before giving them to the LLM. If the search results are poor or out-of-date, it pulls in fresh data from external sources (like the arXiv API).
*   **Functions/Libraries**: Prompt-engineered LLM grading loops in `api/rag/grader.py` and `arXiv` API client in `api/clients/arxiv.py`.
*   **Real-World Example**: A customer service agent is asked about a new product feature. Instead of guessing based on old manuals, the agent checks the search results. If the manual is outdated, they query the live company database for the latest update.

#### 4. Text-to-SQL Agent
*   **Definition**: An AI agent that reads a user's question, understands a database structure, writes a correct SQL query, runs it, and retrieves the results safely.
*   **Functions/Libraries**: Schema translation prompts in `api/agents/sql_agent.py` and `sqlglot` for syntax checking.
*   **Real-World Example**: A manager asks, *"How much revenue did we make in New York last week?"* The AI translates this to `SELECT SUM(amount) FROM sales WHERE city = 'New York'...` and returns the exact number.

---

### 🚀 Deployment Strategy
*   **Backend**: FastAPI packaged in a Docker container and deployed to **Google Cloud Run** or **AWS ECS** for auto-scaling.
*   **Frontend**: Next.js deployed on **Vercel** for fast global loading.
*   **Databases**: PostgreSQL (hosted on AWS RDS) and Qdrant/Chroma Cloud (for vector embeddings).

---
---

## 💡 Project 2: RepoMind (AI-Powered Codebase Explorer & Chat)

RepoMind is a multi-agent system that indexes codebases, visualizes file relationships, and runs an autonomous code-and-debug loop in a sandbox to generate verified Git patches.

### 🔄 Step-by-Step File & Data Flow

```
[GitHub Repo] ──► [AST Parser] (indexer/ast_parser.py) ──► [Qdrant Store] (indexer/qdrant_store.py)
                                                                 │
                                                    (Indexes codebase elements)
                                                                 ▼
[React UI] (frontend/src/App.jsx) ◄────────────────────► [Qdrant Database]
    │  (User asks to fix a bug)
    ▼
[FastAPI Server] (api/main.py)
    │  (Triggers LangGraph multi-agent pipeline)
    ▼
[LangGraph Workflow] (api/agents/graph.py)
    │  (Manages state and orchestrates agents)
    ├──► [Summarizer] (api/agents/summarizer.py) (Locates relevant files)
    ├──► [Architect] (api/agents/architect.py) (Generates Git patch)
    ├──► [Critic] (api/agents/critic.py) (Audits patch for syntax errors)
    ▼
[Docker Sandbox] (api/sandbox/docker_runner.py)
    │  (Runs pytest in isolated container)
    ├──► [If Tests Fail]: Sends traceback logs back to [Architect] to fix
    ▼
[Git Patch Generated] ──► [React UI] (frontend/src/App.jsx) (Displays clean patch to user)
```

---

### 📚 Core Concepts & Definitions

#### 1. AST (Abstract Syntax Tree) Parsing
*   **Definition**: Breaking code files down into their grammatical structure (like identifying where functions, classes, and import statements start and end) instead of treating them as plain text.
*   **Functions/Libraries**: Python's native `ast` library in `indexer/ast_parser.py`.
*   **Real-World Example**: A book index. Instead of listing every paragraph containing the word "cooking", an AST-like index points you directly to the "Recipes" section and "Chef" definitions.

#### 2. LangGraph State Graph (Multi-Agent System)
*   **Definition**: A framework that lets multiple specialized AI agents collaborate in a loop (graph). One agent writes code, another checks it, and another runs it, passing messages back and forth.
*   **Functions/Libraries**: `langgraph.graph.StateGraph` in `api/agents/graph.py`.
*   **Real-World Example**: An assembly line. A designer plans the car (Architect), a quality inspector checks the blueprints (Critic), and a mechanic builds it (Sandbox). If the mechanic finds a part doesn't fit, they send it back to the designer to revise.

#### 3. Docker Sandboxed Testing
*   **Definition**: Running generated code inside an isolated, temporary container that has no internet access and strict limits on memory and CPU to ensure it cannot harm the main host computer.
*   **Functions/Libraries**: Docker SDK for Python in `api/sandbox/docker_runner.py` running `pytest` commands.
*   **Real-World Example**: Running a suspicious attachment in a "sandbox" virtual computer to see if it contains viruses before opening it on your personal laptop.

---

### 🚀 Deployment Strategy
*   **FastAPI Backend & Sandbox**: Deployed on a virtual machine (like **AWS EC2** or **GCP Compute Engine**) with Docker installed on the host so the API can dynamically launch sandboxed testing containers.
*   **Frontend**: React client deployed on **Netlify** or **AWS S3/CloudFront**.

---
---

## 💡 Project 3: MAC-SPOT (Real-Time Network Discovery Agent)

MAC-SPOT is a command-line utility and web interface that scans local networks using low-level network packets, uses local AI to identify what devices are connected, and checks them for vulnerabilities.

### 🔄 Step-by-Step File & Data Flow

```
[CLI entry] (cli/main.py)  OR  [React UI] (frontend/src/App.js)
    │  (Triggers network scan)
    ▼
[FastAPI Server] (api/main.py)
    │
    ▼
[Scapy Discovery Engine] (api/scanner/discovery.py)
    │  (Sends parallel ARP broadcasts over local subnet)
    ▼
[Vendor Resolver] (api/scanner/oui_lookup.py)
    │  (Checks MAC prefixes against local OUI manufacturer database)
    ▼
[Async Port Scanner] (api/scanner/port_scanner.py)
    │  (Scans ports 80, 22, etc., and grabs welcome headers)
    ▼
[Ollama Local LLM] (api/analyzer/fingerprinter.py)
    │  (Runs local model to classify OS & Device Type)
    ▼
[CVE Database API] (api/analyzer/cve_lookup.py)
    │  (Queries security vulnerabilities for found services)
    ▼
[SQLite DB Cache] (api/database/cache.py) ◄──► [FastAPI WebSockets]
                                                        │
                                                        ▼
[CLI / React UI] (frontend/src/App.js) (Streams active hosts in real-time)
```

---

### 📚 Core Concepts & Definitions

#### 1. ARP (Address Resolution Protocol) Scanning
*   **Definition**: Sending broadcast packets on a local network asking devices to report their hardware identity (MAC address) mapped to their network address (IP). It is fast and bypasses firewalls that block standard ping requests.
*   **Functions/Libraries**: `scapy.all.srp()` and `scapy.all.ARP()` in `api/scanner/discovery.py`.
*   **Real-World Example**: Standing up in a room and shouting, *"Who owns the jacket labeled #50?"* The owner stands up and tells you their name, allowing you to list everyone in the room.

#### 2. Local LLM Fingerprinting (Ollama)
*   **Definition**: Running a smaller, optimized AI model directly on your local computer to analyze open ports and device details, keeping internal network data completely private.
*   **Functions/Libraries**: Ollama API calls in `api/analyzer/fingerprinter.py`.
*   **Real-World Example**: A bank security team classifying servers. Rather than uploading their network details to a public AI on the internet, they run the AI model on a secure, offline computer inside their server room.

#### 3. SQLite MAC-based Caching
*   **Definition**: Saving device details using their MAC address (which never changes) rather than their IP address (which changes every time they reconnect to Wi-Fi) to speed up future network scans.
*   **Functions/Libraries**: `sqlite3` queries and `UPSERT` statements in `api/database/cache.py`.
*   **Real-World Example**: A hotel guest registry. The hotel identifies you by your Passport Number (MAC address) rather than your Room Number (IP address), because you might get a different room on your next visit.

---

### 🚀 Deployment Strategy
*   **CLI Mode**: Packaged as a standalone executable using **PyInstaller** so users can install and run it natively on macOS with a simple binary.
*   **Web Dashboard**: Run locally as a light Docker Compose setup:
    *   FastAPI backend container running with host network access (`--network host`) to capture ARP packets.
    *   Ollama container running locally on the user's computer.

---
---

## 💡 Project 4: Lead-Bot (Autonomous Sales & Engagement Agent)

Lead-Bot is an interactive AI sales assistant embedded in portfolios and websites to qualify leads, answer FAQs, and notify the developer.

### 🔄 Step-by-Step File & Data Flow

```
[Portfolio Visitor] ──► [Chat widget UI] (index.html) ──► [Conversational Logic] (main.js)
                                                                 │
                                                       (Processes input text/clicks)
                                                                 ▼
[EmailJS Notification] ◄─────────────────────────────── [Intent Router]
    │                                                            │
(Sends lead details to inbox)                          (Evaluates query category)
    ▼                                                            ▼
[Success Beacon on UI] ◄───────────────────────────────── [Response Synthesis] (RAG / FAQ lookup)
```

---

### 📚 Core Concepts & Definitions

#### 1. Contextual Intent Classification
*   **Definition**: Figuring out what a user wants (e.g. recruit, collaborate, read resume) based on keywords and button options.
*   **Functions/Libraries**: Local intent-routing dictionary and pattern matching maps in `main.js`.
*   **Real-World Example**: A customer walks into an electronics store. The staff router determines if they are there to buy a laptop (Sales), get a phone fixed (Support), or drop off a package (Logistics) to direct them to the right counter.

#### 2. Dialog State Management
*   **Definition**: Tracking the phase of the conversation (e.g. greeting, capturing email, capturing message, submitting) dynamically in Javascript.
*   **Functions/Libraries**: State variables and transition handlers in `main.js`.
*   **Real-World Example**: A phone system menu that asks you for your account number first, then your billing pin, and then details your account balance step-by-step.

#### 3. Client-Side Lead Notification Sync
*   **Definition**: Firing a secure API post request directly to EmailJS from the browser once the lead details are fully validated, without requiring a custom API server.
*   **Functions/Libraries**: EmailJS SDK or direct API POST requests in `main.js`.
*   **Real-World Example**: A static website contact form that emails details directly to the owner via a third-party gateway.

