from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
import pandas as pd
import os

raw_recipes_path = os.path.expanduser("~/.cache/kagglehub/datasets/shuyangli94/food-com-recipes-and-user-interactions/versions/2/RAW_recipes.csv")
df = pd.read_csv(raw_recipes_path)
df = df.head(1000)

print(f"Recipes loaded: {len(df):,}")

embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db_location = "./chroma_recipe_db"
add_documents = not os.path.exists(db_location)

if add_documents:
    documents= []
    ids = []

    for _, row in df.iterrows():
        content = str(row["name"])
        desc = row.get("description")
        if pd.notna(desc) and isinstance(desc, str):
            content += f" - {desc}"

        
        doc = Document(
            page_content=content,
            metadata={
                "id": str(row["id"]),
                "minutes": row.get("minutes"),
                "ingredients": row.get("ingredients"),
                "tags": row.get("tags"),
            }
        )
        documents.append(doc)
        ids.append(str(row["id"]))

vector_store = Chroma(
    collection_name="recipes",
    persist_directory=db_location,
    embedding_function=embeddings,
)

if add_documents:
    vector_store.add_documents(documents=documents, ids=ids)
    print(f"Added {len(documents)} documents to the vector store.")
else:
    print("Chroma vector store already exists. Skipping document addition.")

retriever = vector_store.as_retriever(
    search_kwargs={"k": 10}
)