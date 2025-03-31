# 📄 backend/main.py (FastAPI pour graph live)

from fastapi import FastAPI, WebSocket
from graph_data import get_graph_data
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

clients = set()

@app.get("/graph-data")
async def graph_data():
    return get_graph_data()

@app.websocket("/ws/graph")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep-alive ping
    except:
        clients.remove(websocket)

# ➤ Diffuser un événement si tu veux intégrer un trigger
async def broadcast_event(event):
    for ws in clients.copy():
        try:
            await ws.send_json(event)
        except:
            clients.remove(ws)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
