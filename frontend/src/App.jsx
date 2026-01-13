import { useState, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setTranscript(null);

    const formData = new FormData();
    formData.append("file", file);

    try{
      const res = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload Failed");
      }

      const data = await res.json();
      setTranscript(data.transcript);
      setAudioFile(
        `http://127.0.0.1:8000/uploads/${data.audio_file}`
      );

    } catch(err) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const jumpTo = (time) => {
    if(audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };


  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif"}}>
      <h1>Video Transcriber</h1>

      <input 
        type="file" 
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Transcribing..." : "Upload & Transcribe"}
      </button>

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {audioFile && (
        <>
          <h2>Audio</h2>
          <audio ref={audioRef} controls src={audioFile} />
        </>
      )}

      {transcript && (
        <>
          <h2>Transcript (click a word)</h2>
          <p style={{ lineHeight: "1.8" }}>
            {transcript.map((w, i) => (
              <span
                key={i}
                onClick={() => jumpTo(w.start)}
                style= {{ cursor: "pointer", marginRight: "4px" }}
              >
                {w.word}
              </span>
            ))}
            </p>
        </>

      )}
    </div>
  );
}

export default App;




