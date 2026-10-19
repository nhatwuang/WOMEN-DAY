"use strict";

/* TIN 4 — WOMEN'S DAY 20/10
 * All 35 names live here, in the exact user-supplied order.
 * The ONE shared greeting is in index.html (#sharedWish).
 * This project is self-contained; it uses no APIs, dependencies or backend.
 */
const memberNames = Object.freeze([
  "Lê Thị Hiền Anh",
  "Nguyễn Tú Anh",
  "Hoàng Thị Diệu Ánh",
  "Nguyễn Thị Kim Chi",
  "Ngô Thị Ngọc Duyên",
  "Nguyễn Thị Anh Đào",
  "Trần Thanh Hà",
  "Nguyễn Thị Thúy Hải",
  "Lê Thúy Hiền",
  "Cao Thị Thanh Huyền",
  "Nay H' Iêng",
  "Hồ Thị Ngọc Khánh",
  "Đặng Thị Hoa Lê",
  "Trương Khánh Linh",
  "Nguyễn Hiền Lương",
  "Nguyễn Thị Huyền My",
  "Nguyễn Thị Mi Na",
  "Nguyễn Lê Bảo Ngọc",
  "Lê Phương Nhi",
  "Phạm Nguyễn Khánh Nhi",
  "Nguyễn Hoài Phương",
  "Hoàng Thị Tâm",
  "Lê Thu Thảo",
  "Nguyễn Thị Phương Thảo",
  "Đinh Vũ Anh Thủy",
  "Ngô Thị Minh Thư",
  "Lương Hồng Tiên",
  "Nguyễn Thị Cẩm Tiên",
  "Ngô Hồ Huyền Trang",
  "Đặng Thị Trâm",
  "Nguyễn Lê Bảo Trâm",
  "Nguyễn Thị Ngọc Trâm",
  "Trần Thị Cẩm Tú",
  "Lê Thị Uyên",
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

/* ==========================================
   35 LỜI CHÚC RIÊNG — LỚP TIN 4
   Ngày Phụ nữ Việt Nam 20/10
   ========================================== */

const personalWishes = {
  "Lê Thị Hiền Anh":
    "Hiền Anh ơi! Chúc bạn một ngày 20/10 thật ngọt ngào, luôn giữ được nụ cười tươi tắn và niềm tin vào bản thân. Mong rằng những ngày phía trước sẽ mang đến cho bạn thật nhiều điều đáng yêu và những ước mơ dần trở thành hiện thực.",

  "Nguyễn Tú Anh":
    "Gửi Tú Anh! Chúc bạn luôn tự tin bước đi trên con đường mình lựa chọn, đủ mạnh mẽ để vượt qua thử thách và đủ dịu dàng để tận hưởng những niềm vui nhỏ bé. Chúc bạn có một ngày 20/10 trọn vẹn yêu thương!",

  "Hoàng Thị Diệu Ánh":
    "Diệu Ánh thân mến! Mong rằng cuộc sống của bạn luôn có những tia nắng ấm áp, những người bạn chân thành và những khoảnh khắc khiến bạn mỉm cười. Chúc bạn ngày càng rạng rỡ và đạt được mọi điều mình mong muốn!",

  "Nguyễn Thị Kim Chi":
    "Kim Chi ơi! Nhân ngày 20/10, chúc bạn luôn xinh đẹp, vui vẻ và gặp thật nhiều may mắn. Mong rằng mỗi ngày của bạn đều có những điều thú vị để khám phá và những kỷ niệm đẹp để lưu giữ.",

  "Ngô Thị Ngọc Duyên":
    "Gửi Ngọc Duyên! Chúc bạn luôn được yêu thương, trân trọng và có thật nhiều cơ hội để thể hiện bản thân. Hy vọng thanh xuân của bạn sẽ là một hành trình đầy màu sắc, tiếng cười và những điều tốt đẹp.",

  "Nguyễn Thị Anh Đào":
    "Anh Đào ơi! Chúc bạn luôn rạng rỡ như những cánh hoa mùa xuân, giữ được sự lạc quan và tinh thần tích cực trong cuộc sống. Mong mọi dự định của bạn đều thuận lợi và mỗi ngày đều đáng để mỉm cười!",

  "Trần Thanh Hà":
    "Thanh Hà thân mến! Chúc bạn một ngày 20/10 ngập tràn niềm vui, nhận được thật nhiều sự quan tâm và những lời chúc chân thành. Mong rằng bạn sẽ luôn tìm thấy hạnh phúc trong những điều giản dị nhất.",

  "Nguyễn Thị Thúy Hải":
    "Thúy Hải ơi! Chúc bạn có một hành trình thanh xuân thật đáng nhớ, luôn tự do theo đuổi ước mơ và không ngại thử sức với những điều mới mẻ. Hy vọng mọi cố gắng của bạn sẽ được đền đáp xứng đáng!",

  "Lê Thúy Hiền":
    "Gửi Thúy Hiền! Chúc bạn luôn có những ngày bình yên, những người đồng hành tốt và thật nhiều động lực để phát triển bản thân. Mong bạn sẽ luôn tự hào về chính mình và những gì mình đạt được.",

  "Cao Thị Thanh Huyền":
    "Thanh Huyền ơi! Chúc bạn luôn xinh đẹp, yêu đời và gặp nhiều điều bất ngờ thú vị. Dù học tập hay làm việc, mong bạn luôn giữ được sự tự tin và từng bước chinh phục những mục tiêu của riêng mình!",

  "Nay H' Iêng":
    "H' Iêng thân mến! Chúc bạn một ngày 20/10 thật ý nghĩa với nhiều niềm vui và những khoảnh khắc đáng nhớ. Mong rằng bạn luôn khỏe mạnh, hạnh phúc và có đủ bản lĩnh để thực hiện những điều mình yêu thích.",

  "Hồ Thị Ngọc Khánh":
    "Ngọc Khánh ơi! Chúc bạn luôn đón nhận những ngày mới bằng một tâm trạng thật vui, gặp nhiều may mắn và những cơ hội tuyệt vời. Hy vọng cuộc sống sẽ dành cho bạn thật nhiều điều ngọt ngào và đáng trân trọng!",

  "Đặng Thị Hoa Lê":
    "Hoa Lê thân mến! Chúc bạn luôn tươi tắn như một đóa hoa, tự tin thể hiện nét đẹp riêng và không ngừng tỏa sáng. Mong ngày 20/10 này sẽ mang đến cho bạn thật nhiều nụ cười cùng những kỷ niệm đáng yêu.",

  "Trương Khánh Linh":
    "Khánh Linh ơi! Chúc bạn luôn có thật nhiều năng lượng để theo đuổi đam mê, học tập thật tốt và tận hưởng những năm tháng thanh xuân. Mong mọi điều bạn đang cố gắng đều sớm mang lại kết quả tốt đẹp!",

  "Nguyễn Hiền Lương":
    "Gửi Hiền Lương! Chúc bạn luôn bình an, vui vẻ và tìm thấy những điều khiến trái tim mình hạnh phúc. Mong rằng cuộc sống sẽ mang đến cho bạn những trải nghiệm đáng quý cùng thật nhiều thành công phía trước.",

  "Nguyễn Thị Huyền My":
    "Huyền My ơi! Chúc bạn luôn xinh đẹp, tự tin và có một tuổi trẻ thật rực rỡ. Hãy tiếp tục theo đuổi những điều mình tin tưởng, bởi mỗi bước cố gắng hôm nay đều góp phần tạo nên một tương lai thật đẹp!",

  "Nguyễn Thị Mi Na":
    "Mi Na thân mến! Chúc bạn ngày 20/10 ngập tràn những điều dễ thương, luôn được quan tâm và có thật nhiều lý do để mỉm cười. Mong bạn sẽ có một thanh xuân thật đáng nhớ và luôn hạnh phúc với những lựa chọn của mình!",

  "Nguyễn Lê Bảo Ngọc":
    "Bảo Ngọc ơi! Chúc bạn luôn biết trân trọng giá trị của bản thân, tự tin theo đuổi điều mình yêu thích và gặp được những người thật lòng yêu quý mình. Mong bạn luôn tỏa sáng theo cách riêng, không cần phải giống bất kỳ ai!",

  "Lê Phương Nhi":
    "Phương Nhi thân mến! Chúc bạn có một ngày 20/10 thật đáng yêu, luôn giữ được sự lạc quan và niềm háo hức trước những điều mới mẻ. Mong tuổi trẻ của bạn sẽ có thật nhiều chuyến đi, trải nghiệm và kỷ niệm đẹp!",

  "Phạm Nguyễn Khánh Nhi":
    "Khánh Nhi ơi! Chúc bạn luôn gặp may mắn trên hành trình trưởng thành, có đủ tự tin để thử sức và đủ kiên trì để theo đuổi mục tiêu. Mong rằng mỗi ngày đều mang đến cho bạn thêm một niềm vui nho nhỏ!",

  "Nguyễn Hoài Phương":
    "Gửi Hoài Phương! Chúc bạn luôn mạnh mẽ khi cần, dịu dàng với chính mình và không quên tận hưởng những điều tốt đẹp xung quanh. Hy vọng con đường phía trước sẽ mở ra thật nhiều cơ hội để bạn thực hiện ước mơ!",

  "Hoàng Thị Tâm":
    "Tâm ơi! Chúc bạn luôn có một trái tim vui vẻ, một tinh thần lạc quan và thật nhiều người tốt đồng hành. Mong cuộc sống của bạn luôn có những khoảnh khắc bình yên, những niềm vui bất ngờ và những điều đáng nhớ!",

  "Lê Thu Thảo":
    "Thu Thảo thân mến! Chúc bạn một ngày 20/10 nhẹ nhàng và ngọt ngào như những ngày thu đẹp nhất. Mong rằng bạn luôn được là chính mình, được theo đuổi những điều yêu thích và có thật nhiều thành công trong tương lai.",

  "Nguyễn Thị Phương Thảo":
    "Phương Thảo ơi! Chúc bạn luôn vui tươi, tràn đầy năng lượng và có thật nhiều động lực trong học tập cũng như cuộc sống. Hy vọng mỗi thử thách đều giúp bạn trưởng thành hơn và mỗi thành công đều mang lại một nụ cười thật rạng rỡ!",

  "Đinh Vũ Anh Thủy":
    "Anh Thủy thân mến! Chúc bạn luôn bình tĩnh trước khó khăn, tự tin trước những cơ hội mới và tận hưởng từng khoảnh khắc của tuổi trẻ. Mong ngày 20/10 sẽ mang đến cho bạn thật nhiều yêu thương và những điều bất ngờ thú vị!",

  "Ngô Thị Minh Thư":
    "Minh Thư ơi! Chúc bạn luôn giữ được những ước mơ đẹp, không ngừng khám phá khả năng của bản thân và tìm thấy niềm vui trên hành trình trưởng thành. Mong bạn sẽ có một tương lai thật rực rỡ và đầy ý nghĩa!",

  "Lương Hồng Tiên":
    "Hồng Tiên thân mến! Chúc bạn luôn rạng rỡ, hạnh phúc và có những ngày tháng thanh xuân thật nhiều màu sắc. Mong cuộc sống sẽ mang đến cho bạn những điều kỳ diệu theo cách rất riêng, cùng thật nhiều may mắn và niềm vui!",

  "Nguyễn Thị Cẩm Tiên":
    "Cẩm Tiên ơi! Chúc bạn luôn xinh đẹp, tự tin và nhận được thật nhiều tình cảm chân thành. Mong rằng hành trình phía trước sẽ có nhiều cơ hội mới, những thành công xứng đáng và vô số khoảnh khắc khiến bạn hạnh phúc!",

  "Ngô Hồ Huyền Trang":
    "Huyền Trang thân mến! Chúc bạn luôn có đủ nhiệt huyết để thực hiện dự định, đủ kiên nhẫn để vượt qua khó khăn và đủ thời gian để tận hưởng những niềm vui của riêng mình. Chúc bạn một ngày 20/10 thật đặc biệt!",

  "Đặng Thị Trâm":
    "Trâm ơi! Chúc bạn luôn có một cuộc sống nhiều tiếng cười, những tình bạn đáng quý và những trải nghiệm thú vị. Mong bạn luôn tự tin vào bản thân và có thật nhiều cơ hội để biến những dự định thành hiện thực!",

  "Nguyễn Lê Bảo Trâm":
    "Bảo Trâm thân mến! Chúc bạn một ngày 20/10 đầy ắp sự quan tâm, những lời chúc tốt đẹp và niềm vui bất ngờ. Mong rằng bạn luôn giữ được tinh thần tích cực, yêu thương chính mình và vững vàng trên con đường đã chọn!",

  "Nguyễn Thị Ngọc Trâm":
    "Ngọc Trâm ơi! Chúc bạn luôn tìm thấy điều đẹp đẽ trong mỗi ngày, tự tin với nét riêng của bản thân và có nhiều thành công đáng tự hào. Hy vọng những năm tháng ở Lớp Tin 4 sẽ trở thành một phần ký ức thật đáng yêu!",

  "Trần Thị Cẩm Tú":
    "Cẩm Tú thân mến! Chúc bạn có một tuổi trẻ thật phong phú với nhiều trải nghiệm, niềm vui và những người bạn đáng quý. Mong mọi con đường bạn lựa chọn đều mang đến những bài học tốt và những kết quả xứng đáng!",

  "Lê Thị Uyên":
    "Uyên ơi! Chúc bạn luôn mạnh khỏe, hạnh phúc và có một hành trình trưởng thành thật nhiều điều thú vị. Mong rằng bạn sẽ luôn giữ được nụ cười, sự tự tin và niềm tin vào những điều tốt đẹp phía trước!",

  "Trần Thục Uyên":
    "Thục Uyên thân mến! Chúc bạn một ngày 20/10 ngập tràn yêu thương, một tuổi trẻ đầy ắp kỷ niệm và một tương lai thật nhiều cơ hội. Hãy luôn trân trọng bản thân và tự tin tỏa sáng theo cách mà bạn mong muốn!",
};

/* ==========================================
   HIỂN THỊ THIỆP KHI NHẤN VÀO THÀNH VIÊN
   Dán tiếp phần này trong cùng script.js
   ========================================== */

const wishStyle = document.createElement("style");

wishStyle.textContent = `
  .tin4-personal-dialog {
    box-sizing: border-box;
    width: min(92vw, 520px);
    max-height: 85vh;
    overflow-y: auto;
    margin: auto;
    padding: 38px 28px 32px;
    border: 1px solid #f8bbd0;
    border-radius: 24px;
    background: linear-gradient(
      145deg, #fffdf8, #fff0f5
    );
    color: #67455a;
    box-shadow: 0 24px 80px #62415b38;
    text-align: center;
  }

  .tin4-personal-dialog::backdrop {
    background: #34223699;
    backdrop-filter: blur(7px);
  }

  .tin4-personal-dialog .wish-flower {
    font-size: 44px;
    color: #cf80a7;
  }

  .tin4-personal-dialog h3 {
    margin: 14px 0 20px;
    color: #a44e7a;
    font-size: clamp(23px, 5vw, 31px);
    line-height: 1.3;
  }

  .tin4-personal-dialog .wish-message {
    font-size: 16px;
    line-height: 1.9;
    white-space: pre-line;
  }

  .tin4-personal-dialog .wish-signature {
    margin-top: 26px;
    font-style: italic;
    color: #ae739b;
  }

  .tin4-personal-dialog .wish-close {
    margin-top: 22px;
    padding: 12px 25px;
    border: 0;
    border-radius: 30px;
    background: #b76f99;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .tin4-personal-dialog .wish-close:hover {
    background: #9a547f;
  }

  .tin4-personal-dialog .wish-close:focus-visible {
    outline: 3px solid #67455a;
    outline-offset: 4px;
  }
`;

document.head.appendChild(wishStyle);

const personalDialog = document.createElement("dialog");
personalDialog.className = "tin4-personal-dialog";

personalDialog.innerHTML = `
  <div class="wish-flower" aria-hidden="true">❀</div>
  <h3 id="tin4WishName"></h3>
  <p id="tin4WishMessage" class="wish-message"></p>
  <p class="wish-signature">
    With love — Lớp Tin 4 ♡
  </p>
  <button type="button" class="wish-close">
    Đóng lời chúc
  </button>
`;

personalDialog.setAttribute("aria-labelledby", "tin4WishName");
personalDialog.setAttribute("aria-describedby", "tin4WishMessage");

document.body.appendChild(personalDialog);

personalDialog
  .querySelector(".wish-close")
  .addEventListener("click", () => personalDialog.close());

personalDialog.addEventListener("click", (event) => {
  const rect = personalDialog.getBoundingClientRect();

  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) personalDialog.close();
});

// Lắng nghe khi nhấn vào bất kỳ thẻ thành viên nào.
document.getElementById("membersGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".member-card");
  if (!card) return;

  const name = card.querySelector(".member-name")?.textContent.trim();

  const message = personalWishes[name];
  if (!message) return;

  document.getElementById("tin4WishName").textContent = `Gửi ${name}`;

  document.getElementById("tin4WishMessage").textContent = message;

  if (!personalDialog.open) {
    personalDialog.showModal();
  }
});

