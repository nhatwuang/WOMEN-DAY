"use strict";

/* TIN 4 — WOMEN'S DAY 20/10
 * All 35 names live here, in the exact user-supplied order.
 * The ONE shared greeting is in index.html (#sharedWish).
 * This project is self-contained; it uses no APIs, dependencies or backend.
 */
const memberNames = Object.freeze([
  "Nguyễn Thị Mi Na",
  "Ngô Hồ Huyền Trang",
  "Nguyễn Thị Cẩm Tiên",
  "Nguyễn Thị Kim Chi",
  "Hồ Thị Ngọc Khánh",
  "Nguyễn Thị Phương Thảo",
  "Lê Thị Hiền Anh",
  "Hoàng Thị Tâm",
  "Cao Thị Thanh Huyền",
  "Đặng Thị Trâm",
  "Hoàng Thị Diệu Ánh",
  "Lê Thúy Hiền",
  "Nguyễn Thị Huyền My",
  "Ngô Thị Ngọc Duyên",
  "Trần Thị Cẩm Tú",
  "Nguyễn Thị Thúy Hải",
  "Nguyễn Thị Anh Đào",
  "Lê Thị Uyên",
  "Nay H' Iêng",
  "Nguyễn Thị Ngọc Trâm",
  "Ngô Thị Minh Thư",
  "Đặng Thị Hoa Lê",
  "Nguyễn Hiền Lương",
  "Trương Khánh Linh",
  "Lê Phương Nhi",
  "Nguyễn Hoài Phương",
  "Nguyễn Lê Bảo Trâm",
  "Nguyễn Lê Bảo Ngọc",
  "Đinh Vũ Anh Thủy",
  "Trần Thanh Hà",
  "Lê Thu Thảo",
  "Lương Hồng Tiên",
  "Nguyễn Tú Anh",
  "Phạm Nguyễn Khánh Nhi",
  "Trần Thục Uyên",
]);

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const MAX_BURST_PARTICLES = 90;
const activeParticles = new Set();
const $ = (selector, parent = document) => parent.querySelector(selector);
const byId = (id) => document.getElementById(id);

function reduceMotion() {
  return motionPreference.matches;
}

/* Diacritic-insensitive, case-insensitive and punctuation-tolerant Vietnamese search. */
function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[’'‘.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("vi");
}

/* ẢNH THÀNH VIÊN:
 * Cách đơn giản: đặt 01.jpg ... 35.jpg tại assets/images/members/.
 * Nếu ảnh là PNG/WEBP/JPEG hoặc muốn tên riêng, khai báo vào memberPhotoOverrides.
 * Ví dụ: 1: 'mi-na.png', 19: 'h-ieng.webp'.
 * Thiếu ảnh: thẻ vẫn đẹp với hình bông hoa mặc định, không đổi họ tên.
 */
const memberPhotoOverrides = Object.freeze({
  // 1: 'mi-na.png',
  // 19: 'h-ieng.webp',
});

function createMemberCard(name, position) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "member-card";
  card.style.setProperty("--arrival-order", String((position - 1) % 8));
  card.setAttribute("aria-label", `${position}. ${name} — chạm để hoa nở`);

  const photoFrame = document.createElement("span");
  photoFrame.className = "member-photo";

  const placeholder = document.createElement("span");
  placeholder.className = "member-photo-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.textContent = "✿";

  const image = document.createElement("img");
  image.className = "member-photo-image";
  image.alt = `Ảnh của ${name}`;
  image.loading = "lazy";
  image.decoding = "async";
  const fileName =
    memberPhotoOverrides[position] ||
    `${String(position).padStart(2, "0")}.jpg`;
  image.src = `./assets/images/members/${encodeURIComponent(fileName)}`;
  image.addEventListener("load", () => photoFrame.classList.add("has-photo"), {
    once: true,
  });
  image.addEventListener("error", () => image.remove(), { once: true });
  photoFrame.append(placeholder, image);

  const info = document.createElement("span");
  info.className = "member-info";
  const number = document.createElement("span");
  number.className = "member-number";
  number.textContent = String(position).padStart(2, "0");
  const fullName = document.createElement("span");
  fullName.className = "member-name";
  fullName.textContent = name; // Giữ nguyên chính xác tên, không dùng innerHTML.
  info.append(number, fullName);

  const flower = document.createElement("span");
  flower.className = "member-flower";
  flower.setAttribute("aria-hidden", "true");
  flower.textContent = "✿";
  card.append(photoFrame, info, flower);
  card.addEventListener("click", () => {
    if (!reduceMotion())
      burst(card, {
        count: 8,
        mode: "flower",
        originX: 68,
        originY: 55,
        spread: 112,
      });
  });
  return card;
}

