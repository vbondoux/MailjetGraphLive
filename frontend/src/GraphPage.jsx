import React, { useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const ws = useRef(null);

  useEffect(() => {
    // Récupérer les données initiales
    fetch("https://mailjetgraphlive-production.up.railway.app/graph-data")
      .then((res) => res.json())
      .then((data) => setGraphData(data));

    // WebSocket
    ws.current = new WebSocket("wss://mailjetgraphlive-production.up.railway.app/ws/graph");
    ws.current.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setGraphData((prev) => {
        let newNodes = [...prev.nodes];
        let newLinks = [...prev.links];

        if (newEvent.type === "open") {
          if (!newNodes.find((n) => n.id === newEvent.email)) {
            newNodes.push({ id: newEvent.email, label: newEvent.email, type: "user" });
            newLinks.push({ source: "mailing", target: newEvent.email });
          }
        }

        if (newEvent.type === "click") {
          if (!newNodes.find((n) => n.id === newEvent.url)) {
            newNodes.push({ id: newEvent.url, label: newEvent.url, type: "url" });
            newLinks.push({ source: newEvent.email, target: newEvent.url });
          }
        }

        return { nodes: newNodes, links: newLinks };
      });
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      <h1 className="text-xl p-4">Mailjet Graph Live</h1>
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
