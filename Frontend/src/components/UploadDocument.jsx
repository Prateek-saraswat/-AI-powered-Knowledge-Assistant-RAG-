import { useState, useRef } from "react";
import { documentAPI } from "../services/api";

export default function UploadDocument({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await documentAPI.upload(formData);
      console.log("Upload successful:", response.data);

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError("");
    const validTypes = [".pdf", ".txt"];
    const fileExt = "." + selectedFile.name.split(".").pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      setError("Only PDF and TXT files are allowed");
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(selectedFile);
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null); setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="relative">
      {/* Error Alert - Compact */}
      {error && (
        <div className="mb-3 bg-rose-900/30 backdrop-blur-sm border border-rose-700/50 rounded-lg p-3 flex items-start justify-between animate-slideDown">
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="h-2.5 w-2.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-rose-200">{error}</p>
            </div>
          </div>
          <button onClick={() => setError("")} className="text-rose-500 hover:text-rose-400 transition-colors ml-2">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
            : file
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-slate-700 bg-slate-800/30 hover:border-blue-500/50 hover:bg-slate-800/50 hover:shadow-md"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center">
            {/* Icon - Smaller */}
            <div className="mb-3 relative group">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-200 relative z-10 ${
                isDragging 
                  ? "bg-gradient-to-br from-blue-500 to-cyan-600 scale-105 shadow-blue-500/30 text-white" 
                  : "bg-slate-800 border border-slate-700 text-blue-400 group-hover:scale-105"
              }`}>
                <svg className="h-4 w-4 transition-transform duration-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>

            <p className="text-sm font-semibold text-white mb-1">
              {isDragging ? "Drop file here" : "Drag & drop file"}
            </p>
            
            <p className="text-xs text-slate-400 mb-3">
              <span className="font-medium text-slate-300">PDF, TXT</span> (Max 10MB)
            </p>

            <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileInputChange} className="hidden" id="file-upload" />
            
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 active:scale-95 shadow-sm shadow-blue-500/20"
            >
              <svg className="h-5 w-5 mr-1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 13h6m-3-3v6" />
              </svg>
              Browse
            </label>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* File Preview - Compact */}
            <div className="flex items-center justify-center mb-3 relative">
              <div className="relative group">
                <div className="relative h-12 w-12 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center shadow-sm shadow-emerald-500/10 transition-transform duration-200 group-hover:scale-105">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm ring-2 ring-slate-900">
                  <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-white text-xs mb-1 truncate px-2">
              {file.name.length > 30 ? file.name.substring(0, 27) + "..." : file.name}
            </h4>
            <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-medium rounded-md mb-3">
              {formatFileSize(file.size)}
            </span>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleRemoveFile}
                disabled={loading}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm shadow-emerald-500/10 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}