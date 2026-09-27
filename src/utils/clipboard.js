export const copyToClipboard = async (text, html = null) => {
  if (!text && !html) return Promise.reject("No content to copy");
  
  const strText = String(text || "");
  
  if (navigator.clipboard && window.ClipboardItem && html) {
    try {
      const htmlBlob = new Blob([html], { type: "text/html" });
      const textBlob = new Blob([strText], { type: "text/plain" });
      const item = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob
      });
      await navigator.clipboard.write([item]);
      return Promise.resolve();
    } catch (err) {
      console.warn("navigator.clipboard.write with HTML failed, falling back", err);
    }
  }

  // Fallback for HTML
  if (html) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        e.preventDefault();
        e.clipboardData.setData('text/html', html);
        e.clipboardData.setData('text/plain', strText);
      };
      document.addEventListener('copy', listener);
      try {
        const successful = document.execCommand('copy');
        document.removeEventListener('copy', listener);
        if (successful) {
          return resolve();
        } else {
          return reject("execCommand html copy failed");
        }
      } catch (err) {
        document.removeEventListener('copy', listener);
        reject(err);
      }
    });
  }

  // Fallback for plain text only
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(strText);
      return Promise.resolve();
    } catch (err) {
      console.warn("navigator.clipboard failed, falling back", err);
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = strText;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        resolve();
      } else {
        reject("execCommand copy failed");
      }
    } catch (err) {
      reject(err);
    }
  });
};
