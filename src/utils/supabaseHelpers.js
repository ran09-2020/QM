export const applySchoolFilter = (query, role, activeSchool) => {
  if (role === 'mentor') {
    if (activeSchool?.id && activeSchool.id !== 'neutral') {
      return query.eq('school_id', activeSchool.id);
    } else {
      // If mentor has 'neutral' selected, show artifacts that have no school assigned
      return query.is('school_id', null);
    }
  } else {
    // Principal role only sees records with no school assigned
    return query.is('school_id', null);
  }
};

export const getSchoolInsertData = (role, activeSchool) => {
  if (role === 'mentor' && activeSchool?.id && activeSchool.id !== 'neutral') {
    return { school_id: activeSchool.id };
  }
  return { school_id: null }; // Default for principal or when no active school is selected
};
