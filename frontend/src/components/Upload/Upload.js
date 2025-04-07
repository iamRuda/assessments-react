import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Виртуальное файловое хранилище в памяти
let virtualFileStorage = {};

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  }, []);

  const handleUpload = useCallback(() => {
    if (!file) return;

    // Создаем Blob URL и сохраняем в виртуальное хранилище
    const fileURL = URL.createObjectURL(file);
    virtualFileStorage[file.name] = {
      url: fileURL,
      type: file.type,
      size: file.size
    };

    // Перенаправляем на страницу файла
    navigate(`/public/file/${encodeURIComponent(file.name)}`);
  }, [file, navigate]);

  return (
    <div className="container mt-5">
      <div 
        className={`border-dashed p-5 text-center ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          id="file-input"
          className="d-none"
          onChange={handleChange}
        />
        
        <div className="mb-3">
          <FontAwesomeIcon 
            icon={faCloudUploadAlt} 
            size="3x" 
            className={dragActive ? "text-primary" : "text-muted"}
          />
        </div>
        
        <div className={dragActive ? "text-primary" : "text-muted"}>
          <h4>Перетащите файл сюда</h4>
          <p className="mb-0">или нажмите для выбора файла</p>
        </div>

        {file && (
          <div className="mt-3">
            <p className="text-success mb-1">Выбран файл: {file.name}</p>
            <small className="text-muted">
              ({Math.round(file.size / 1024)} KB)
            </small>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 text-center">
          <button 
            className="btn btn-primary"
            onClick={handleUpload}
          >
            Загрузить файл
          </button>
        </div>
      )}

      <style>{`
        .border-dashed {
          border: 2px dashed #adb5bd;
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        
        .drag-active {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
        }
        
        .border-dashed:hover {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Upload;