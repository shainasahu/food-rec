# Recipe Explorer 🍲

**Search, explore, and chat with Food.com recipes using vector search + LLMs.**

An AI-powered recipe search and Q&A app that combines **vector databases, local LLMs, and Kaggle’s Food.com dataset** to let you explore, search, and chat with recipes like never before.
---

### About ✨

**Recipe Explorer** is a full-stack application that demonstrates how **retrieval-augmented generation (RAG)** can be applied to structured recipe data.

It connects **keyword-based search** with a **vector embedding pipeline**, enabling semantic recipe discovery. Each recipe is enriched with metadata (ingredients, steps, nutrition, tags), stored in **SQLite**, and indexed with **ChromaDB** for fast retrieval.

Additionally, a chatbot interface powered by **LangChain + Ollama** allows users to ask natural language questions about a recipe — e.g. *“Can I make this gluten-free?”* or *“What substitutions work for garlic?”*—and get contextual answers grounded in the recipe’s details.

---

### Tech Stack 🛠️

- **Frontend**: Next.js • React • Tailwind CSS  
- **Backend**: Python • FastAPI • LangChain • Ollama
- **Data**: ChromaDB, SQLite, [Food.com Recipes & Interactions (Kaggle)](https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions)

---

### Features 📖

- **Vector-powered search** – Search by keywords or semantic meaning across thousands of recipes.  
- **Fast retrieval** – Recipes stored in **ChromaDB** with embeddings for quick, relevant results.  
- **Rich recipe details** – Each recipe includes description, tags, nutrition, ingredients, and step-by-step instructions.  
- **Interactive chatbot** – Ask recipe-specific questions and get contextual, LLM-generated answers.  
- **Efficient storage** – Recipes and metadata stored in SQLite for lightweight but powerful querying.

---

## API Endpoints 🔌
- **`POST /search`** → Search recipes in vector DB by keyword/semantic similarity.  
- **`GET /recipes/{id}`** → Retrieve full recipe details by ID.  
- **`POST /ask/{id}`** → Ask LLM a question about a specific recipe.  

---

### How It Works ⚙️

Dataset ingestion
1. Recipes are downloaded via KaggleHub.
2. load_data.py loads raw CSV → SQLite database.
3. vector.py embeds recipe names & descriptions using Ollama embeddings and stores them in ChromaDB.

Backend 
1. /search queries ChromaDB retriever → returns top-k matching recipes.
2. /recipes/{id} pulls structured recipe details (ingredients, steps, tags, nutrition) from SQLite.
3. /ask/{id} builds a RAG prompt → passes recipe context + user question → answered by Ollama LLM (llama3.2).

Frontend
1. Users search recipes → results displayed instantly.
2. Clicking a recipe loads details.
3. Embedded chatbot connects to /ask/{id}, enabling context-aware Q&A per recipe.

Essentially, this app functions as a local AI agent:
1. Retriever (ChromaDB) = finds relevant recipe context.
2. Reasoner (LLM) = interprets and answers user queries.
3. Together, they form a RAG loop for recipe exploration.

---

### Future Work ⭐ 

- Add **advanced filtering** (tags, nutrition, dietary preferences).  
- Expand beyond the current **subset of recipes** (demo uses ~1,000 for speed).  
- Improve **UI/UX** for browsing and search.  
- Experiment with **larger/better embeddings & models** for more accurate search and answers.
