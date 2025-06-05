from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # разрешаем доступ Telegram и любым клиентам
    allow_methods=["*"],
    allow_headers=["*"],
)

# путь к папке, где хранятся модели
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

@app.get("/model/{filename}")
async def get_model(filename: str):
    file_path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="model/gltf+json")
    return {"error": "File not found"}
