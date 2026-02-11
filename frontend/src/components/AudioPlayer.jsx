import { forwardRef } from "react";

const AudioPlayer = forwardRef(({ src, onTimeUpdate }, ref) => {
    if (!src) return null;

    return (
        <div className="text-center my-5">
            <h3 className="fw-semibold mb-3">Audio</h3>
            <audio 
                ref={ref} 
                controls src={src} 
                onTimeUpdate={onTimeUpdate}
                className="w-100"
                style={{ maxWidth: "700px" }}
            />
        </div>
    );
});

export default AudioPlayer;