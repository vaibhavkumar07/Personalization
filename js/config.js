// Change ADMIN_PASSWORD before deploying
export const ADMIN_PASSWORD = 'vaibhav2024';
export const FACE_MATCH_THRESHOLD = 0.6;
export const FACE_STABILITY_MS = 1500; // hold before prompting name

// Coordinates for distance globe (Texas ↔ Noida)
export const COORDS = {
  vaibhav: { lat: 30.2672, lng: -97.7431, label: 'Texas, USA' },
  pragya:  { lat: 28.5355, lng:  77.3910, label: 'Noida, India' },
};

// Haversine distance between the two — ~13,400 km
export function calcDistanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 +
    Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x)));
}

// Default users — descriptors populated from localStorage after enrollment
export const DEFAULT_USERS = [
  { id: 'pragya',   name: 'Pragya Yadav',       path: 'love',   descriptor: null },
  { id: 'alka',     name: 'Alka Yadav',          path: 'bestie', descriptor: null },
  { id: 'vaibhav',  name: 'Vaibhavkumar Yadav',  path: 'self',   descriptor: null },
];

export const STORAGE_KEY = 'love_portal_users';

export function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USERS.map(u => ({ ...u }));
    const saved = JSON.parse(raw);
    return DEFAULT_USERS.map(u => {
      const s = saved.find(x => x.id === u.id);
      if (s?.descriptor) {
        return { ...u, descriptor: new Float32Array(
          Array.isArray(s.descriptor) ? s.descriptor : Object.values(s.descriptor)
        ) };
      }
      return { ...u };
    });
  } catch { return DEFAULT_USERS.map(u => ({ ...u })); }
}

export function saveUsers(users) {
  const serializable = users.map(u => ({
    id: u.id,
    descriptor: u.descriptor ? Array.from(u.descriptor) : null,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}
