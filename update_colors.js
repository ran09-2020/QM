import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcattfrjsuoheuiboxpr.supabase.co';
const supabaseKey = 'sb_publishable_quJNNMjzE0JBzZfL1Napzg_3Ws1ltRU';

const supabase = createClient(supabaseUrl, supabaseKey);
const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e', '#84cc16'];

async function updateColors() {
  const { data: schools, error } = await supabase.from('schools').select('*');
  if (error) {
    console.error('Error fetching schools:', error);
    return;
  }
  
  console.log(`Found ${schools.length} schools.`);
  let index = 0;
  for (const school of schools) {
    const color = PRESET_COLORS[index % PRESET_COLORS.length];
    console.log(`Updating school ${school.name} to color ${color}`);
    await supabase.from('schools').update({ theme_color: color }).eq('id', school.id);
    index++;
  }
  console.log('Update complete.');
}

updateColors();
