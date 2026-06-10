// Coordinates for distance globe (Texas ↔ Noida)
export const COORDS = {
  vaibhav: { lat: 30.2672, lng: -97.7431, label: 'Texas, USA' },
  pragya:  { lat: 28.5355, lng:  77.3910, label: 'Noida, India' },
};

export function calcDistanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 +
    Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x)));
}

// SHA-256 hashes only — plain passwords never stored here
export const ADMIN_HASH = '55c1e84e1b5adf94dd549c795214200754e1c3eefdbbc4802390f25f8cea0c84';

export const USERS = [
  { id: 'pragya',  name: 'Pragya Yadav',      path: 'love', username: 'pragya',  hash: '04450f742b9beb0c97e857c449c8a6cc5206052b6ac2db82b7c065864d7fd844' },
  { id: 'vaibhav', name: 'Vaibhavkumar Yadav', path: 'self', username: 'vaibhav', hash: 'be9a25c420b95fcf15f2d7ee19dcc54241af600453fbdf573a4e2b38171abd12' },
];

export async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
