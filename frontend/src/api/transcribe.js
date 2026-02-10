export async function transcribeVideo(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transcribe`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    return res.json();
}