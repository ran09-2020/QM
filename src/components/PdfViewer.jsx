import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', maxHeight: '600px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <Document 
        file={fileUrl} 
        onLoadSuccess={onDocumentLoadSuccess} 
        loading={<div style={{padding: '2rem'}}>טוען מסמך...</div>}
        error={<div style={{padding: '2rem', color: 'red'}}>שגיאה בטעינת המסמך.</div>}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} style={{ marginBottom: index < numPages - 1 ? '15px' : '0' }}>
            <Page 
              pageNumber={index + 1} 
              renderTextLayer={false} 
              renderAnnotationLayer={false} 
              width={Math.min(window.innerWidth * 0.8, 800)} 
              className="pdf-page-shadow"
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
