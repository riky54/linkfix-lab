const cases = {
  overlay: { number: '01', title: 'Lapisan transparan menutupi tombol', description: 'Sebuah elemen transparan berada di atas tombol, sehingga klik tidak pernah sampai ke tautan.', cause: 'Overlay transparan mempunyai z-index lebih tinggi dari tombol.', fix: 'Atur urutan lapisan atau hapus overlay yang tidak diperlukan agar tombol menerima klik.' },
  pointer: { number: '02', title: 'Klik dinonaktifkan oleh CSS', description: 'Tombol terlihat normal, tetapi aturan pointer-events: none membuatnya tidak bisa diklik.', cause: 'CSS menonaktifkan interaksi pointer pada elemen tautan.', fix: 'Hapus aturan pointer-events: none pada tautan yang harus aktif.' },
  script: { number: '03', title: 'JavaScript membatalkan navigasi', description: 'Event handler memanggil preventDefault() tanpa menjalankan aksi pengganti.', cause: 'Kode JavaScript membatalkan perilaku normal tautan.', fix: 'Batalkan navigasi hanya saat diperlukan, lalu jalankan aksi yang benar; jika tidak, biarkan tautan bekerja.' }
};

let activeCase = 'overlay';
let activeState = 'broken';
const tabs = [...document.querySelectorAll('.case-tab')];
const stateButtons = [...document.querySelectorAll('.state-button')];
const preview = document.getElementById('preview');
const link = document.getElementById('demo-link');
const result = document.getElementById('result-box');
const resultText = document.getElementById('result-text');
const target = document.getElementById('tujuan-demo');

function setResult(message, type = '') {
  resultText.textContent = message;
  result.className = `result-box ${type}`.trim();
}
function render() {
  const item = cases[activeCase];
  document.getElementById('case-counter').textContent = `KASUS ${item.number} / 03`;
  document.getElementById('case-title').textContent = item.title;
  document.getElementById('case-description').textContent = item.description;
  document.getElementById('cause-text').textContent = item.cause;
  document.getElementById('fix-text').textContent = item.fix;
  document.getElementById('panel-demo').setAttribute('aria-labelledby', `tab-${activeCase}`);
  preview.dataset.case = activeCase;
  preview.classList.toggle('is-broken', activeState === 'broken');
  tabs.forEach(tab => { const selected = tab.dataset.case === activeCase; tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  stateButtons.forEach(button => { const selected = button.dataset.state === activeState; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
  target.classList.remove('show');
  setResult('Coba klik tombol “Lihat detail” pada contoh di atas.');
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { activeCase = tab.dataset.case; activeState = 'broken'; render(); });
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const next = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus(); tabs[next].click();
  });
});
stateButtons.forEach(button => button.addEventListener('click', () => { activeState = button.dataset.state; render(); }));
document.getElementById('blocking-layer').addEventListener('click', () => setResult('Klik tertahan oleh lapisan transparan di atas tombol.', 'error'));
document.getElementById('preview-action').addEventListener('click', event => {
  if (activeState === 'broken' && activeCase === 'pointer' && event.target.id === 'preview-action') setResult('Klik tidak diterima karena pointer-events: none.', 'error');
});
link.addEventListener('click', event => {
  if (activeState === 'broken' && activeCase === 'script') { event.preventDefault(); setResult('Navigasi dibatalkan oleh preventDefault() tanpa aksi lanjutan.', 'error'); return; }
  if (activeState === 'fixed') { event.preventDefault(); target.classList.add('show'); setResult('Berhasil! Tautan sekarang membawa pengguna ke bagian detail.', 'success'); target.focus({ preventScroll: true }); }
});
render();
