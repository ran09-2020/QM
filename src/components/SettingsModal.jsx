import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Loader2, AlertTriangle } from 'lucide-react';

export default function SettingsModal({ session, onClose }) {
  const metadata = session?.user?.user_metadata || {};
  const [userGender, setUserGender] = useState(metadata.user_gender || 'male');
  const [mentorGender, setMentorGender] = useState(metadata.mentor_gender || 'male');
  const [userRole, setUserRole] = useState(metadata.user_role || 'principal');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { user_gender: userGender, mentor_gender: mentorGender, user_role: userRole }
    });
    
    // Force refresh the session locally to ensure it's written to localStorage
    await supabase.auth.refreshSession();
    
    setLoading(false);
    
    if (error) {
      setMsg('שגיאה בשמירה. נסה שוב.');
    } else {
      // Clear session storage so that the initial greeting messages get regenerated with the new gender
      sessionStorage.removeItem('reg_messages');
      sessionStorage.removeItem('sim_messages');
      sessionStorage.removeItem('gemini_chatHistory');
      sessionStorage.removeItem('gemini_simulationHistory');
      sessionStorage.removeItem('sim_cluster_title');

      setMsg('ההגדרות נשמרו בהצלחה! מרענן...');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', padding:'2.5rem', borderRadius:'24px', width:'400px', maxWidth:'90%', position:'relative', direction:'rtl'}}>
        <button onClick={onClose} style={{position:'absolute', top:'1.5rem', left:'1.5rem', background:'none', border:'none', cursor:'pointer'}}><X size={24} color="#64748b"/></button>
        
        <h2 style={{marginBottom:'1.5rem', color:'#1e293b'}}>הגדרות התאמה אישית</h2>
        
        <div style={{marginBottom:'1.5rem', textAlign:'right'}}>
          <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600', color:'#475569'}}>צורת הפנייה אליך (מין המשתמש/ת)</label>
          <select value={userGender} onChange={e => setUserGender(e.target.value)} style={{width:'100%', padding:'0.75rem', borderRadius:'12px', border:'1px solid #cbd5e1', fontFamily:'inherit', fontSize:'1rem'}}>
            <option value="male">לשון זכר</option>
            <option value="female">לשון נקבה</option>
          </select>
        </div>

        <div style={{marginBottom:'1.5rem', textAlign:'right'}}>
          <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600', color:'#475569'}}>תפקיד במערכת</label>
          <select value={userRole} onChange={e => setUserRole(e.target.value)} style={{width:'100%', padding:'0.75rem', borderRadius:'12px', border:'1px solid #cbd5e1', fontFamily:'inherit', fontSize:'1rem', background: '#f8fafc'}}>
            <option value="principal">מנהל/ת בית ספר</option>
            <option value="mentor">מדריך/ה (מלווה מנהלים)</option>
          </select>
        </div>

        <div style={{marginBottom:'2.5rem', textAlign:'right'}}>
          <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600', color:'#475569'}}>דמות ה-AI (מין המנטור/ית)</label>
          <select value={mentorGender} onChange={e => setMentorGender(e.target.value)} style={{width:'100%', padding:'0.75rem', borderRadius:'12px', border:'1px solid #cbd5e1', fontFamily:'inherit', fontSize:'1rem'}}>
            <option value="male">מנטור (יועץ זכר)</option>
            <option value="female">מנטורית (יועצת נקבה)</option>
          </select>
        </div>

        {msg && <p style={{color: msg.includes('שגיאה') ? '#ef4444' : '#166534', marginBottom:'1.5rem', fontSize:'0.9rem', textAlign:'center', fontWeight:'600'}}>{msg}</p>}

        {!showDangerZone ? (
          <button 
            onClick={() => setShowDangerZone(true)}
            style={{width:'100%', padding:'0.5rem', borderRadius:'8px', background:'transparent', color:'#ef4444', border:'1px solid #fca5a5', fontWeight:'500', fontSize:'0.85rem', cursor:'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <AlertTriangle size={14} /> אפשרויות איפוס (אזור סכנה)
          </button>
        ) : (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <button onClick={() => setShowDangerZone(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}><X size={16} /></button>
              <h3 style={{ fontSize: '1rem', color: '#b91c1c', margin: 0 }}>אזור סכנה</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#991b1b', marginBottom: '1rem', textAlign: 'right' }}>
              מחיקת כל נתוני ההיסטוריה והסטטיסטיקות מלוח הבקרה שלך (איפוס ה"מצפן"). פעולה זו לא תמחק את המשימות הפתוחות שלך.
            </p>
            <button 
              onClick={async () => {
                if (window.confirm('האם אתה בטוח שברצונך לאפס את כל הסטטיסטיקות שלך? פעולה זו בלתי הפיכה.')) {
                  setLoading(true);
                  
                  // Set a reset timestamp in metadata to filter out old stats on the frontend
                  const resetTime = new Date().toISOString();
                  const { error: metaError } = await supabase.auth.updateUser({
                    data: { dashboard_reset_time: resetTime }
                  });
                  await supabase.auth.refreshSession();
                  
                  // Attempt to delete from db as well (might silently fail due to RLS, but metadata will save us)
                  await supabase.from('user_stats').delete().eq('user_id', session.user.id);
                  
                  setLoading(false);
                  if (metaError) {
                    setMsg('שגיאה באיפוס: ' + metaError.message);
                  } else {
                    setMsg('הסטטיסטיקות אופסו בהצלחה!');
                    setTimeout(() => window.location.reload(), 1500);
                  }
                }
              }}
              disabled={loading}
              style={{width:'100%', padding:'0.75rem', borderRadius:'8px', background:'white', color:'#b91c1c', border:'1px solid #b91c1c', fontWeight:'600', fontSize:'0.95rem', cursor:'pointer'}}
            >
              איפוס נתוני לוח הבקרה
            </button>
          </div>
        )}

        <button onClick={handleSave} disabled={loading} style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'var(--accent-color)', color:'white', border:'none', fontWeight:'600', fontSize:'1.1rem', cursor:'pointer', display:'flex', justifyContent:'center'}}>
          {loading ? <Loader2 className="animate-spin" size={24}/> : 'שמור הגדרות'}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', direction: 'ltr' }}>
          Model: gemini-flash-latest
        </div>
      </div>
    </div>
  );
}
