import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Generate UUID for visitor
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getVisitorId = () => {
  let vid = localStorage.getItem('visitor_id');
  if (!vid) {
    vid = generateUUID();
    localStorage.setItem('visitor_id', vid);
  }
  return vid;
};

// Fetch Geo Data
const fetchGeoData = async () => {
  try {
    const cachedGeo = sessionStorage.getItem('geo_data');
    if (cachedGeo) return JSON.parse(cachedGeo);

    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    
    if (data.success) {
      const geo = {
        country: data.country,
        region: data.region
      };
      sessionStorage.setItem('geo_data', JSON.stringify(geo));
      return geo;
    }
  } catch (error) {
    console.error('Failed to fetch geo data', error);
  }
  return { country: 'Unknown', region: 'Unknown' };
};

export const useTracker = () => {
  const location = useLocation();
  const trackedPages = useRef(new Set());

  const logEvent = async (pathName) => {
    // Avoid blocking UI with setTimeout
    setTimeout(async () => {
      try {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        const finalPath = isAdmin ? `[מנהל] ${pathName}` : pathName;
        const visitorId = getVisitorId();
        const geoData = await fetchGeoData();

        await supabase.from('page_views').insert([
          {
            path: finalPath,
            visitor_id: visitorId,
            user_agent: navigator.userAgent,
            country: geoData.country,
            region: geoData.region
          }
        ]);
      } catch (err) {
        console.error('Analytics error:', err);
      }
    }, 0);
  };

  // Track Page Views
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    logEvent(currentPath);
  }, [location]);

  // Track External Links globally
  useEffect(() => {
    const handleGlobalClick = (e) => {
      let target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentNode;
      }
      
      if (target && target.tagName === 'A' && target.href) {
        const isExternal = target.href.startsWith('http') && !target.href.includes(window.location.host);
        if (isExternal) {
          logEvent(`[Outbound] ${target.href}`);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
};
