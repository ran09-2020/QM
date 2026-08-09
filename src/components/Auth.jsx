import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Compass, Sparkles } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userGender, setUserGender] = useState('male');
  const [mentorGender, setMentorGender] = useState('male');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_gender: userGender,
              mentor_gender: mentorGender
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'הרשמה הצליחה! (אם נדרש אישור מייל, אנא אשר אותו טרם ההתחברות).' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'אירעה שגיאה. נסה שוב.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{flexDirection: 'column'}}>
      <div className="auth-box">
        <div className="auth-icon" style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.5rem', color:'var(--accent-color)'}}>
          <Compass size={48} />
        </div>
        <h2 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)'}}>מצפן</h2>
        <p className="auth-subtitle" style={{fontSize: '1.1rem'}}>המנטור למצוינות אירגונית</p>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label>שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="הכנס שם מלא"
                  required
                />
              </div>
              <div className="input-group" style={{display:'flex', gap:'1rem'}}>
                <div style={{flex:1}}>
                  <label>איך לפנות אליך?</label>
                  <select value={userGender} onChange={(e) => setUserGender(e.target.value)} style={{width:'100%', padding:'0.75rem', borderRadius:'12px', border:'1px solid var(--panel-border)', fontFamily:'inherit'}}>
                    <option value="male">לשון זכר</option>
                    <option value="female">לשון נקבה</option>
                  </select>
                </div>
                <div style={{flex:1}}>
                  <label>דמות המנטור/ית</label>
                  <select value={mentorGender} onChange={(e) => setMentorGender(e.target.value)} style={{width:'100%', padding:'0.75rem', borderRadius:'12px', border:'1px solid var(--panel-border)', fontFamily:'inherit'}}>
                    <option value="male">מנטור (זכר)</option>
                    <option value="female">מנטורית (נקבה)</option>
                  </select>
                </div>
              </div>
            </>
          )}
          <div className="input-group">
            <label>דואר אלקטרוני</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              required
              dir="ltr"
            />
          </div>
          <div className="input-group">
            <label>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              dir="ltr"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'היכנס למערכת' : 'צור חשבון')}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isLogin ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}</span>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="switch-btn">
            {isLogin ? 'הירשם כאן' : 'התחבר כאן'}
          </button>
        </div>
      </div>
      
      <div style={{marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600'}}>
        <Sparkles size={16} color="#8b5cf6" />
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
}
