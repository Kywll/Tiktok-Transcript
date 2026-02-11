function FileUpload({ onFileSelect, onUpload, loading, disabled }) {
    return (
        <div className="text-center">
            <div className="mb-3">
                <input 
                    type="file" 
                    className="form-control mb-3"
                    accept="video/*"
                    onChange={(e) => onFileSelect(e.target.files[0])}
                    style={{ maxWidth: "400px", margin: "0 auto" }}
                />
            </div>
            
            <button
                onClick={onUpload} 
                disabled={loading || disabled}
                className="btn btn-primary px-4"
            >
                {loading ? "Transcribing..." : "Upload & Transcribe"}
            </button>
        </div>
    );
}

export default FileUpload;