const membersGrid = byId("membersGrid");
const memberSearch = byId("memberSearch");
const memberCount = byId("memberCount");
const emptySearch = byId("emptySearch");
const memberRecords = memberNames.map((name, index) => ({
  name,
  position: index + 1,
  normalized: normalizeName(name),
}));

function renderMembers(query = "") {
  const terms = normalizeName(query).split(" ").filter(Boolean);
  const matches = memberRecords.filter((person) =>
    terms.every((term) => person.normalized.includes(term)),
  );
  const fragment = document.createDocumentFragment();
  for (const person of matches)
    fragment.appendChild(createMemberCard(person.name, person.position));
  membersGrid.replaceChildren(fragment);
  memberCount.textContent = `Hiển thị ${matches.length}/${memberNames.length} thành viên`;
  emptySearch.hidden = matches.length !== 0;
}
memberSearch.addEventListener("input", (event) =>
  renderMembers(event.target.value),
);
byId("clearSearch").addEventListener("click", () => {
  memberSearch.value = "";
  renderMembers();
  memberSearch.focus();
});
renderMembers();

/* Keep transient particles bounded even if the visitor clicks repeatedly. */
function burst(
  parent,
  {
    count = 18,
    mode = "confetti",
    originX = 50,
    originY = 50,
    spread = 200,
  } = {},
) {
  if (reduceMotion()) return;
  const colors = [
    "#f7bfd1",
    "#f2d18b",
    "#debbdf",
    "#fff2df",
    "#b9688a",
    "#f5a5bb",
  ];
  for (let i = 0; i < count; i++) {
    while (activeParticles.size >= MAX_BURST_PARTICLES) {
      const oldest = activeParticles.values().next().value;
      oldest.remove();
      activeParticles.delete(oldest);
    }
    const particle = document.createElement("span");
    particle.className = `burst-piece${mode === "heart" ? " is-heart" : ""}`;
    particle.setAttribute("aria-hidden", "true");
    if (mode === "heart") particle.textContent = "♥";
    if (mode === "flower") particle.textContent = "✿";
    if (mode === "flower") {
      particle.classList.add("is-heart");
      particle.style.fontSize = "18px";
    }
    const angle =
      mode === "heart"
        ? -Math.PI / 2 + (Math.random() - 0.5) * 1.65
        : Math.random() * Math.PI * 2;
    const distance = spread * (0.4 + Math.random() * 0.75);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - (mode === "heart" ? 70 : 16);
    const set = (name, value) => particle.style.setProperty(name, value);
    set("--x", `${originX}%`);
    set("--y", `${originY}%`);
    set("--size", `${6 + Math.round(Math.random() * 7)}px`);
    set("--dx", `${dx.toFixed(1)}px`);
    set("--dy", `${dy.toFixed(1)}px`);
    set("--rotate", `${Math.round(Math.random() * 520 - 260)}deg`);
    set("--piece-color", colors[Math.floor(Math.random() * colors.length)]);
    set("--duration", `${(0.85 + Math.random() * 0.45).toFixed(2)}s`);
    set(
      "--radius",
      mode === "confetti" && i % 3 === 0 ? "2px" : "70% 10% 70% 10%",
    );
    const remove = () => {
      activeParticles.delete(particle);
      particle.remove();
    };
    particle.addEventListener("animationend", remove, { once: true });
    parent.appendChild(particle);
    activeParticles.add(particle);
    // Defensive cleanup when a browser discards an animation event.
    window.setTimeout(remove, 1600);
  }
}

/* A single shared greeting card, deliberately no personalized letter views. */
const letterCover = byId("letterCover");
const letterBody = byId("letterBody");
const letterShell = byId("letterShell");
const openLetter = byId("openLetter");
const closeLetter = byId("closeLetter");

