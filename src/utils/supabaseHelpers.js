export const applySchoolFilter = (query, role, activeSchool) => {
  if (role === 'mentor') {
    if (activeSchool?.id) {
      return query.eq('school_id', activeSchool.id);
    } else {
      // If mentor has no active school selected, return nothing
      return query.eq('school_id', '00000000-0000-0000-0000-000000000000');
    }
  } else {
    // Principal role only sees records with no school assigned
    return query.is('school_id', null);
  }
};

export const getSchoolInsertData = (role, activeSchool) => {
  if (role === 'mentor' && activeSchool?.id) {
    return { school_id: activeSchool.id };
  }
  return { school_id: null }; // Default for principal
};
