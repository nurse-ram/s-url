import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const firebaseConfig = {
  projectId: 'surl-nurseru',
  appId: '1:702965627687:web:4d019cdc0bda86c9b00702',
  storageBucket: 'surl-nurseru.firebasestorage.app',
  apiKey: 'AIzaSyDdsrk_M_VBtkXUsgTA91CEowBtL71Z4lM',
  authDomain: 'surl-nurseru.firebaseapp.com',
  messagingSenderId: '702965627687'
};

const ADMIN_APP_URL = 'https://script.google.com/a/macros/rumail.ru.ac.th/s/AKfycbwmm9iQvuCjpSIHJPrl2nkMmIpE0yYly_XnXYf9FJnNnVft-VOTyJ6gFieB-n2_ZkD4BA/exec';
const ALLOWED_DOMAINS = ['gmail.com'];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

const loginBtn = document.getElementById('loginBtn');
const statusText = document.getElementById('statusText');
let redirecting = false;

loginBtn.addEventListener('click', signIn);

getRedirectResult(auth).catch(showError);
onAuthStateChanged(auth, user => {
  if(user) continueIfAllowed(user);
});

async function signIn(){
  setBusy(true, 'กำลังเปิดหน้าต่าง Google...');
  try{
    const result = await signInWithPopup(auth, provider);
    continueIfAllowed(result.user);
  }catch(err){
    if(err && (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user')){
      setBusy(true, 'กำลังพาไปหน้าเข้าสู่ระบบ Google...');
      await signInWithRedirect(auth, provider);
      return;
    }
    showError(err);
  }
}

function continueIfAllowed(user){
  if(redirecting) return;
  const email = String((user && user.email) || '').toLowerCase();
  const domain = email.split('@').pop();
  if(!email || ALLOWED_DOMAINS.indexOf(domain) < 0){
    setBusy(false, 'บัญชีนี้ยังไม่ใช่ Gmail กรุณาเข้าสู่ระบบด้วยบัญชี @gmail.com');
    statusText.classList.add('error');
    auth.signOut();
    return;
  }
  redirecting = true;
  setBusy(true, 'ตรวจสอบสำเร็จ กำลังเปิดหน้าจัดการลิงก์...');
  window.location.href = ADMIN_APP_URL;
}

function setBusy(flag, message){
  loginBtn.disabled = !!flag;
  loginBtn.innerHTML = flag
    ? '<span class="google-mark">G</span> กำลังเข้าสู่ระบบ...'
    : '<span class="google-mark">G</span> เข้าสู่ระบบด้วย Google';
  statusText.classList.remove('error');
  statusText.textContent = message || 'ระบบจะตรวจสอบบัญชี Gmail ก่อนพาเข้าสู่หน้าจัดการลิงก์';
}

function showError(err){
  const message = err && err.message ? err.message : String(err || 'เข้าสู่ระบบไม่สำเร็จ');
  setBusy(false, message);
  statusText.classList.add('error');
}
