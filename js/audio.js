/**
 * Audio System Module
 * Manages audio playback for love, bestie, and self paths
 * Uses HTML <audio> elements with fade in/out support
 */

const _tracks = {}; // keyed by path: 'love'|'bestie'|'self' → HTMLAudioElement
let _current = null; // currently playing audio element
let _isMuted = false;
let _fadeRaf = null; // rAF handle for active fade
let _initialized = false;

/**
 * Get or create an audio element for the given track path
 * @param {string} path - 'love', 'bestie', or 'self'
 * @returns {HTMLAudioElement} Audio element for the track
 */
function _getAudio(path) {
  if (!_tracks[path]) {
    const a = new Audio(`audio/${path}.mp3`);
    a.loop = true;
    a.preload = 'auto';
    _tracks[path] = a;
  }
  return _tracks[path];
}

/**
 * Fade audio to a target volume over a duration
 * Uses requestAnimationFrame for smooth fade
 * @param {HTMLAudioElement} audio - Audio element to fade
 * @param {number} targetVol - Target volume (0-1)
 * @param {number} durationMs - Duration in milliseconds
 * @param {Function} onDone - Callback when fade completes
 */
function _fadeTo(audio, targetVol, durationMs, onDone) {
  if (_fadeRaf) cancelAnimationFrame(_fadeRaf);

  const startVol = audio.volume;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / durationMs, 1);
    audio.volume = startVol + (targetVol - startVol) * t;

    if (t < 1) {
      _fadeRaf = requestAnimationFrame(tick);
    } else {
      _fadeRaf = null;
      if (onDone) onDone();
    }
  }

  _fadeRaf = requestAnimationFrame(tick);
}

/**
 * Initialize audio system
 * Called once to set up Web Audio context
 * Audio elements are lazy-created on first playTrack call
 */
export function initAudio() {
  if (_initialized) return;
  _initialized = true;
  // No-op on first call - audio elements created lazily on first playTrack
}

/**
 * Play a track with fade-in
 * Stops any current track, loads new one, sets loop=true, fades in to 0.7
 * @param {string} path - 'love', 'bestie', or 'self'
 */
export function playTrack(path) {
  // Stop current track if playing
  if (_current) {
    _current.pause();
    _current.currentTime = 0;
  }

  // Get or create audio element for the path
  const audio = _getAudio(path);
  _current = audio;

  // Reset state for new track
  audio.currentTime = 0;
  audio.volume = 0;

  // Start playback
  const playPromise = audio.play();

  // Handle autoplay policy - silently catch DOMException if blocked
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      // Autoplay policy blocked - this is expected in some contexts
      console.debug('Audio autoplay blocked:', err.name);
    });
  }

  // Apply mute state if currently muted
  if (_isMuted) {
    audio.volume = 0;
  } else {
    // Fade in to 0.7 over 1500ms
    _fadeTo(audio, 0.7, 1500);
  }
}

/**
 * Stop current track with fade-out
 * @param {number} fadeDuration - Fade duration in milliseconds (default 1000)
 */
export function stopTrack(fadeDuration = 1000) {
  if (!_current) return;

  _fadeTo(_current, 0, fadeDuration, () => {
    if (_current) {
      _current.pause();
      _current.currentTime = 0;
    }
  });
}

/**
 * Toggle mute state
 * If muted → unmute (restore volume 0.7)
 * If unmuted → mute (volume 0)
 * @returns {boolean} New muted state
 */
export function toggleMute() {
  _isMuted = !_isMuted;

  if (_current) {
    if (_isMuted) {
      _fadeTo(_current, 0, 300);
    } else {
      _fadeTo(_current, 0.7, 300);
    }
  }

  return _isMuted;
}

/**
 * Bind mute button to toggle mute on click
 * Updates button text: '🔇' when muted, '🔊' when unmuted
 * @param {HTMLElement} btnEl - Button element
 */
export function bindMuteBtn(btnEl) {
  const updateButtonText = () => {
    btnEl.textContent = _isMuted ? '🔇' : '🔊';
  };

  btnEl.addEventListener('click', () => {
    toggleMute();
    updateButtonText();
  });

  // Set initial text
  updateButtonText();
}