/* =========================================
   TIN4 PHOTO BOOTH — CAMERA & PNG EXPORT
   ========================================= */

(() => {
  const get = (id) => document.getElementById(id);

  const video = get("pbVideo");
  const canvas = get("pbCanvas");
  const ctx = canvas.getContext("2d");

  const countdown = get("pbCountdown");
  const status = get("pbStatus");
  const placeholder = get("pbPlaceholder");

  const startBtn = get("pbStart");
  const switchBtn = get("pbSwitch");
  const captureBtn = get("pbCapture");
  const retakeBtn = get("pbRetake");
  const saveBtn = get("pbSave");
  const stopBtn = get("pbStop");
  const themeSelect = get("pbTheme");

  let stream = null;
  let front = true;
  let shots = [];
  let shooting = false;
  let opening = false;
  let ticket = 0;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Cập nhật trạng thái các nút
  function updateButtons() {
    startBtn.disabled = opening || shooting || !!stream;
    switchBtn.disabled = opening || shooting || !stream;
    captureBtn.disabled = opening || shooting || !stream;
    retakeBtn.disabled = shooting || shots.length !== 4;
    saveBtn.disabled = shooting || shots.length !== 4;
    stopBtn.disabled = !opening && !stream;
  }

  // Dừng và giải phóng camera
  function stopCamera(message = "Đã tắt camera. Ảnh đã chụp vẫn được giữ.") {
    ticket++;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    stream = null;
    video.pause();
    video.srcObject = null;

    countdown.hidden = true;
    placeholder.hidden = false;

    shooting = false;
    opening = false;

    status.textContent = message;
    updateButtons();
  }

  // Mở camera sau khi người dùng nhấn nút
  async function startCamera() {
    if (opening || shooting) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent =
        "Không thể mở camera. Hãy dùng HTTPS hoặc localhost.";
      return;
    }

    const id = ++ticket;
    opening = true;

    status.textContent = "Đang yêu cầu quyền camera...";
    updateButtons();

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    stream = null;
    video.srcObject = null;

    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: front ? "user" : "environment",
          },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Người dùng đã hủy trước khi camera mở xong
      if (id !== ticket) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }

      stream = next;
      video.srcObject = next;
      video.classList.toggle("pb-mirror", front);

      await video.play();

      if (id !== ticket) return;

      placeholder.hidden = true;
      status.textContent = "Camera đã sẵn sàng. Nhấn Chụp 4 ảnh để bắt đầu.";
    } catch (error) {
      if (id !== ticket) return;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      stream = null;
      video.srcObject = null;
      placeholder.hidden = false;

      const messages = {
        NotAllowedError: "Bạn chưa cấp quyền camera trong trình duyệt.",
        NotFoundError: "Không tìm thấy camera trên thiết bị.",
        NotReadableError: "Camera có thể đang được ứng dụng khác sử dụng.",
      };

      status.textContent =
        messages[error.name] || "Không thể bật camera. Vui lòng thử lại.";

      console.error("TIN4 Photo Booth:", error);
    } finally {
      if (id === ticket) {
        opening = false;
        updateButtons();
      }
    }
  }

  // Lấy một khung hình từ video camera
  function captureFrame() {
    if (!video.videoWidth || !video.videoHeight) {
      throw Error("Camera chưa có hình ảnh");
    }

    const shot = document.createElement("canvas");
    shot.width = 624;
    shot.height = 340;

    const sc = shot.getContext("2d");

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const sourceRatio = vw / vh;
    const targetRatio = shot.width / shot.height;

    let sw = vw;
    let sh = vh;
    let sx = 0;
    let sy = 0;

    // Cắt khung hình theo tỉ lệ của dải ảnh
    if (sourceRatio > targetRatio) {
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    // Lật ảnh camera trước giống như xem gương
    if (front) {
      sc.translate(shot.width, 0);
      sc.scale(-1, 1);
    }

    sc.drawImage(video, sx, sy, sw, sh, 0, 0, shot.width, shot.height);

    return shot;
  }

  // Vẽ dải ảnh 4 tấm theo màu khung
  function renderStrip() {
    const themes = {
      rose: ["#fff5f9", "#edbcd0", "#96516f"],
      lavender: ["#faf4ff", "#d4b9ea", "#78538f"],
      cream: ["#fff9ec", "#f2ddb3", "#8f6749"],
    };

    const [light, dark, ink] = themes[themeSelect.value] || themes.rose;

    const bg = ctx.createLinearGradient(0, 0, 720, 1740);

    bg.addColorStop(0, light);
    bg.addColorStop(1, dark);

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 720, 1740);

    // Viền ngoài
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 8;
    ctx.strokeRect(22, 22, 676, 1696);

    ctx.textAlign = "center";
    ctx.fillStyle = ink;

    // Tiêu đề của dải ảnh
    ctx.font = "bold 31px Arial";
    ctx.fillText("TIN4 PHOTO BOOTH", 360, 69);

    ctx.font = "italic 24px Georgia";
    ctx.fillText("Happy Women’s Day — 20/10", 360, 108);

    // Vẽ bốn vị trí ảnh
    for (let i = 0; i < 4; i++) {
      const x = 48;
      const y = 142 + i * 357;
      const w = 624;
      const h = 340;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 5, y - 5, w + 10, h + 10);

      if (shots[i]) {
        ctx.drawImage(shots[i], x, y, w, h);
      } else {
        ctx.fillStyle = i % 2 ? "#ead9ed" : "#f8dce8";

        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = ink;
        ctx.font = "italic 28px Georgia";
        ctx.fillText(`KHOẢNH KHẮC 0${i + 1} ✿`, 360, y + 182);
      }
    }

    // Phần chữ dưới cùng của dải ảnh
    ctx.fillStyle = ink;
    ctx.font = "bold 27px Arial";
    ctx.fillText("LỚP TIN 4 — FOREVER MEMORIES", 360, 1645);

    ctx.font = "italic 23px Georgia";
    ctx.fillText("35 đóa hoa · Một thanh xuân ♡", 360, 1685);
  }

  // Đếm ngược và chụp liên tục bốn ảnh
  async function captureStrip() {
    if (!stream || shooting) return;

    const id = ++ticket;
    shooting = true;
    shots = [];

    renderStrip();
    updateButtons();

    try {
      for (let i = 0; i < 4; i++) {
        // Đếm ngược 3, 2, 1
        for (let n = 3; n > 0; n--) {
          countdown.textContent = String(n);
          countdown.hidden = false;

          status.textContent = `Chuẩn bị ảnh ${i + 1}/4...`;

          await sleep(1000);

          if (id !== ticket) return;
        }

        countdown.hidden = true;

        // Chụp một tấm
        shots.push(captureFrame());
        renderStrip();

        // Hiệu ứng flash
        const screen = get("pbScreen");
        screen.classList.add("pb-flash");

        setTimeout(() => {
          screen.classList.remove("pb-flash");
        }, 220);

        await sleep(450);

        if (id !== ticket) return;
      }

      status.textContent = "Đã chụp đủ 4 ảnh. Chọn khung hoặc nhấn Lưu PNG.";
    } catch (error) {
      console.error("Photo Booth capture:", error);
      status.textContent = "Chụp ảnh không thành công. Vui lòng thử lại.";
    } finally {
      if (id === ticket) {
        countdown.hidden = true;
        shooting = false;
        updateButtons();
      }
    }
  }

  // Các sự kiện nút
  startBtn.addEventListener("click", startCamera);

  switchBtn.addEventListener("click", () => {
    front = !front;
    startCamera();
  });

  captureBtn.addEventListener("click", captureStrip);

  retakeBtn.addEventListener("click", () => {
    if (stream) {
      captureStrip();
    } else {
      status.textContent = "Hãy bật camera trước khi chụp lại.";
    }
  });

  stopBtn.addEventListener("click", () => {
    stopCamera();
  });

  // Thay màu khung mà không mất ảnh đã chụp
  themeSelect.addEventListener("change", renderStrip);

  // Tải ảnh Photo Booth dạng PNG
  saveBtn.addEventListener("click", () => {
    if (shots.length !== 4) return;

    canvas.toBlob((blob) => {
      if (!blob) {
        status.textContent = "Không thể tạo PNG. Vui lòng thử lại.";
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "TIN4-PhotoBooth-20-10.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 15000);

      status.textContent = "Đã tạo PNG. Hãy kiểm tra thư mục Tải xuống.";
    }, "image/png");
  });

  // Tự tắt camera khi chuyển khỏi tab
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && (stream || opening)) {
      stopCamera("Camera đã tự tắt khi rời trang.");
    }
  });

  window.addEventListener("pagehide", () => stopCamera());

  // Khởi tạo giao diện
  renderStrip();
  updateButtons();
})();
