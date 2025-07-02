import { useState } from "react";
import axios from "axios";


export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const response = await axios.post("http://localhost:3000/summarize", {
        text,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error:", error);
      setSummary("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
      <h2> Game Text Summarizer</h2>
      <form onSubmit={handleSummarize}>
        <textarea
          rows="10"
          cols="70"
          placeholder="Paste game review or lore here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <br />
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "1.5rem", background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h3>📝 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
