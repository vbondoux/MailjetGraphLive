import React, { useEffect, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import Airtable from "airtable";

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const base = new Airtable({
      apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
    }).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

    let nodes = [{ id: "mailing", label: "Mailing", type: "root" }];
    let links = [];

    base(import.meta.env.VITE_AIRTABLE_TABLE)
      .select({ view: "Grid view" })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            const mailingId = record.get("MailingID");
            const email = record.get("Email");
            const type = record.get("Type");
            const url = record.get("URL");

            if (!nodes.find((n) => n.id === mailingId)) {
              nodes.push({ id: mailingId, label: mailingId, type: "mailing" });
              links.push({ source: "mailing", target: mailingId });
            }

            if (!nodes.find((n) => n.id === email)) {
              nodes.push({ id: email, label: email, type: "user" });
              links.push({ source: mailingId, target: email });
            }

            if (type === "click" && url) {
              if (!nodes.find((n) => n.id === url)) {
                nodes.push({ id: url, label: url, type: "url" });
              }
              links.push({ source: email, target: url });
            }
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          setGraphData({ nodes, links });
        }
      );
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <h1 style={{ color: "white", padding: "10px" }}>📊 Mailjet Graph Live</h1>
      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="type"
        nodeLabel="label"
        linkDirectionalParticles={2}
        linkDirectionalArrowLength={3}
      />
    </div>
  );
}
