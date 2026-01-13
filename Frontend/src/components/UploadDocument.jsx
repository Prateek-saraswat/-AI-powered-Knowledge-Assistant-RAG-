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
      console.log("✅ Upload successful:", response.data);

      // Reset and refresh
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError(err.response?.data?.error || "Upload failed");
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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      {error && (
        <div className="mb-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 flex items-start justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-0.5">Please select a valid file</p>
            </div>
          </div>
          <button 
            onClick={() => setError("")}
            className="h-7 w-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 shadow-inner scale-[1.02]"
            : file
            ? "border-green-400 bg-green-50/50"
            : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:shadow-md"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                isDragging 
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 scale-110" 
                  : "bg-gradient-to-br from-blue-500 to-blue-600"
              }`}>
                <svg className="h-7 w-7 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-1.5">
              {isDragging ? "🎉 Drop your file here" : "📁 Drag & drop your file"}
            </p>
            <p className="text-xs text-gray-600 mb-4">or click to browse from your computer</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="group inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 13h6m-3-3v6" />
              </svg>
              Browse Files
            </label>

            <div className="mt-4 flex items-center justify-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF, TXT</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
                </svg>
                <span>Max 10MB</span>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="relative group">
                <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <svg className="h-7 w-7 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 h-7 w-7 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate px-4">
              {file.name}
            </h4>
            <p className="text-xs text-gray-600 mb-5">{formatFileSize(file.size)}</p>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleRemoveFile}
                disabled={loading}
                className="group px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-50 shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="flex items-center space-x-1.5">
                  <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Remove</span>
                </span>
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="group px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-8" />
                    </svg>
                    <span>Upload Document</span>
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}