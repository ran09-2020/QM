import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SchoolContext = createContext();

export function SchoolProvider({ children, session }) {
  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = session?.user?.user_metadata?.user_role || 'principal';

  useEffect(() => {
    if (role === 'mentor' && session?.user) {
      loadSchools();
    } else {
      setSchools([]);
      setActiveSchool(null);
      setLoading(false);
    }
  }, [role, session]);

  
  const NEUTRAL_SCHOOL = {
    id: 'neutral',
    name: 'מרחב אישי (ללא שיוך)',
    theme_color: '#94a3b8',
    is_neutral: true
  };
  const loadSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('mentor_id', session.user.id)
      .order('created_at', { ascending: true });
      
    if (!error && data) {
      // TEMP FIX FOR COLORS:
      const schoolsWithoutColor = data.filter(s => !s.theme_color || s.theme_color === '#4F46E5');
      if (schoolsWithoutColor.length > 0) {
        for (let i = 0; i < schoolsWithoutColor.length; i++) {
          const newColor = PRESET_COLORS[i % PRESET_COLORS.length];
          await supabase.from('schools').update({ theme_color: newColor }).eq('id', schoolsWithoutColor[i].id);
        }
        return loadSchools(); // reload with new colors
      }

      const allSchools = [NEUTRAL_SCHOOL, ...data];
      setSchools(allSchools);
      const savedSchoolId = localStorage.getItem('activeSchoolId');
      if (savedSchoolId && allSchools.find(s => s.id === savedSchoolId)) {
        setActiveSchool(allSchools.find(s => s.id === savedSchoolId));
      } else {
        setActiveSchool(NEUTRAL_SCHOOL);
      }
    }
    setLoading(false);
  };

  const selectSchool = (school) => {
    setActiveSchool(school);
    if (school) {
      localStorage.setItem('activeSchoolId', school.id);
    } else {
      localStorage.removeItem('activeSchoolId');
    }
  };

  const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e', '#84cc16'];

  const addSchool = async (name, color) => {
    const assignedColor = color || PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    const { data, error } = await supabase
      .from('schools')
      .insert([{ name, theme_color: assignedColor, mentor_id: session.user.id }])
      .select()
      .single();
      
    if (!error && data) {
      setSchools([...schools, data]);
      selectSchool(data);
      return data;
    }
    return null;
  };

  const deleteSchool = async (schoolId) => {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', schoolId);
      
    if (!error) {
      const updatedSchools = schools.filter(s => s.id !== schoolId);
      setSchools(updatedSchools);
      if (activeSchool?.id === schoolId) {
        selectSchool(updatedSchools.length > 0 ? updatedSchools[0] : null);
      }
      return true;
    } else {
      console.error("Failed to delete school:", error);
      return false;
    }
  };

  const archiveSchool = async (school) => {
    const newName = `[ארכיון] ${school.name}`;
    const { error } = await supabase
      .from('schools')
      .update({ name: newName })
      .eq('id', school.id);

    if (!error) {
      const updatedSchools = schools.map(s => s.id === school.id ? { ...s, name: newName } : s);
      setSchools(updatedSchools);
      if (activeSchool?.id === school.id) {
        const remainingActive = updatedSchools.filter(s => !s.name?.startsWith('[ארכיון]'));
        selectSchool(remainingActive.length > 0 ? remainingActive[0] : null);
      }
      return true;
    }
    return false;
  };

  const unarchiveSchool = async (school) => {
    const newName = school.name.replace('[ארכיון] ', '');
    const { error } = await supabase
      .from('schools')
      .update({ name: newName })
      .eq('id', school.id);

    if (!error) {
      const updatedSchools = schools.map(s => s.id === school.id ? { ...s, name: newName } : s);
      setSchools(updatedSchools);
      return true;
    }
    return false;
  };

  return (
    <SchoolContext.Provider value={{ schools, activeSchool, selectSchool, addSchool, deleteSchool, archiveSchool, unarchiveSchool, loading, role }}>
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchool = () => useContext(SchoolContext);
