import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PdfViewer from './PdfViewer';
import rehypeRaw from 'rehype-raw';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Loader2, Lightbulb, PenTool, Map, BookOpen, Users, FlaskConical, LogOut, BookOpenCheck, Save, RefreshCw, Paperclip, X, File as FileIcon, Download, DoorOpen, MessageSquare } from 'lucide-react';
import { sendMessageToGemini, sendSimulationMessageToGemini, clearSimulationHistory, clearChatHistory } from '../services/gemini';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';

function ChatInterface({ session, isSimulationMode = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const cluster = location.state?.cluster;

  const metadata = session?.user?.user_metadata || {};
  const userGender = metadata.user_gender || 'male';
  const mentorGender = metadata.mentor_gender || 'male';
  const mentorHat = mentorGender === 'female' ? 'יועצת' : 'יועץ';
  const placeholderText = userGender === 'female' ? 'מקלידה הודעה...' : 'מקליד/ה הודעה...';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // File Attachment State
  const [attachedFile, setAttachedFile] = useState(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const lastModelMessageRef = useRef(null);
  const previousShowAllButtons = useRef(false);

  useEffect(() => {
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    const currentShowAllButtons = userMessageCount > 2 || (userMessageCount === 2 && !isLoading);
    
    if (!previousShowAllButtons.current && currentShowAllButtons && !isSimulationMode) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const playNote = (freq, startTime, duration) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, startTime);
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };
        const now = audioCtx.currentTime;
        playNote(523.25, now, 0.2); // C5
        playNote(659.25, now + 0.08, 0.2); // E5
        playNote(783.99, now + 0.16, 0.4); // G5
      } catch(e) {
        console.log("Audio play error", e);
      }
    }
    previousShowAllButtons.current = currentShowAllButtons;
  }, [messages, isLoading, isSimulationMode]);

  useEffect(() => {
    if (isSimulationMode) {
      if (!cluster) {
        navigate('/');
        return;
      }
      
      const savedCluster = sessionStorage.getItem('sim_cluster_title');
      const savedMessages = sessionStorage.getItem('sim_messages');
      
      if (savedCluster === cluster.title && savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        sessionStorage.setItem('sim_cluster_title', cluster.title);
        clearSimulationHistory();
        clearSimulationHistory();
        
        const chooseStr = userGender === 'female' ? 'תבחרי כלי לתרגול' : 'תבחר כלי לתרגול';
        
        const clusterInitialMessages = {
          'חזון, ייחודיות וערך': `**אשכול חזון, ייחודיות וערך:** הכלים העומדים לרשותך

- **שלושת האופקים**: זיהוי תבניות וחשיבה שיטתית על פני שלושה טווחי זמן. [לתירגול](#practice:שלושת_האופקים)
- **מטריצה לפריסת חזון**: חיבור בין המצוי כיום לרצוי בעתיד תוך שמירה על ערכי הליבה. [לתירגול](#practice:מטריצה_לפריסת_חזון)
- **חזון שקורא לפעולה**: פריטת חזון גדול ליעדים אופרטיביים ממוקדים. [לתירגול](#practice:חזון_שקורא_לפעולה)

${chooseStr}`,

          'הנהגה ותרבות מצמיחה': `**אשכול הנהגה ותרבות מצמיחה:** הכלים העומדים לרשותך

- **עקומת השינוי**: הבנת השלבים הרגשיים שאנשים עוברים בעת שינוי. [לתירגול](#practice:עקומת_השינוי)
- **אדרת הדג**: זיהוי הקשר בין סיבה לתוצאה בפתרון בעיות (סיבת שורש). [לתירגול](#practice:אדרת_הדג)
- **7 השאלות**: מיפוי מבוסס ראיונות לזיהוי כיווני התפתחות ואתגרים עתידיים. [לתירגול](#practice:7_השאלות)
- **תסריט שיחה: מקושי לצורך**: ניהול שיחות קשות והמרת שיח מאשים לשיח ממוקד צרכים ופתרונות. [לתירגול](#practice:תסריט_שיחה_מקושי_לצורך)

${chooseStr}`,

          'הון אנושי ושותפויות': `**אשכול הון אנושי ושותפויות:** הכלים העומדים לרשותך

- **ניהול שותפויות**: בניית הסכמות, איגום משאבים והשגת מטרות משותפות. [לתירגול](#practice:ניהול_שותפויות)
- **מיפוי בעלי עניין**: ניתוח הכוחות הפועלים בסביבת הארגון ורמת השפעתם. [לתירגול](#practice:מיפוי_בעלי_עניין)

${chooseStr}`,

          'ניהול תהליכים': `**אשכול ניהול תהליכים:** הכלים העומדים לרשותך

- **ניהול תהליכים**: הבניית רצף פעולות, מדידתן והבטחת איכות הביצוע. [לתירגול](#practice:ניהול_תהליכים)
- **ניהול סיכונים**: זיהוי, הערכה וטיפול מונע בסיכונים פוטנציאליים. [לתירגול](#practice:ניהול_סיכונים)
- **פלסטר למשבר**: טיפול מהיר וממוקד במשבר מיידי ללא זמן לתכנון ארוך. [לתירגול](#practice:פלסטר_למשבר)
- **מעגל למידה מארועים**: תחקור אירוע (טוב או רע) לשם הפקת לקחים ושיפור מתמיד. [לתירגול](#practice:מעגל_למידה_מארועים)

${chooseStr}`,

          'ניהול תוצאות והשפעה': `**אשכול ניהול תוצאות והשפעה:** הכלים העומדים לרשותך

- **מודל RADAR**: הערכת ביצועים בארגון מבוסס תוצאות, גישות, פריסה והערכה. [לתירגול](#practice:מודל_RADAR)
- **חשיבה תוצאתית**: מיקוד בהשפעה ובתפוקות במקום רק בפעולות. [לתירגול](#practice:חשיבה_תוצאתית)
- **מטריצת אייזנהאואר**: תעדוף משימות שוטפות על בסיס דחיפות וחשיבות. [לתירגול](#practice:מטריצת_אייזנהאואר)
- **MoSCoW**: תעדוף דרישות ופיצ'רים לפני יציאה לדרך בפרויקטים. [לתירגול](#practice:MoSCoW)

${chooseStr}`
        };

        const initialModelText = clusterInitialMessages[cluster.title] || `כדי להתחיל, נציג את הכלים העומדים לרשותך באשכול זה: \n\n${cluster.tools}\n\nאיזה כלי תרצה לתרגל כעת? ${chooseStr}`;
        const initialMessages = [
          {
            role: 'system-info',
            text: mentorGender === 'female' ? `מתחילים תרגול: ${cluster.title}. (מחכה למנטורית שתכין את התרחיש...)` : `מתחילים תרגול: ${cluster.title}. (מחכה למנטור שיכין את התרחיש...)`
          },
          {
            role: 'model',
            text: initialModelText,
            hat: 'מלמד'
          }
        ];
        setMessages(initialMessages);
      }
    } else {
      const savedMessages = sessionStorage.getItem('reg_messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            role: 'model',
            text: mentorGender === 'female' 
              ? "היי! כמנטורית האישית שלך, אני כאן כדי לעזור לך להפוך שאלות ודילמות ניהוליות לתוכנית עבודה מסודרת. המטרה היא לא רק 'לפעול', אלא לפתח תרבות ארגונית מצמיחה לפי עקרונות התכנית למצויינות ניהולית.\nעל מה נשוחח היום?"
              : "היי! כמנטור האישי שלך, אני כאן כדי לעזור לך להפוך שאלות ודילמות ניהוליות לתוכנית עבודה מסודרת. המטרה היא לא רק 'לפעול', אלא לפתח תרבות ארגונית מצמיחה לפי עקרונות התכנית למצויינות ניהולית.\nעל מה נשוחח היום?",
            hat: mentorHat
          }
        ]);
      }
    }
  }, [isSimulationMode, cluster, userGender, mentorHat, navigate]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isSimulationMode) {
        sessionStorage.setItem('sim_messages', JSON.stringify(messages));
      } else {
        sessionStorage.setItem('reg_messages', JSON.stringify(messages));
      }
    }
  }, [messages, isSimulationMode]);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else if (lastMessage.role === 'model' && messages.length > 1) {
      setTimeout(() => {
        lastModelMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleForceReset = () => {
      if (!isSimulationMode) {
        setMessages([
          {
            role: 'model',
            text: mentorGender === 'female' 
              ? "היי! כמנטורית האישית שלך, אני כאן כדי לעזור לך להפוך שאלות ודילמות ניהוליות לתוכנית עבודה מסודרת. המטרה היא לא רק 'לפעול', אלא לפתח תרבות ארגונית מצמיחה לפי עקרונות התכנית למצויינות ניהולית.\nעל מה נשוחח היום?"
              : "היי! כמנטור האישי שלך, אני כאן כדי לעזור לך להפוך שאלות ודילמות ניהוליות לתוכנית עבודה מסודרת. המטרה היא לא רק 'לפעול', אלא לפתח תרבות ארגונית מצמיחה לפי עקרונות התכנית למצויינות ניהולית.\nעל מה נשוחח היום?",
            hat: mentorHat
          }
        ]);
        setInput('');
      }
    };

    const handleLoadResumed = () => {
      if (!isSimulationMode) {
        const savedMessages = sessionStorage.getItem('reg_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      }
    };

    window.addEventListener('force_reset_chat', handleForceReset);
    window.addEventListener('load_resumed_chat', handleLoadResumed);
    return () => {
       window.removeEventListener('force_reset_chat', handleForceReset);
       window.removeEventListener('load_resumed_chat', handleLoadResumed);
    };
  }, [isSimulationMode, mentorHat]);

  const handlePillClick = async (pillLabel) => {
    const isNewChat = messages.filter(m => m.role === 'user').length < 2;
    let promptToSend = pillLabel;
    
    const replyMale = mentorGender === 'female' ? 'השיבי לי' : 'השב לי';
    const replyFemale = mentorGender === 'female' ? 'השיבי לי' : 'השב לי';
    const replyStr = userGender === 'female' ? replyFemale : replyMale;

    if (isNewChat) {
      switch(pillLabel) {
        case 'אתגר ניהולי':
          promptToSend = userGender === 'female'
            ? `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'מהו האתגר הניהולי שאת מתמודדת איתו כעת?'`
            : `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'מהו האתגר הניהולי שאתה מתמודד איתו כעת?'`;
          break;
        case 'אתגר אותי':
          promptToSend = `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'עדיין לא התחלנו לשוחח. אין לי על מה לאתגר אותך'`;
          break;
        case 'הצעת כלי':
          promptToSend = userGender === 'female'
            ? `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'לאיזו בעיה או צורך ניהולי תרצי שאציע כלי?'`
            : `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'לאיזו בעיה או צורך ניהולי תרצה שאציע כלי?'`;
          break;
        case 'הצעד הבא':
          promptToSend = `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'הצעד הבא של מה? לא שוחחנו על כלום עדיין'`;
          break;
        case 'תמצית שיחה':
          promptToSend = `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'עדיין לא התחלנו לשוחח. אין מה לתמצת'`;
          break;
        case 'תנסח/תבנה לי...':
          promptToSend = userGender === 'female'
            ? `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'בשמחה. מכיוון שעדיין לא שוחחנו ואין לי חומר רקע, אנא פרטי לי בקצרה איזה מסמך או תבנית תרצי שאבנה עבורך ובאיזה נושא.'`
            : `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'בשמחה. מכיוון שעדיין לא שוחחנו ואין לי חומר רקע, אנא פרט לי בקצרה איזה מסמך או תבנית תרצה שאבנה עבורך ובאיזה נושא.'`;
          break;
      }
    } else {
      switch(pillLabel) {
        case 'אתגר ניהולי':
          promptToSend = userGender === 'female'
            ? "בהקשר לנושא הנוכחי שאנחנו מדברים עליו, אני מעוניינת להעלות אתגר ניהולי ספציפי שעולה לי."
            : "בהקשר לנושא הנוכחי שאנחנו מדברים עליו, אני מעוניין להעלות אתגר ניהולי ספציפי שעולה לי.";
          break;
        case 'אתגר אותי':
          promptToSend = mentorGender === 'female'
            ? "בהקשר למה שדיברנו עד עכשיו, אנא אתגרי אותי בשאלה קשה או בתרחיש שיגרום לי לחשוב מחוץ לקופסה לגבי הנושא שלנו."
            : "בהקשר למה שדיברנו עד עכשיו, אנא אתגר אותי בשאלה קשה או בתרחיש שיגרום לי לחשוב מחוץ לקופסה לגבי הנושא שלנו.";
          break;
        case 'הצעת כלי':
          promptToSend = mentorGender === 'female'
            ? "בהקשר לדיון שלנו, איזה כלי ניהולי מתוך ארגז הכלים שלך היית מציעה לי ליישם כאן כדי להתקדם?"
            : "בהקשר לדיון שלנו, איזה כלי ניהולי מתוך ארגז הכלים שלך היית מציע לי ליישם כאן כדי להתקדם?";
          break;
        case 'הצעד הבא':
          promptToSend = userGender === 'female'
            ? "לאור המסקנות שלנו מהשיחה עכשיו, מהו לדעתך הצעד המעשי והאופרטיבי הבא שאני צריכה לעשות?"
            : "לאור המסקנות שלנו מהשיחה עכשיו, מהו לדעתך הצעד המעשי והאופרטיבי הבא שאני צריך לעשות?";
          break;
        case 'תמצית שיחה':
          promptToSend = mentorGender === 'female'
            ? "אנא סכמי את עיקרי השיחה שלנו עד כה, וצייני תובנות מרכזיות או משימות ברורות שעלו ממנה."
            : "אנא סכם את עיקרי השיחה שלנו עד כה, וציין תובנות מרכזיות או משימות ברורות שעלו ממנה.";
          break;
        case 'תנסח/תבנה לי...':
          promptToSend = mentorGender === 'female'
            ? (userGender === 'female' 
               ? `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'איזה מסמך או תבנית תרצי שאנסח או אבנה עבורך על בסיס השיחה שלנו?'`
               : `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'איזה מסמך או תבנית תרצה שאנסח או אבנה עבורך על בסיס השיחה שלנו?'`)
            : (userGender === 'female'
               ? `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'איזה מסמך או תבנית תרצי שאנסח או אבנה עבורך על בסיס השיחה שלנו?'`
               : `${replyStr} אך ורק במשפט הבא וללא שום מילה נוספת (ללא הקדמות): 'איזה מסמך או תבנית תרצה שאנסח או אבנה עבורך על בסיס השיחה שלנו?'`);
          break;
      }
    }

    handleSend(pillLabel, promptToSend);
  };

  const handleSend = async (overrideText = null, hiddenPrompt = null) => {
    if (isLoading) return;
    const textToSend = overrideText || input;
    if (!textToSend.trim() && !attachedFile) return;

    // Create a local reference to the file and clear state immediately so user can type
    const fileToSend = attachedFile;
    
    setInput('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const newMessages = [...messages, { role: 'user', text: textToSend, file: fileToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let responseText = '';
      const textForGemini = hiddenPrompt || textToSend;
      if (isSimulationMode) {
        responseText = await sendSimulationMessageToGemini(textForGemini, cluster.title, cluster.tools, userGender, mentorGender, fileToSend);
      } else {
        responseText = await sendMessageToGemini(textForGemini, userGender, mentorGender, fileToSend);
      }
      let activeHat = null;
      const hatMatch = responseText.match(/(?:\*\*|__)?\[כובע:\s*([^\]]+)\](?:\*\*|__)?\s*/);
      if (hatMatch) {
        activeHat = hatMatch[1].trim();
        responseText = responseText.replace(hatMatch[0], '');
      } else {
        if (isSimulationMode) activeHat = 'מאמן';
      }
      
      // Remove raw HTML <br> tags that the model might generate inside tables
      responseText = responseText.replace(/<br\s*\/?>/gi, ' ');
      
      // Log tool usage to user_stats dashboard
      if (!isSimulationMode) { // We only really care about tracking actual usage, not practice runs
        const knownTools = [
          "שלושת האופקים", "מטריצה לפריסת חזון", "חזון שקורא לפעולה", "עקומת השינוי", "אדרת הדג", "7 השאלות",
          "תסריט שיחה: מקושי לצורך", "ניהול שותפויות", "מיפוי בעלי עניין", "ניהול תהליכים", "ניהול סיכונים", 
          "פלסטר למשבר", "פלסטר זמני", "מעגל למידה מארועים", "מודל RADAR", "חשיבה תוצאתית", "מטריצת אייזנהאואר", "MoSCoW"
        ];
        
        // Mapping tools to EFQM clusters
        const toolToCluster = {
          "שלושת האופקים": "חזון אסטרטגיה וערכים",
          "מטריצה לפריסת חזון": "חזון אסטרטגיה וערכים",
          "חזון שקורא לפעולה": "חזון אסטרטגיה וערכים",
          "MoSCoW": "חזון אסטרטגיה וערכים",
          "עקומת השינוי": "הנהגה מתפתחת מעצימה ומפתחת",
          "תסריט שיחה: מקושי לצורך": "הנהגה מתפתחת מעצימה ומפתחת",
          "פלסטר למשבר": "הנהגה מתפתחת מעצימה ומפתחת",
          "פלסטר זמני": "הנהגה מתפתחת מעצימה ומפתחת",
          "מטריצת אייזנהאואר": "הנהגה מתפתחת מעצימה ומפתחת",
          "ניהול שותפויות": "פיתוח הון אנושי ושותפויות",
          "מיפוי בעלי עניין": "פיתוח הון אנושי ושותפויות",
          "מעגל למידה מארועים": "פיתוח הון אנושי ושותפויות",
          "אדרת הדג": "ניהול תהליכים נתונים ומידע",
          "7 השאלות": "ניהול תהליכים נתונים ומידע",
          "ניהול תהליכים": "ניהול תהליכים נתונים ומידע",
          "ניהול סיכונים": "ניהול תהליכים נתונים ומידע",
          "מודל RADAR": "תוצאות",
          "חשיבה תוצאתית": "תוצאות"
        };
        
        // Find which tools were mentioned in this response
        const detectedTools = knownTools.filter(tool => responseText.includes(tool));
        
        if (detectedTools.length > 0 && session?.user?.id) {
          // Avoid duplicate logging if the same tool was logged very recently
          const statsToInsert = detectedTools.map(tool => ({
            user_id: session.user.id,
            tool_name: tool,
            cluster_name: toolToCluster[tool] || 'ייעוץ כללי'
          }));
          
          supabase.from('user_stats').insert(statsToInsert).then(({error}) => {
             if (error) console.error("Error logging tool stats:", error);
          });
        }
      }

      setMessages([...newMessages, { role: 'model', text: responseText, hat: activeHat }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', text: `מצטער, התרחשה שגיאה: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      let summary;
      let historyStr;
      let clusterTitle;

      if (isSimulationMode) {
        summary = await sendSimulationMessageToGemini("סיום תרגול והכנת סיכום", cluster.title, cluster.tools, userGender, mentorGender);
        historyStr = sessionStorage.getItem('gemini_simulationHistory') || '[]';
        clusterTitle = cluster.title;
      } else {
        summary = await sendMessageToGemini("אנא סכם את השיחה האישית בינינו לטובת שמירה ביומן האירועים. סכם את התובנות המרכזיות בלבד בצורה מסודרת ומאורגנת (עם רשימות). חובה: השורה הראשונה בתשובתך חייבת להיות כותרת קצרה (2-4 מילים) שמתארת את נושא השיחה. לאחר מכן רד שורה וכתוב את הסיכום.", userGender, mentorGender);
        
        const lines = summary.split('\n');
        let titleIdx = 0;
        if (lines.length > 0 && lines[0].includes('[כובע')) {
            titleIdx = 1;
        }
        
        if (lines.length > titleIdx) {
            const titleLine = lines[titleIdx].replace(/[*#]/g, '').trim();
            clusterTitle = `שיחה אישית: ${titleLine}`;
            summary = lines.slice(titleIdx + 1).join('\n').trim();
        } else {
            clusterTitle = 'שיחה אישית';
            summary = lines.join('\n').trim();
        }
        
        historyStr = sessionStorage.getItem('gemini_chatHistory') || '[]';
      }
      
      const parsedHistory = JSON.parse(historyStr);
      if (Array.isArray(parsedHistory) && parsedHistory.length >= 2) {
        parsedHistory.splice(-2, 2);
      }

      const { error: insertError } = await supabase.from('simulation_summaries').insert([{ 
         user_id: session.user.id, 
         cluster: clusterTitle, 
         summary: summary,
         history: parsedHistory
      }]);
      
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }

      window.dispatchEvent(new CustomEvent('simulation_saved'));

      if (isSimulationMode) {
        sessionStorage.removeItem('sim_cluster_title');
        sessionStorage.removeItem('sim_messages');
      } else {
        sessionStorage.removeItem('reg_messages');
      }
      
      alert('הסיכום נשמר בהצלחה בלוח האירועים! מכין פרוטוקול...');
    } catch (error) {
      console.error(error);
      alert("שגיאה בשמירת הסיכום.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    if (isSimulationMode) {
      sessionStorage.removeItem('sim_cluster_title');
      sessionStorage.removeItem('sim_messages');
      clearSimulationHistory();
    } else {
      sessionStorage.removeItem('reg_messages');
      clearChatHistory();
      window.dispatchEvent(new Event('force_reset_chat'));
    }
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleWipeHistory = () => {
    const wantsToWipe = window.confirm("אזהרה: פעולה זו תמחק את כל ההיסטוריה הנוכחית. האם להמשיך? (מומלץ לשמור פרוטוקול לפני מחיקה)");
    if (wantsToWipe) {
      sessionStorage.removeItem('sim_cluster_title');
      sessionStorage.removeItem('sim_messages');
      clearSimulationHistory();
      
      const initialMessages = [
        {
          role: 'system-info',
          text: `מתחילים תרגול: ${cluster.title}. (מחכה למנטור שיכין את התרחיש...)`
        },
        {
          role: 'model',
          text: `כל הכבוד! סיימנו תרגול מוצלח של כלי. איזה כלי תרצה לתרגל עכשיו? (אם תרצה לחזור למצב רגיל - לחץ למטה).`,
          hat: 'מאמן'
        }
      ];
      setMessages(initialMessages);
      sessionStorage.setItem('sim_cluster_title', cluster.title);
      sessionStorage.setItem('sim_messages', JSON.stringify(initialMessages));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(null);
    }
  };

  const startPractice = (toolName) => {
    const toolFriendlyName = toolName.replace(/_/g, ' ');
    const newMessages = [...messages, {
      role: 'model',
      text: `איך תרצה שנתרגל את הכלי "${toolFriendlyName}"?`,
      hat: 'מלמד',
      buttons: [
        { label: 'תראה לי שלב אחרי שלב', action: `practice_step:${toolFriendlyName}` },
        { label: 'תאמן אותי על תרחיש שאהיה פעיל בו', action: `practice_active:${toolFriendlyName}` }
      ]
    }];
    setMessages(newMessages);
    if (isSimulationMode) {
      sessionStorage.setItem('sim_messages', JSON.stringify(newMessages));
    }
  };

  const handlePracticeButtonClick = (action) => {
    if (action.startsWith('practice_step:')) {
      const toolName = action.replace('practice_step:', '');
      handleSend('תראה לי שלב אחרי שלב (' + toolName + ')');
    } else if (action.startsWith('practice_active:')) {
      const toolName = action.replace('practice_active:', '');
      handleSend('תאמן אותי על תרחיש שאהיה פעיל בו (' + toolName + ')');
    }
  };

  return (
    <div className="chat-container" style={{ position: 'relative' }}>
      {(isSimulationMode ? cluster : true) && (
        <div style={{
          backgroundColor: isSimulationMode ? '#f3e8ff' : '#dbeafe',
          color: isSimulationMode ? '#6b21a8' : '#1e40af',
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${isSimulationMode ? '#e9d5ff' : '#bfdbfe'}`,
          borderRadius: '12px 12px 0 0',
          margin: '0',
          fontWeight: '500',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {isSimulationMode ? <FlaskConical size={20} /> : <MessageSquare size={20} />}
            {isSimulationMode ? 'מצב תירגול פעיל' : 'שיחה אישית'}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              onClick={handleSummarize}
              disabled={isLoading}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', padding: 0 }}
            >
              <Download size={22} style={{ marginBottom: '2px' }} />
              סיכום ושמירה
            </button>
            <button 
              onClick={handleExit}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', color: isSimulationMode ? '#9333ea' : '#1e40af', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', padding: 0 }}
            >
              <DoorOpen size={22} style={{ marginBottom: '2px' }} />
              יציאה
            </button>
          </div>
        </div>
      )}

      <div className="chat-messages" style={isSimulationMode ? { paddingTop: '1rem' } : {}}>
        {messages.map((msg, idx) => {
          const isLastModelMsg = msg.role === 'model' && idx === messages.length - 1;
          const isLast = idx === messages.length - 1;
          
          if (msg.role === 'system-info') {
            return (
              <div key={idx} className="message-wrapper user" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div className="message-bubble system-bubble" style={{
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div 
              key={idx} 
              className={`message-wrapper ${msg.role}`}
              ref={isLastModelMsg ? lastModelMessageRef : null}
            >
              <div className={`message-bubble ${msg.hat === 'מאמן' || msg.hat === 'מאמנת' ? 'bubble-hat-coach' : msg.hat === 'יועץ' || msg.hat === 'יועצת' ? 'bubble-hat-advisor' : msg.hat === 'מלמד' || msg.hat === 'מלמדת' || msg.hat === 'מורה' ? 'bubble-hat-teacher' : ''}`}>
                <div className="message-content">
                {msg.hat && (
                  <div className={`hat-badge ${msg.hat === 'מאמן' || msg.hat === 'מאמנת' ? 'badge-hat-coach' : msg.hat === 'יועץ' || msg.hat === 'יועצת' ? 'badge-hat-advisor' : msg.hat === 'מלמד' || msg.hat === 'מלמדת' || msg.hat === 'מורה' ? 'badge-hat-teacher' : ''}`}>
                    {msg.hat === 'מאמן' || msg.hat === 'מאמנת' ? `🎯 ${msg.hat}` : msg.hat === 'יועץ' || msg.hat === 'יועצת' ? `💡 ${msg.hat}` : msg.hat === 'מלמד' || msg.hat === 'מלמדת' || msg.hat === 'מורה' ? `📚 ${msg.hat}` : msg.hat}
                  </div>
                )}
                
                {msg.file && (
                    <div className="attached-file-pill user-message-file" style={{marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#4b5563'}}>
                      <FileIcon size={14} />
                      <span>{msg.file.name}</span>
                    </div>
                )}
                
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      a: ({node, ...props}) => {
                        if (props.href && props.href.startsWith('#practice:')) {
                          const toolName = decodeURIComponent(props.href.replace('#practice:', ''));
                          return (
                            <a href="#" onClick={(e) => {
                              e.preventDefault();
                              startPractice(toolName);
                            }} className="practice-link">
                              {props.children}
                            </a>
                          );
                        }
                        if (props.href && props.href.startsWith('#action:')) {
                          const action = props.href.replace('#action:', '');
                          return (
                            <button onClick={(e) => {
                              e.preventDefault();
                              if (action === 'end_practice') {
                                setMessages(prev => [...prev, { role: 'system-info', text: 'התירגול הסתיים בהצלחה. לשמירת הסיכום בלוח האירועים לחץ על "סיכום ושמירה" למעלה. למחיקה והתחלה מחדש, לחץ על "יציאה".' }]);
                              } else if (action === 'active_practice') {
                                handleSend('תאמן אותי על תרחיש שאהיה פעיל בו');
                              } else if (action === 'more_example') {
                                handleSend('שלב אחרי שלב (הצג לי דוגמה נוספת בדיוק לפי התבנית)');
                              }
                            }} className="pill-btn" style={{ margin: '5px', display: 'inline-flex', borderColor: '#8b5cf6', color: '#7e22ce' }}>
                              {props.children}
                            </button>
                          );
                        }
                        if (props.href && props.href.startsWith('#pdf:')) {
                          const pdfFile = props.href.replace('#pdf:', '');
                          const pdfUrl = `${import.meta.env.BASE_URL}process_maps/${pdfFile}`;
                          return (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                              <div style={{ backgroundColor: '#f3f4f6', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{fontSize: '18px'}}>📄</span> {props.children}
                                </div>
                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', backgroundColor: '#8b5cf6', color: 'white', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
                                  פתח במסך מלא
                                </a>
                              </div>
                              <div style={{ WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}>
                                {isLast ? (
                                  <PdfViewer fileUrl={pdfUrl} />
                                ) : (
                                  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                                    <span style={{color: '#6b7280', fontSize: '14px'}}>התצוגה נסגרה כדי לשמור על ביצועים.</span><br/>
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{color: '#8b5cf6', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '8px'}}>
                                      לחץ כאן לפתיחת הקובץ 
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return <a {...props} />;
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                {msg.buttons && (
                  <div className="message-buttons">
                    {msg.buttons.map((btn, bidx) => (
                      <button 
                        key={bidx} 
                        className="pill-btn practice-btn" 
                        onClick={() => handlePracticeButtonClick(btn.action)}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        })}
        {isLoading && (
          <div className="message-wrapper model">
            <div className="message-bubble" style={{padding: '1rem', minHeight: '44px', display: 'flex', alignItems: 'center'}}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper" style={isSimulationMode ? { paddingTop: '0.5rem' } : {}}>
        
        
        
        {!isSimulationMode && (
          <div className="action-pills">
            <button className="pill-btn" onClick={() => handlePillClick('אתגר ניהולי')}>אתגר ניהולי 🧩</button>
            {(messages.filter(m => m.role === 'user').length > 2 || (messages.filter(m => m.role === 'user').length === 2 && !isLoading)) && (
              <>
                <button className="pill-btn" onClick={() => handlePillClick('הצעת כלי')}>הצעת כלי 🛠️</button>
                <button className="pill-btn" onClick={() => handlePillClick('אתגר אותי')}>אתגר אותי 🎯</button>
                <button className="pill-btn" onClick={() => handlePillClick('הצעד הבא')}>הצעד הבא 🚀</button>
                <button className="pill-btn" onClick={() => handlePillClick('תמצית שיחה')}>תמצית שיחה 📋</button>
              </>
            )}
            <button className="pill-btn" onClick={() => handlePillClick('תנסח/תבנה לי...')}>{mentorGender === 'female' ? 'תנסחי/תבני לי...' : 'תנסח/תבנה לי...'} 📝</button>
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
              onClick={() => handleSend(null)}
              disabled={isLoading || (!input.trim() && !attachedFile) || isExtractingFile}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