function showLetter() {
  letterCover.hidden = true;
  letterBody.hidden = false;
  letterShell.classList.add("is-open");
  openLetter.setAttribute("aria-expanded", "true");
  burst(byId("letterConfetti"), {
    count: 28,
    mode: "confetti",
    originX: 50,
    originY: 24,
    spread: 235,
  });
  burst(byId("letterConfetti"), {
    count: 12,
    mode: "heart",
    originX: 50,
    originY: 57,
    spread: 160,
  });
  closeLetter.focus({ preventScroll: true });
}
function hideLetter() {
  letterBody.hidden = true;
  letterCover.hidden = false;
  letterShell.classList.remove("is-open");
  openLetter.setAttribute("aria-expanded", "false");
  openLetter.focus({ preventScroll: true });
}
openLetter.addEventListener("click", showLetter);
closeLetter.addEventListener("click", hideLetter);

/* Celebration button: multiple clicks remain safe and lightweight. */
const celebrationField = byId("celebrationField");
const celebrationMessage = byId("celebrationMessage");
byId("celebrateButton").addEventListener("click", () => {
  celebrationMessage.hidden = false;
  celebrationMessage.style.animation = "none";
  // Re-trigger the text reveal without rebuilding page content.
  void celebrationMessage.offsetWidth;
  celebrationMessage.style.animation = "";
  burst(celebrationField, {
    count: 35,
    mode: "heart",
    originX: 50,
    originY: 93,
    spread: 370,
  });
  burst(celebrationField, {
    count: 28,
    mode: "confetti",
    originX: 50,
    originY: 47,
    spread: 340,
  });
});

/* Gentle ambient petals are created once, not accumulated over time. */
const petalLayer = byId("ambientPetals");
function buildAmbientPetals() {
  petalLayer.replaceChildren();
  if (reduceMotion()) return;
  const count = Math.min(13, window.innerWidth < 520 ? 7 : 13);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.style.setProperty(
      "--left",
      `${((i * 79) / count + Math.random() * 9 + 3).toFixed(1)}%`,
    );
    petal.style.setProperty(
      "--size",
      `${(7 + Math.random() * 8).toFixed(0)}px`,
    );
    petal.style.setProperty(
      "--duration",
      `${(15 + Math.random() * 12).toFixed(1)}s`,
    );
    petal.style.setProperty("--delay", `${(-Math.random() * 30).toFixed(1)}s`);
    petal.style.setProperty(
      "--drift",
      `${(-80 + Math.random() * 160).toFixed(1)}px`,
    );
    fragment.appendChild(petal);
  }
  petalLayer.appendChild(fragment);
}
buildAmbientPetals();
motionPreference.addEventListener?.("change", buildAmbientPetals);

/* IntersectionObserver with no-animation fallback. */
const reveals = document.querySelectorAll(".reveal");
if (reduceMotion() || !("IntersectionObserver" in window)) {
  reveals.forEach((node) => node.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 40px 0px" },
  );
  reveals.forEach((node) => observer.observe(node));
}

/* NHẠC NỀN:
 * Chép nhạc vào assets/audio/nhac-nen.mp3 để thay giai điệu mặc định.
 * Có thể đổi tên file tại đây. Chỉ phát khi người dùng nhấn Bật nhạc.
 * Nếu thiếu / không đọc được MP3, sử dụng giai điệu Web Audio sẵn có.
 */
const CUSTOM_MUSIC_FILE = "./assets/audio/nhac-nen.mp3";
const CUSTOM_MUSIC_VOLUME = 0.48; // 0.0 đến 1.0
const musicToggle = byId("musicToggle");
const musicLabel = byId("musicLabel");
const audioStatus = byId("audioStatus");
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const customTrack = document.createElement("audio");
customTrack.preload = "none";
customTrack.loop = true;
customTrack.volume = CUSTOM_MUSIC_VOLUME;
customTrack.src = CUSTOM_MUSIC_FILE;
const notes = [
  523.25, 659.25, 783.99, 659.25, 698.46, 659.25, 587.33, 0, 493.88, 587.33,
  698.46, 587.33, 659.25, 587.33, 523.25, 0, 523.25, 659.25, 880.0, 783.99,
  698.46, 659.25, 587.33, 0, 587.33, 659.25, 698.46, 587.33, 523.25, 0, 392.0,
  0,
];
let audioContext = null;
let masterGain = null;
let melodyTimer = null;
let playing = false;
let currentMusicMode = null; // 'file' hoặc 'synth'
let nextNoteTime = 0;
let notePosition = 0;
let musicRequest = 0;

