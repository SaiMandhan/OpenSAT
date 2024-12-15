import json
import pickle
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm
import numpy

# # Load json dataset
# with open("sat_dataset.json", "r", encoding='utf-8') as file:
#     dataset = json.load(file)

# # Reshape data
# questions = [{"id": item["id"], "text": item["question"]["question"]} for item in dataset["math"]]
# questions += [{"id": item["id"], "text": item["question"]["question"]} for item in dataset["english"]]

# # Load pre-trained tokenizer
# tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
# model = BertModel.from_pretrained("bert-base-uncased")

# # Compute embedding given text
# def get_embedding(text):
#     inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
#     with torch.no_grad():
#         outputs = model(**inputs)
#         # Using CLS
#         embedding = outputs.last_hidden_state[:, 0, :].numpy()
#     return embedding

# # Generate embeddings for all questions in the dataset
# question_embeddings = {}
# for question in tqdm(questions, desc="Tokenizing questions"):
#     question_embeddings[question["id"]] = get_embedding(question["text"])

# # Save embeddings to a file
# with open("question_embeddings.pkl", "wb") as f:
#     pickle.dump(question_embeddings, f)

# Load embeddings from a file
with open("question_embeddings.pkl", "rb") as f:
    question_embeddings = pickle.load(f)

# Recommendation system using cosine similarity
def recommend_questions(question_id, top_n=3):
    if question_id not in question_embeddings:
        return f"Question ID {question_id} not found."
    
    query_embedding = question_embeddings[question_id]
    similarities = {}
    
    for q_id, embedding in question_embeddings.items():
        if q_id != question_id:
            similarity = cosine_similarity(query_embedding, embedding)[0][0]
            similarities[q_id] = similarity
    
    # Sort by similarity
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    
    # Get top N similar questions
    recommendations = [{"id": q_id, "similarity": sim} for q_id, sim in sorted_similarities[:top_n]]
    return recommendations

# Example usage
query_id = "281a4f3b"
recommendations = recommend_questions(query_id)
print(f"Recommendations for Question ID {query_id}:")
for rec in recommendations:
    print(rec)
