export const ADMIN_PASSWORD = 'vaibhav2024';

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

export const USERS = [
  { id: 'pragya',  name: 'Pragya Yadav',      path: 'love',   username: 'pragya',  password: 'meri-jaan'   },
  { id: 'alka',    name: 'Alka Yadav',         path: 'bestie', username: 'panda',   password: 'best-dost'   },
  { id: 'vaibhav', name: 'Vaibhavkumar Yadav', path: 'self',   username: 'vaibhav', password: 'builder2024' },
];
