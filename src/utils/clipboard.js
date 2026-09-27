export const copyToClipboard = async (text) => {
  if (!text) return Promise.reject("No text to copy");
  const strText = String(text);
  
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(strText);
      return Promise.resolve();
    } catch (err) {
      console.warn("navigator.clipboard failed, falling back", err);
    }
  }

  // Fallback
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
