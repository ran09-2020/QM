import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
      <Document 
        file={fileUrl} 
        onLoadSuccess={onDocumentLoadSuccess} 
        loading={<div style={{padding: '2rem'}}>טוען מסמך...</div>}
        error={<div style={{padding: '2rem', color: 'red'}}>שגיאה בטעינת המסמך.</div>}
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false} 
          renderAnnotationLayer={false} 
          width={Math.min(window.innerWidth * 0.8, 800)} 
          className="pdf-page-shadow"
        />
      </Document>
      
      {numPages > 1 && (
        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            disabled={pageNumber >= numPages} 
            onClick={() => setPageNumber(p => p + 1)}
            style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer' }}
          >
            הבא
          </button>
          <span style={{ fontSize: '14px', color: '#4b5563' }}>עמוד {pageNumber} מתוך {numPages}</span>
          <button 
            disabled={pageNumber <= 1} 
            onClick={() => setPageNumber(p => p - 1)}
            style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer' }}
          >
            הקודם
          </button>
        </div>
      )}
    </div>
  );
}
