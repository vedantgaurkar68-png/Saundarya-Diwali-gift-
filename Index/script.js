const intro = document.getElementById("intro");
const site = document.getElementById("siteContent");
const openButton = document.getElementById("openSurprise");
const canvas = document.getElementById("sparkles");
const ctx = canvas.getContext("2d");
let particles = [];
let audioContext = null;
let musicTimer = null;
let noteIndex = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({length: 75}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + .4,
    speed: Math.random() * .35 + .08,
    alpha: Math.random() * .65 + .2
  }));
}
function drawSparkles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(p => {
    p.y -= p.speed;
    if (p.y < -5) { p.y = window.innerHeight + 5; p.x = Math.random() * window.innerWidth; }
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,205,145,${p.alpha})`; ctx.fill();
  });
  requestAnimationFrame(drawSparkles);
}
resizeCanvas(); drawSparkles(); window.addEventListener("resize", resizeCanvas);

function makeHearts(count = 14) {
  const holder = document.getElementById("hearts");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = Math.random() > .5 ? "♡" : "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 20}px`;
    heart.style.animationDuration = `${5 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * 1.5}s`;
    holder.appendChild(heart);
    setTimeout(() => heart.remove(), 10500);
  }
}
openButton.addEventListener("click", () => {
  intro.classList.add("hide");
  setTimeout(() => {
    intro.style.display = "none";
    site.classList.add("show");
    site.setAttribute("aria-hidden", "false");
    makeHearts(22);
  }, 850);
});

function playSoftChime() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[noteIndex++ % notes.length];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.1);
  osc.connect(gain); gain.connect(audioContext.destination);
  osc.start(); osc.stop(audioContext.currentTime + 1.15);
}
const musicButton = document.getElementById("musicToggle");
musicButton.addEventListener("click", async () => {
  if (musicTimer) {
    clearInterval(musicTimer); musicTimer = null;
    musicButton.innerHTML = "♫ <span>Play music</span>";
    musicButton.setAttribute("aria-pressed", "false");
  } else {
    if (audioContext?.state === "suspended") await audioContext.resume();
    playSoftChime();
    musicTimer = setInterval(playSoftChime, 1150);
    musicButton.innerHTML = "♫ <span>Pause music</span>";
    musicButton.setAttribute("aria-pressed", "true");
  }
});

document.getElementById("heartButton").addEventListener("click", () => {
  makeHearts(35);
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
  document.getElementById("finalMessage").textContent = "If I could send you one thing right now, it would be a thousand reasons to smile. ♥";
});