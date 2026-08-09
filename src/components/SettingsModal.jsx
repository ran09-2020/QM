import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Loader2 } from 'lucide-react';

export default function SettingsModal({ session, onClose }) {
  const metadata = session?.user?.user_metadata || {};
  const [userGender, setUserGender] = useState(metadata.user_gender || 'male');
  const [mentorGender, setMentorGender] = useState(metadata.mentor_gender || 'male');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { user_gender: userGender, mentor_gender: mentorGender }
    });
    setLoading(false);
    
    if (error) {
      setMsg('שגיאה בשמירה. נסה שוב.');
    } else {
      setMsg('ההגדרות נשמרו בהצלחה!');
      setTimeout(onClose, 1500);
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
            <option value="male">לשון זכר (מנהל)</option>
            <option value="female">לשון נקבה (מנהלת)</option>
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

        <button onClick={handleSave} disabled={loading} style={{width:'100%', padding:'1rem', borderRadius:'12px', background:'var(--accent-color)', color:'white', border:'none', fontWeight:'600', fontSize:'1.1rem', cursor:'pointer', display:'flex', justifyContent:'center'}}>
          {loading ? <Loader2 className="animate-spin" size={24}/> : 'שמור הגדרות'}
        </button>
      </div>
    </div>
  );
}
