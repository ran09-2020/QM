import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip, X, File as FileIcon } from 'lucide-react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

function ChatInput({
  isLoading,
  placeholderText,
  isSimulationMode,
  messages,
  handlePillClick,
  mentorGender,
  handleSendProps
}) {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleForceReset = () => {
      setInput('');
      setAttachedFile(null);
    };
    window.addEventListener('force_reset_chat', handleForceReset);
    return () => window.removeEventListener('force_reset_chat', handleForceReset);
  }, []);

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsExtractingFile(true);
    try {
      const fileType = file.type;
      const fileName = file.name;
      
      if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setAttachedFile({ name: fileName, type: 'text', data: result.value });
      }
      else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel' || fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let extractedText = '';
        workbook.SheetNames.forEach(sheetName => {
          extractedText += `\n--- גיליון: ${sheetName} ---\n`;
          const worksheet = workbook.Sheets[sheetName];
          extractedText += XLSX.utils.sheet_to_csv(worksheet);
        });
        setAttachedFile({ name: fileName, type: 'text', data: extractedText });
      }
      else if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          setAttachedFile({ name: fileName, type: 'inlineData', mimeType: fileType, data: base64String });
        };
        reader.readAsDataURL(file);
      } else {
        alert("סוג קובץ לא נתמך. אנא בחר קובץ Word, Excel, PDF או תמונה.");
      }
    } catch (error) {
      console.error(error);
      alert("שגיאה בקריאת הקובץ. ייתכן שהוא פגום או בפורמט לא נתמך.");
    } finally {
      setIsExtractingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSend = () => {
    if (isLoading || (!input.trim() && !attachedFile) || isExtractingFile) return;
    handleSendProps(input, null, attachedFile);
    setInput('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const showAllButtons = userMessageCount > 2 || (userMessageCount === 2 && !isLoading);

  return (
    <div className="chat-input-wrapper" style={isSimulationMode ? { paddingTop: '0.5rem' } : {}}>
      {!isSimulationMode && (
        <div className="action-pills">
          <button className="pill-btn" onClick={() => handlePillClick('אתגר ניהולי')}>אתגר ניהולי 🧩</button>
          {showAllButtons && (
            <>
              <button className="pill-btn" onClick={() => handlePillClick('הצעת כלי')}>הצעת כלי 🛠️</button>
              <button className="pill-btn" onClick={() => handlePillClick('אתגר אותי')}>אתגר אותי 🎯</button>
              <button className="pill-btn" onClick={() => handlePillClick('הצעד הבא')}>הצעד הבא 🚀</button>
              <button className="pill-btn" onClick={() => handlePillClick('תמצית שיחה')}>תמצית שיחה 📋</button>
            </>
          )}
          <button className="pill-btn" onClick={() => handlePillClick('תנסח/תבנה לי...')}>
            {mentorGender === 'female' ? 'תנסחי/תבני לי...' : 'תנסח/תבנה לי...'} 📝
          </button>
        </div>
      )}
      
      <div className="input-area-container">
        {attachedFile && (
          <div className="file-preview-area">
            <div className="attached-file-pill">
              <FileIcon size={14} />
              <span>{attachedFile.name}</span>
              <button className="remove-file-btn" onClick={removeAttachedFile} title="הסר קובץ">
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        <div className="input-row">
          <button 
            className="attach-btn" 
            onClick={handleFileClick} 
            disabled={isLoading || isExtractingFile}
            title="צרף קובץ (Word, Excel, PDF, תמונה)"
          >
            {isExtractingFile ? <Loader2 size={24} className="spin" /> : <Paperclip size={24} />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv,.docx,.pdf,image/*"
          />
          
          <textarea
            placeholder={placeholderText}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            onClick={onSend}
            disabled={isLoading || (!input.trim() && !attachedFile) || isExtractingFile}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatInput);
