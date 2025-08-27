from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3

from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

class SearchQuery(BaseModel):
    query: str

class AskQuestion(BaseModel):
    question: str

conn = sqlite3.connect("recipes.db", check_same_thread=False)

model = OllamaLLM(model="llama3.2")
template = '''
You are a helpful assistant that answers questions about a given recipe.

Here is the relevant recipe: {recipes}

Here is the question to answer: {question}
'''
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

@app.post("/search")
async def search_recipes(payload: SearchQuery):
    query = payload.query

    if not query:
        return JSONResponse(status_code=400, content={"error": "No query provided"})

    docs = retriever.invoke(query)
    results = []
    for doc in docs:
        content = doc.page_content
        metadata = doc.metadata
        recipe_id = metadata.get("id")
        title = content.split(" - ")[0]
        description = content.split(" - ")[1] if " - " in content else ""
        
        results.append({
            "id": recipe_id,
            "title": title.strip(),
            "description": description.strip(),
        })

    return JSONResponse(content={"results": results})

@app.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE id=?", (recipe_id,))
    row = cursor.fetchone()
    
    if not row:
        return JSONResponse(status_code=404, content={"error": "Recipe not found"})

    columns = [column[0] for column in cursor.description]
    recipe = dict(zip(columns, row))
    
    return JSONResponse(content=recipe)

@app.post("/ask/{recipe_id}")
async def ask_llm(recipe_id: str, payload: AskQuestion):
    question = payload.question
    if not question:
        return JSONResponse(status_code=400, content={"error": "No question provided"})

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE id=?", (recipe_id,))
    row = cursor.fetchone()
    if not row:
        return JSONResponse(status_code=404, content={"error": "Recipe not found"})
    columns = [column[0] for column in cursor.description]
    recipe = dict(zip(columns, row))

    # Build the prompt string for the LLM
    recipe_text = "\n".join(f"{key}: {value}" for key, value in recipe.items() if value)    
    response = chain.invoke({"recipes": recipe_text, "question": question})
    
    return JSONResponse(content={"answer": response})