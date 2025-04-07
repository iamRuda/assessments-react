import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FileViewer = () => {
  const { filename } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const decodedFilename = decodeURIComponent(filename);

  useEffect(() => {
    const fileData = virtualFileStorage[decodedFilename];
    if (fileData) {
      setFileInfo(fileData);
    }
    return () => {
      // Очищаем ресурсы при размонтировании
      if (fileData) URL.revokeObjectURL(fileData.url);
    };
  }, [decodedFilename]);

  if (!fileInfo) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Файл не найден</h2>
      </div>
    );
  }

  const isImage = fileInfo.type.startsWith('image/');
  const isText = fileInfo.type.startsWith('text/');
  const isPDF = fileInfo.type === 'application/pdf';

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Просмотр файла: {decodedFilename}</h2>
      
      {isImage && (
        <div className="text-center">
          <img 
            src={fileInfo.url} 
            alt={decodedFilename} 
            className="img-fluid"
            style={{ maxHeight: "70vh", objectFit: "contain" }}
          />
        </div>
      )}
      
      {isText && (
        <div className="card">
          <div className="card-body">
            <iframe
              title="text-viewer"
              src={fileInfo.url}
              className="w-100"
              style={{ height: "70vh", border: "none" }}
            />
          </div>
        </div>
      )}
      
      {isPDF && (
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            title="pdf-viewer"
            src={fileInfo.url}
            className="embed-responsive-item"
          />
        </div>
      )}
      
      {!isImage && !isText && !isPDF && (
        <div className="text-center mt-4">
          <a 
            href={fileInfo.url} 
            download={decodedFilename}
            className="btn btn-primary btn-lg"
          >
            Скачать файл
          </a>
        </div>
      )}
    </div>
  );
};

export default FileViewer;