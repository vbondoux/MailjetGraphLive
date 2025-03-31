import os
import airtable
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID")
AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_TABLE = os.getenv("AIRTABLE_TABLE")

client = airtable.Airtable(AIRTABLE_BASE_ID, AIRTABLE_TABLE, AIRTABLE_API_KEY)

def get_graph_data():
    records = client.get_all()
    nodes = [{"id": "mailing", "label": "Mailing", "type": "mail"}]
    links = []

    for r in records:
        fields = r.get("fields", {})
        email = fields.get("Email")
        event_type = fields.get("Type")
        url = fields.get("URL")

        if event_type == "open":
            nodes.append({"id": email, "label": email, "type": "user"})
            links.append({"source": "mailing", "target": email})
        elif event_type == "click" and url:
            nodes.append({"id": url, "label": url, "type": "url"})
            links.append({"source": email, "target": url})

    return {"nodes": nodes, "links": links}
