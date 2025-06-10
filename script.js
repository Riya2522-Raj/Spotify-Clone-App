const songs = {
  "kabhi-kabhi-img": {
    title: "Kabhi Kabhi Aditi",
    artist: "From Jaane Tu Ya Jaane Na",
    src: "assets/Songs/aditi.mp3",
    img: "assets/Img/aditi.jpeg"
  },
  "khudajane-img": {
    title: "Khuda Jaane",
    artist: "From Bachna Ae Haseeno",
    src: "assets/Songs/khuda.mp3",
    img: "assets/Img/khudajane.jpeg"
  },
  "iktara-img": {
    title: "Iktara",
    artist: "From Wake Up Sid",
    src: "assets/Songs/iktara.mp3",
    img: "assets/Img/iktara.jpeg"
  },
  "starboy-img": {
    title: "Jogian",
    artist: "By The Weeknd",
    src: "assets/Songs/vich.mp3",
    img: "assets/Img/vich.jpeg"
  }
};

const audio = new Audio();
let currentSongIndex = 0;
const songKeys = Object.keys(songs);

const nowPlayingTitle = document.querySelector('.song-info h4');
const nowPlayingArtist = document.querySelector('.song-info p');
const albumArt = document.querySelector('.now-playing img');
const playBtn = document.querySelector('.fa-play-circle');
const progressFill = document.querySelector('.progress-fill');
const progressBar = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.progress-bar span:first-child');
const durationEl = document.querySelector('.progress-bar span:last-child');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');

// Load song details by key
function loadSongByKey(key) {
  const song = songs[key];
  if (!song) return;
  audio.src = song.src;
  audio.load();  // Important: reload the audio source
  nowPlayingTitle.textContent = song.title;
  nowPlayingArtist.textContent = song.artist;
  albumArt.src = song.img;
}

// Load song by index
function loadSong(index) {
  const key = songKeys[index];
  loadSongByKey(key);
}

// Play song
function playSong() {
  audio.play().catch(err => {
    console.log("Playback failed:", err);
  });
  playBtn.classList.remove('fa-play-circle');
  playBtn.classList.add('fa-pause-circle');
}

// Pause song
function pauseSong() {
  audio.pause();
  playBtn.classList.remove('fa-pause-circle');
  playBtn.classList.add('fa-play-circle');
}

// Toggle play/pause
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Update progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Seek functionality
progressBar.addEventListener('click', (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Format time MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

// Previous song
prevBtn.addEventListener('click', () => {
  currentSongIndex--;
  if (currentSongIndex < 0) currentSongIndex = songKeys.length - 1;
  loadSong(currentSongIndex);
  playSong();
});

// Next song
nextBtn.addEventListener('click', () => {
  currentSongIndex++;
  if (currentSongIndex >= songKeys.length) currentSongIndex = 0;
  loadSong(currentSongIndex);
  playSong();
});

// Auto play next
audio.addEventListener('ended', () => {
  nextBtn.click();
});

// Volume control
const volumeFill = document.querySelector('.volume-fill');
const volumeBar = document.querySelector('.volume-bar');
const volumeIcon = document.querySelector('.fa-volume-up');

volumeBar.addEventListener('click', (e) => {
  const width = volumeBar.clientWidth;
  const clickX = e.offsetX;
  const volume = clickX / width;
  audio.volume = volume;
  volumeFill.style.width = `${volume * 100}%`;

  if (volume === 0) {
    volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
  } else {
    volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
  }
});

// Click any track image to play
document.querySelectorAll('.playable-track').forEach(img => {
  img.addEventListener('click', () => {
    const id = img.id;
    if (!songs[id]) return;  // Safety check
    currentSongIndex = songKeys.indexOf(id);
    loadSongByKey(id);
    console.log("Clicked song:", songs[id].title);
    playSong();
  });
});

// Initial load
loadSong(currentSongIndex);