function scheduleTone(frequency, startTime, duration, volume = 1) {
  if (!frequency || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0.0001, startTime);
  envelope.gain.exponentialRampToValueAtTime(
    Math.max(0.001, 0.24 * volume),
    startTime + 0.05,
  );
  envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
  oscillator.addEventListener(
    "ended",
    () => {
      oscillator.disconnect();
      envelope.disconnect();
    },
    { once: true },
  );
}
function scheduleMelody() {
  if (!playing || currentMusicMode !== "synth" || !audioContext) return;
  while (nextNoteTime < audioContext.currentTime + 1.15) {
    const index = notePosition % notes.length;
    scheduleTone(notes[index], nextNoteTime, 0.49, 1);
    if (index % 8 === 0)
      scheduleTone(index < 16 ? 261.63 : 220, nextNoteTime, 1.6, 0.27);
    nextNoteTime += 0.42;
    notePosition += 1;
  }
}
function updateMusicButton(isPlaying) {
  playing = isPlaying;
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền",
  );
  musicLabel.textContent = isPlaying ? "Tắt nhạc" : "Bật nhạc";
  musicToggle.title = isPlaying
    ? "Nhấn để tắt nhạc"
    : "Nhấn để bật nhạc nền nhẹ nhàng";
  audioStatus.textContent = isPlaying
    ? "Đang phát nhạc nền."
    : "Đã tắt nhạc nền.";
}
function stopMusic() {
  ++musicRequest;
  customTrack.pause();
  try {
    customTrack.currentTime = 0;
  } catch {
    /* chấp nhận file chưa tải */
  }
  window.clearInterval(melodyTimer);
  melodyTimer = null;
  if (audioContext && masterGain) {
    masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.04);
    window.setTimeout(() => {
      if (!playing) audioContext.suspend().catch(() => {});
    }, 220);
  }
  currentMusicMode = null;
  updateMusicButton(false);
}
async function startSynthMusic(request) {
  if (!AudioContextClass)
    throw new Error("Trình duyệt không hỗ trợ nhạc Web Audio.");
  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(audioContext.destination);
  }
  await audioContext.resume();
  if (request !== musicRequest) return;
  masterGain.gain.setTargetAtTime(0.052, audioContext.currentTime, 0.07);
  nextNoteTime = audioContext.currentTime + 0.08;
  notePosition = 0;
  currentMusicMode = "synth";
  updateMusicButton(true);
  scheduleMelody();
  melodyTimer = window.setInterval(scheduleMelody, 430);
}
musicToggle.addEventListener("click", async () => {
  if (playing) {
    stopMusic();
    return;
  }
  const request = ++musicRequest;
  musicToggle.disabled = true;
  audioStatus.textContent = "Đang mở nhạc nền...";
  try {
    // MP3 riêng được ưu tiên; nếu không có file thì chuyển sang nhạc mặc định.
    await customTrack.play();
    if (request !== musicRequest) {
      customTrack.pause();
      return;
    }
    currentMusicMode = "file";
    updateMusicButton(true);
  } catch (error) {
    try {
      await startSynthMusic(request);
      audioStatus.textContent =
        "Đang phát nhạc nền mặc định (chưa có MP3 phù hợp).";
    } catch (fallbackError) {
      updateMusicButton(false);
      audioStatus.textContent = "Trình duyệt không thể phát nhạc nền.";
      console.warn("Không phát được nhạc nền:", error, fallbackError);
    }
  } finally {
    if (request === musicRequest) musicToggle.disabled = false;
  }
});

document.addEventListener("visibilitychange", () => {
  // Pause the music when the tab is hidden to conserve battery and avoid
  // surprising the visitor with a background soundtrack.
  if (document.hidden && playing) musicToggle.click();
});
