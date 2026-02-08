import { useState } from "react";

function Transcript({ transcript, onWordClick, currentTime, mutedIndexes, onToggleMute }) {
    const [searchWord, setSearchWord] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!transcript) return null;

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Transcript</h2>
                <small style={{ color: "#666" }}>Tip: Alt + Click to Mute/Unmute</small>
            </div>
            
            <input 
                type="text" 
                placeholder="Search word..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value.toLowerCase())}
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            
            <p style={{ lineHeight: "1.8", maxWidth: "100%", whiteSpace: "normal" }}>
                {transcript.map((w, i) => {
                    const normalizedWord = w.word.toLowerCase().replace(/[\.,!?']/g, "");
                    const isSearchMatch = searchWord && normalizedWord.includes(searchWord);
                    
                    // Logic for highlights
                    const isCurrentWord = currentTime >= w.start && currentTime <= w.end;
                    const isHovered = hoveredIndex === i;

                    const isMuted = mutedIndexes.includes(i)

                    // Determine background color priority
                    let backgroundColor = "transparent";
                    if (isSearchMatch) backgroundColor = "yellow";
                    if (isHovered) backgroundColor = "lightblue";
                    if (isMuted) backgroundColor = "red"
                    if (isCurrentWord) backgroundColor = "orange";
                    
                    return (
                        <span
                            onClick={(e) => {
                                if (e.altKey) {
                                    e.preventDefault();
                                    onToggleMute(i);
                                } else {
                                    onWordClick(w.start);
                                }
                            }}
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                cursor: "pointer",
                                marginRight: "4px",
                                borderRadius: "2px",
                                backgroundColor: backgroundColor,
                                transition: "background-color 0.2s ease" 
                            }}                        
                        >
                            {w.word + " "}
                        </span>
                    );
                })}
            </p>
        </>
    );
}

export default Transcript;