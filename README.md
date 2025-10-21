# AI-Email-Sync-Assignment


A full-stack application built using React.js and Node.js, designed to synchronize multiple IMAP accounts in real time, apply AI-based email categorization, integrate with Slack and webhooks, and provide AI-powered suggested replies using RAG (Retrieval-Augmented Generation).

Features
1. Real-Time Email Synchronization
Supports multiple IMAP accounts (minimum 2).

Uses persistent IMAP connections with IDLE mode (no cron jobs).

Fetches emails from the last 30 days on startup.

Implements real-time updates using imapflow and WebSocket notifications in Node.js.

2. Searchable Email Storage (Elasticsearch)
Stores and indexes all emails in Elasticsearch (via Docker).

Enables search filtering by folder and account.

Supports full-text search across subject, sender, and body content.

Bulk inserts email data using the Elasticsearch _bulk API for efficiency.

3. AI-Based Email Categorization
Emails are automatically classified into the following labels:

Interested

Meeting Booked

Not Interested

Spam

Out of Office

Uses a pretrained Hugging Face Transformer model (e.g., bert-base-uncased) fine-tuned on labeled email datasets.

4. Slack & Webhook Integration
Sends a Slack message for each newly categorized Interested email via Slack’s Incoming Webhook API.

Triggers a webhook call (to https://webhook.site) whenever an Interested email is detected.

5. Frontend (React UI)
Built using React.js + Material UI.

Displays all emails categorized by AI with folder/account dropdown filters.

Provides email search powered by Elasticsearch queries.

Real-time UI updates via WebSocket or Socket.IO.

6. AI-Powered Suggested Replies (RAG)
Uses vector database (e.g., Pinecone or FAISS) to store product and outreach agenda context.

Combines retrieval (semantic vectors) with LLM (e.g., OpenAI GPT-4 or Ollama local model) for better contextual replies.

Suggests context-aware responses like:

"Thank you for shortlisting my profile! I'm available for a technical interview. You can book a slot here: https://cal.com/example"

Architecture
text
frontend/      → React.js (email viewer, filters, search, AI categorization)
backend/       → Node.js (Express, IMAP, AI, indexing, Slack/webhooks)
elasticsearch/ → Dockerized Elasticsearch instance
vector-db/     → Local FAISS or cloud-based Pinecone
Setup Guide
Prerequisites
Node.js ≥ 18.x

Docker & Docker Compose

Slack workspace with webhook URL

Elasticsearch & Kibana via Docker

1. Clone Repository
bash
git clone https://github.com/username/ai-email-sync.git
cd ai-email-sync
2. Start Elasticsearch (Docker)
bash
docker-compose up -d
Docker Compose file (docker-compose.yml):

text
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
3. Install Backend
bash
cd backend
npm install
Create .env file:

text
IMAP_ACCOUNTS=[{"user":"user1@example.com","pass":"appPassword1"},{"user":"user2@example.com","pass":"appPassword2"}]
ELASTIC_URL=http://localhost:9200
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXXX/YYYY/ZZZZ
WEBHOOK_URL=https://webhook.site/your-url
OPENAI_API_KEY=your_api_key_here
Run server:

bash
npm run dev
The backend will:

Connect to IMAP accounts via imapflow

Stream real-time incoming emails

Store metadata and content into Elasticsearch

Trigger Slack/webhook notifications on AI classification events

4. Install Frontend
bash
cd ../frontend
npm install
npm start
Runs the interface at http://localhost:3000.

5. AI Categorization & Suggested Replies
Email content is passed through a fine-tuned classification model (emailClassifier.js).

For suggested replies, the retriever fetches similar context entries from the vector DB, and the generator combines them with the incoming message to form RAG-based responses using langchain or llamaindex.

Example code snippet:

js
const context = await vectorDB.query(email.text);
const reply = await llm.generate(`Based on this context: ${context}`, email.text);
