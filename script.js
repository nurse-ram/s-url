const ADMIN_APP_URL = 'https://script.google.com/a/macros/rumail.ru.ac.th/s/AKfycbwmm9iQvuCjpSIHJPrl2nkMmIpE0yYly_XnXYf9FJnNnVft-VOTyJ6gFieB-n2_ZkD4BA/exec';

const loginBtn = document.getElementById('loginBtn');
const statusText = document.getElementById('statusText');

loginBtn.addEventListener('click', () => {
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="google-mark">G</span> กำลังเปิด Google Apps Script...';
  statusText.classList.remove('error');
  statusText.textContent = 'กำลังพาไปหน้าจัดการ ระบบ Google Apps Script จะตรวจสอบบัญชี Google ให้';
  window.location.href = ADMIN_APP_URL;
});
