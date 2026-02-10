import { useState, useRef, useEffect } from "react";
import { transcribeVideo } from "./api/transcribe";

import FileUpload from "./components/FileUpload";
import AudioPlayer from "./components/AudioPlayer";
import Transcript from "./components/Transcript";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [wordIndexes, setWordIndexes] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [mutedIndexes, setMutedIndexes] = useState([]);

  const audioRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const data = await transcribeVideo(file);
      setTranscript(data.transcript);
      setWordIndexes(data.word_indexes);
      setAudioFile(
        `http://127.0.0.1:8000/uploads/${data.audio_file}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const jumpTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play();
    }
  };

  const toggleMute = (index) => {
    setMutedIndexes((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }

  useEffect(() => {
    if (!audioRef.current || !transcript) return;

    const isMuted = transcript.some((w, i) => {
      return currentTime >= (w.start -0.1) && currentTime <= (w.end -0.1) && mutedIndexes.includes(i);
    });

    audioRef.current.muted = isMuted;

  }, [currentTime, mutedIndexes, transcript]);

  const handleExportVideo = async () => {
    if (!transcript || !file) return;

    setLoading(true);

    const mutes = mutedIndexes.map(idx => ({
      start: transcript[idx].start,
      end: transcript[idx].end
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/export-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          filename: file.name,
          mutes: mutes
        }),
      });

      const data = await res.json();

      if (data.filename) {
        window.location.href = `${import.meta.env.VITE_API_URL}/download/${data.filename}`;
      } else {
        throw new Error("No filename received from server")
      }

    } catch (err) {
      setError("Export failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">

          <h1 className="text-center mb-4 fw-semibold">
            Video Transcriber & Editing
          </h1>
          <p className="text-center text-secondary mb-4">
            Upload a video, search words, mute moments, export a clean cut
          </p>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <FileUpload
                onFileSelect={setFile}
                onUpload={handleUpload}
                loading={loading}
                disabled={!file}
              />

              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}
            </div>
          </div>

          <AudioPlayer
            ref={audioRef}
            src={audioFile}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          />

          <Transcript
            transcript={transcript}
            onWordClick={jumpTo}
            currentTime={currentTime}
            mutedIndexes={mutedIndexes}
            onToggleMute={toggleMute}
          />

          {transcript && (
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-success px-4"
                onClick={handleExportVideo}
                disabled={loading}
              >
                {loading ? "Processing..." : "Export Edited Video"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );


}

export default App;
