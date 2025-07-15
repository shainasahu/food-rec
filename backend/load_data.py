import kagglehub
import pandas as pd
import os
import sqlite3

def download_dataset():
    print("Downloading dataset…")
    path = kagglehub.dataset_download("shuyangli94/food-com-recipes-and-user-interactions")
    print("Downloaded to:", path)
    return path

def load_raw_recipes(path):
    fp = os.path.join(path, "RAW_recipes.csv")
    print("Loading raw recipes from:", fp)
    df = pd.read_csv(fp)
    print(f"Recipes loaded: {len(df):,}")
    return df

def load_interactions(path):
    fp = os.path.join(path, "RAW_interactions.csv")
    print("Loading interactions from:", fp)
    df = pd.read_csv(fp)
    print(f"Interactions loaded: {len(df):,}")
    return df

def to_sqlite(df, db_path="recipes.db"):
    print(f"Saving recipes to SQLite → {db_path} ...")
    df["id"] = df["id"].astype(str)

    columns_to_keep = [
        "id", "name", "description", "minutes", "tags",
        "ingredients", "steps", "nutrition"
    ]
    df = df[columns_to_keep]

    conn = sqlite3.connect(db_path)
    df.to_sql("recipes", conn, if_exists="replace", index=False)
    conn.close()
    print("Recipes saved to SQLite database.")

if __name__ == "__main__":
    path = download_dataset()
    recipes_df = load_raw_recipes(path)
    #interactions_df = load_interactions(path)
    to_sqlite(recipes_df)
    
    # Example of printing the first few rows of the dataframes
    print(recipes_df.head())
    #print(interactions_df.head())

    print("✅ load_data.py done.")