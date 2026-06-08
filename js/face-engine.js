import { FACE_MATCH_THRESHOLD } from './config.js';

let _modelsLoaded = false;

export async function loadModels() {
  if (_modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  _modelsLoaded = true;
}

export async function detectSingle(video) {
  return faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
}

export async function computeDescriptor(video) {
  const det = await detectSingle(video);
  return det?.descriptor ?? null;
}

// Returns matched user or null
export function findMatch(descriptor, users) {
  let best = null;
  let bestDist = Infinity;
  for (const user of users) {
    if (!user.descriptor) continue;
    const dist = faceapi.euclideanDistance(
      Array.from(descriptor),
      Array.from(user.descriptor)
    );
    if (dist < bestDist) { bestDist = dist; best = user; }
  }
  return bestDist < FACE_MATCH_THRESHOLD ? best : null;
}

export function drawDetection(canvas, video, detection) {
  const dims = faceapi.matchDimensions(canvas, video, true);
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!detection) return;
  const resized = faceapi.resizeResults(detection, dims);
  const box = resized.detection.box;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
}
