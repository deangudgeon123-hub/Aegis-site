// ===== Wallet modal + fake connect =====
const connectBtn = document.getElementById('connectBtn');
const overlay = document.getElementById('overlay');
const closeModal = document.getElementById('closeModal');
const walletButtons = document.querySelectorAll('.wbtn');

// --- Helper: generate short mock wallet ID ---
function shortAddr() {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hex.slice(0, 4)}…${hex.slice(-4)}`;
}

// --- Helper: set connected tag ---
function setConnectedTag(provider) {
  const id = shortAddr();
  connectBtn.classList.add('connected');
  connectBtn.textContent = `${provider} • ${id}`;
  connectBtn.setAttribute('aria-label', `Connected to ${provider}`);
}

// --- Modal controls ---
function openModal() {
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden'; // prevent scroll
}

function closeModalFn() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

// --- Event Listeners ---
connectBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFn);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModalFn();
});

walletButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = btn.dataset.wallet || 'Wallet';
    setConnectedTag(provider);
    closeModalFn();
  });
});

// ===== Simple animated sparklines (mock data) =====
function drawSpark(canvasId, color) {
  const cvs = document.getElementById(canvasId);
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = cvs.clientWidth, height = cvs.clientHeight;
  cvs.width = Math.floor(width * dpr);
  cvs.height = Math.floor(height * dpr);
  ctx.scale(dpr, dpr);

  const points = [];
  const n = 32;
  let y = Math.random() * 0.6 + 0.2;
  for (let i = 0; i < n; i++) {
    y += (Math.random() - 0.5) * 0.12;
    y = Math.max(0.1, Math.min(0.9, y));
    points.push({ x: i / (n - 1), y });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    points.forEach((p, i) => {
      const px = p.x * width;
      const py = height - p.y * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.stroke();

    const glow = ctx.createLinearGradient(0, 0, width, 0);
    glow.addColorStop(0, color);
    glow.addColorStop(1, '#ff5a64');
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    points.forEach((p, i) => {
      const px = p.x * width;
      const py = height - p.y * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = glow;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(render);
  }
  render();
}

window.addEventListener('load', () => {
  ['spark1', 'spark2', 'spark3'].forEach(id => drawSpark(id, '#c7313a'));
});

window.addEventListener('resize', () => {
  ['spark1', 'spark2', 'spark3'].forEach(id => drawSpark(id, '#c7313a'));
});