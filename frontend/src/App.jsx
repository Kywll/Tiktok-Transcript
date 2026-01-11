import { useState } from "react";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [wordIndexes, setWordIndexes] = useState(null);
  const [wordFrequencies, setWordFrequencies] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http:127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    
    setAudioFile(data.audio_file);
    setTranscript(data.transcript);
    setWordIndexes(data.word_indexes);
    setWordFrequencies(data.word_frequencies);

    console.log(data)
  }


  return (
    <div>
      <Header />
      <Main>
        <Button text="Upload" />

      </Main>
    </div>
  );
}






