import { useState } from "react";
import api from "../services/api";

function DocumentUpload({ studentId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatusMessage({ type: "", text: "" }); // Clear past validation notices
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    setStatusMessage({ type: "", text: "" });
  };

  const handleUploadDocument = async () => {
    if (!file) {
      setStatusMessage({ type: "error", text: "Please choose or drop a baseline document file to proceed." });
      return;
    }

    if (!studentId) {
      setStatusMessage({ type: "error", text: "Missing active student tracking identifier key mapping." });
      return;
    }

    // Initialize multipart/form-data transaction body boundary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("student_id", studentId);

    try {
      setIsSubmitting(true);
      setStatusMessage({ type: "", text: "" });

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setStatusMessage({ type: "success", text: `"${file.name}" successfully integrated into document management servers.` });
      setFile(null); // Purge file hook reference on success boundary

      // Optional state refresh execution trigger
      if (onUploadSuccess) onUploadSuccess();

    } catch (err) {
      console.error("Document vault intake network layer error:", err);
      const serverFeedback = err.response?.data?.message || "File ledger storage rejection. Verify security permissions or payload constraints.";
      setStatusMessage({ type: "error", text: serverFeedback });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modernized Document Panel Styles
  const dropzoneStyle = {
    border: "2px dashed #cbd5e1",
    background: file ? "#f8fafc" : "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        padding: "24px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.01), 0 1px 2px -1px rgba(0,0,0,0.01)",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
        Immigration Case Document Vault
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#64748b" }}>
        Upload identity records, financial logs, transcripts, or institutional verification assets.
      </p>

      {/* FEEDBACK TRACKING STATUS NOTIFICATION BAR */}
      {statusMessage.text && (
        <div style={{
          padding: "12px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
          marginBottom: "16px",
          border: `1px solid ${statusMessage.type === "error" ? "#fee2e2" : "#dcfce7"}`,
          background: statusMessage.type === "error" ? "#fef2f2" : "#f0fdf4",
          color: statusMessage.type === "error" ? "#991b1b" : "#166534",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>{statusMessage.type === "error" ? "⚠️" : "📋"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* CUSTOM FILE INTENTION DROP SURFACE CONTAINER */}
      <div 
        style={dropzoneStyle}
        onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.borderColor = "#2563eb"; }}
        onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.borderColor = "#cbd5e1"; }}
      >
        {/* Invisible absolute interactive file capture layer overlay */}
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isSubmitting}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        />
        
        <span style={{ fontSize: "28px" }}>{file ? "📄" : "📤"}</span>
        
        {file ? (
          <div style={{ zIndex: 2, pointerEvents: "auto" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#0f172a", wordBreak: "break-all" }}>
              {file.name}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for system pipeline transfer
            </p>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearSelectedFile(); }}
              style={{
                marginTop: "10px",
                background: "transparent",
                border: "none",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Remove Selected File
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Click to browse or drop file assets here
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
              PDF, PNG, JPG formats supported up to 10MB limit
            </p>
          </div>
        )}
      </div>

      {/* DISPATCH EXECUTION ROW */}
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleUploadDocument}
          disabled={!file || isSubmitting}
          style={{
            padding: "10px 20px",
            background: !file || isSubmitting ? "#e2e8f0" : "#2563eb",
            color: !file || isSubmitting ? "#94a3b8" : "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: !file || isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: !file || isSubmitting ? "none" : "0 4px 10px rgba(37, 99, 235, 0.15)",
            transition: "background 0.2s ease"
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                animation: "spin 0.8s linear infinite"
              }} />
              Streaming Data to Server...
            </>
          ) : (
            "Initiate Upload Profile"
          )}
        </button>
      </div>

    </div>
  );
}

export default DocumentUpload;