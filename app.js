// Translate App - client-only demo
const $ = id => document.getElementById(id);

const installButtons = [$('install-app-btn'), $('install-app-btn-main')];
const installStatuses = [$('install-status'), $('install-status-main')];
let deferredInstallPrompt;

function setInstallStatus(message) {
	for (const status of installStatuses) {
		status.textContent = message;
		status.hidden = false;
	}
}

window.addEventListener('beforeinstallprompt', event => {
	event.preventDefault();
	deferredInstallPrompt = event;
});

async function installApp() {
	if (!deferredInstallPrompt) {
		setInstallStatus('In Chrome or Edge, open the browser menu and choose "Install Translate App".');
		return;
	}

	deferredInstallPrompt.prompt();
	const { outcome } = await deferredInstallPrompt.userChoice;
	setInstallStatus(outcome === 'accepted' ? 'Translate App installed.' : 'Installation canceled.');
	deferredInstallPrompt = null;
}

for (const button of installButtons) {
	button.addEventListener('click', installApp);
}

window.addEventListener('appinstalled', () => {
	for (const button of installButtons) button.hidden = true;
	setInstallStatus('Translate App installed.');
});

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
	for (const button of installButtons) button.hidden = true;
}

// Load optional runtime config (config.json). If not present, use defaults.
let CONFIG = { translateEndpoint: 'https://api.mymemory.translated.net/get' };
let firebaseAvailable = false;

async function loadConfig(){
	try{
		const res = await fetch('./config.json');
		if(!res.ok) return; const cfg = await res.json(); CONFIG = {...CONFIG, ...cfg};
		if(cfg.firebase) await initFirebase(cfg.firebase);
	}catch(e){console.log('No config.json found, using defaults')}
}

function loadScript(src){
	return new Promise((resolve,reject)=>{
		const s=document.createElement('script'); s.src=src; s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
	});
}

async function initFirebase(firebaseConfig){
	try{
		// load firebase app + auth
		await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
		await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
		firebase.initializeApp(firebaseConfig);
		firebaseAvailable = true;
		console.log('Firebase initialized');
	}catch(e){console.error('Failed to load Firebase SDK',e)}
}

// Immediately try to load config (non-blocking for UI)
loadConfig();

// --- App Language Selector (shared logic) ---
const supportedLangs = [
		{ code: 'en', label: 'English' },
		{ code: 'es', label: 'Español' },
		{ code: 'fr', label: 'Français' },
		{ code: 'de', label: 'Deutsch' },
		{ code: 'ar', label: 'العربية' },
		{ code: 'zh', label: '中文' },
		{ code: 'ru', label: 'Русский' },
		{ code: 'hi', label: 'हिन्दी' },
		{ code: 'pt', label: 'Português' },
		{ code: 'it', label: 'Italiano' },
		{ code: 'ja', label: '日本語' },
		{ code: 'tr', label: 'Türkçe' }
];

const translations = {
	en: {
		appName: 'DocTranslation',
		signUp: 'Sign Up',
		logIn: 'Log In',
		logOut: 'Log out',
		appLang: 'App Language:',
		authMsg: 'Sign up or log in to continue',
		emailPhone: 'Email or phone',
		password: 'Password',
		captureOrUpload: 'Capture or Upload Photo',
		takePhoto: 'Take Photo',
		closeCamera: 'Close Camera',
		capture: 'Capture',
		translate: 'Translate',
		targetLang: 'Target language',
		extractTranslate: 'Extract & Translate',
		saveDoc: 'Save Document',
		tts: 'Read Aloud',
		translatedPlaceholder: 'Translated text will appear here',
		savedDocs: 'Saved Documents',
		welcome: 'Welcome',
	},
	es: {
		appName: 'DocTranslation',
		signUp: 'Registrarse',
		logIn: 'Iniciar sesión',
		logOut: 'Cerrar sesión',
		appLang: 'Idioma de la app:',
		authMsg: 'Regístrate o inicia sesión para continuar',
		emailPhone: 'Correo o teléfono',
		password: 'Contraseña',
		captureOrUpload: 'Capturar o Subir Foto',
		takePhoto: 'Tomar Foto',
		closeCamera: 'Cerrar Cámara',
		capture: 'Capturar',
		translate: 'Traducir',
		targetLang: 'Idioma de destino',
		extractTranslate: 'Extraer y Traducir',
		saveDoc: 'Guardar Documento',
		tts: 'Leer en voz alta',
		translatedPlaceholder: 'El texto traducido aparecerá aquí',
		savedDocs: 'Documentos Guardados',
		welcome: 'Bienvenido',
	},
	fr: {
		appName: 'DocTranslation',
		signUp: 'S’inscrire',
		logIn: 'Connexion',
		logOut: 'Déconnexion',
		appLang: 'Langue de l’application :',
		authMsg: 'Inscrivez-vous ou connectez-vous pour continuer',
		emailPhone: 'E-mail ou téléphone',
		password: 'Mot de passe',
		captureOrUpload: 'Capturer ou Télécharger une Photo',
		takePhoto: 'Prendre une photo',
		closeCamera: 'Fermer la caméra',
		capture: 'Capturer',
		translate: 'Traduire',
		targetLang: 'Langue cible',
		extractTranslate: 'Extraire et Traduire',
		saveDoc: 'Enregistrer le document',
		tts: 'Lire à haute voix',
		translatedPlaceholder: 'Le texte traduit apparaîtra ici',
		savedDocs: 'Documents Enregistrés',
		welcome: 'Bienvenue',
	},
	de: {
		appName: 'DocTranslation',
		signUp: 'Registrieren',
		logIn: 'Anmelden',
		logOut: 'Abmelden',
		appLang: 'App-Sprache:',
		authMsg: 'Registrieren oder anmelden, um fortzufahren',
		emailPhone: 'E-Mail oder Telefon',
		password: 'Passwort',
		captureOrUpload: 'Foto aufnehmen oder hochladen',
		takePhoto: 'Foto aufnehmen',
		closeCamera: 'Kamera schließen',
		capture: 'Aufnehmen',
		translate: 'Übersetzen',
		targetLang: 'Zielsprache',
		extractTranslate: 'Extrahieren & Übersetzen',
		saveDoc: 'Dokument speichern',
		tts: 'Vorlesen',
		translatedPlaceholder: 'Übersetzter Text erscheint hier',
		savedDocs: 'Gespeicherte Dokumente',
		welcome: 'Willkommen',
	},
	ar: {
		appName: 'DocTranslation',
		signUp: 'تسجيل',
		logIn: 'تسجيل الدخول',
		logOut: 'تسجيل الخروج',
		appLang: 'لغة التطبيق:',
		authMsg: 'سجّل أو قم بتسجيل الدخول للمتابعة',
		emailPhone: 'البريد الإلكتروني أو الهاتف',
		password: 'كلمة المرور',
		captureOrUpload: 'التقاط أو تحميل صورة',
		takePhoto: 'التقاط صورة',
		closeCamera: 'إغلاق الكاميرا',
		capture: 'التقاط',
		translate: 'ترجمة',
		targetLang: 'اللغة المستهدفة',
		extractTranslate: 'استخراج وترجمة',
		saveDoc: 'حفظ المستند',
		tts: 'قراءة بصوت عالٍ',
		translatedPlaceholder: 'سيظهر النص المترجم هنا',
		savedDocs: 'المستندات المحفوظة',
		welcome: 'مرحبًا',
	},
	zh: {
		appName: 'DocTranslation',
		signUp: '注册',
		logIn: '登录',
		logOut: '登出',
		appLang: '应用语言：',
		authMsg: '注册或登录以继续',
		emailPhone: '邮箱或电话',
		password: '密码',
		captureOrUpload: '拍照或上传照片',
		takePhoto: '拍照',
		closeCamera: '关闭相机',
		capture: '捕获',
		translate: '翻译',
		targetLang: '目标语言',
		extractTranslate: '提取并翻译',
		saveDoc: '保存文档',
		tts: '朗读',
		translatedPlaceholder: '翻译文本将显示在这里',
		savedDocs: '已保存的文档',
		welcome: '欢迎',
	},
	ru: {
		appName: 'DocTranslation',
		signUp: 'Регистрация',
		logIn: 'Войти',
		logOut: 'Выйти',
		appLang: 'Язык приложения:',
		authMsg: 'Зарегистрируйтесь или войдите, чтобы продолжить',
		emailPhone: 'Эл. почта или телефон',
		password: 'Пароль',
		captureOrUpload: 'Сделать или загрузить фото',
		takePhoto: 'Сделать фото',
		closeCamera: 'Закрыть камеру',
		capture: 'Сделать снимок',
		translate: 'Перевести',
		targetLang: 'Язык перевода',
		extractTranslate: 'Извлечь и перевести',
		saveDoc: 'Сохранить документ',
		tts: 'Озвучить',
		translatedPlaceholder: 'Здесь появится переведённый текст',
		savedDocs: 'Сохранённые документы',
		welcome: 'Добро пожаловать',
	},
	hi: {
		appName: 'DocTranslation',
		signUp: 'साइन अप करें',
		logIn: 'लॉग इन करें',
		logOut: 'लॉग आउट',
		appLang: 'ऐप भाषा:',
		authMsg: 'जारी रखने के लिए साइन अप या लॉग इन करें',
		emailPhone: 'ईमेल या फोन',
		password: 'पासवर्ड',
		captureOrUpload: 'फोटो कैप्चर या अपलोड करें',
		takePhoto: 'फोटो लें',
		closeCamera: 'कैमरा बंद करें',
		capture: 'कैप्चर',
		translate: 'अनुवाद करें',
		targetLang: 'लक्ष्य भाषा',
		extractTranslate: 'निकालें और अनुवाद करें',
		saveDoc: 'दस्तावेज़ सहेजें',
		tts: 'पढ़ें',
		translatedPlaceholder: 'अनुवादित पाठ यहाँ दिखाई देगा',
		savedDocs: 'सहेजे गए दस्तावेज़',
		welcome: 'स्वागत है',
	},
	pt: {
		appName: 'DocTranslation',
		signUp: 'Cadastrar',
		logIn: 'Entrar',
		logOut: 'Sair',
		appLang: 'Idioma do app:',
		authMsg: 'Cadastre-se ou faça login para continuar',
		emailPhone: 'E-mail ou telefone',
		password: 'Senha',
		captureOrUpload: 'Capturar ou Enviar Foto',
		takePhoto: 'Tirar Foto',
		closeCamera: 'Fechar Câmera',
		capture: 'Capturar',
		translate: 'Traduzir',
		targetLang: 'Idioma alvo',
		extractTranslate: 'Extrair e Traduzir',
		saveDoc: 'Salvar Documento',
		tts: 'Ler em voz alta',
		translatedPlaceholder: 'O texto traduzido aparecerá aqui',
		savedDocs: 'Documentos Salvos',
		welcome: 'Bem-vindo',
	},
	it: {
		appName: 'DocTranslation',
		signUp: 'Registrati',
		logIn: 'Accedi',
		logOut: 'Disconnetti',
		appLang: 'Lingua dell’app:',
		authMsg: 'Registrati o accedi per continuare',
		emailPhone: 'Email o telefono',
		password: 'Password',
		captureOrUpload: 'Cattura o Carica Foto',
		takePhoto: 'Scatta Foto',
		closeCamera: 'Chiudi Fotocamera',
		capture: 'Cattura',
		translate: 'Traduci',
		targetLang: 'Lingua di destinazione',
		extractTranslate: 'Estrai e Traduci',
		saveDoc: 'Salva Documento',
		tts: 'Leggi ad alta voce',
		translatedPlaceholder: 'Il testo tradotto apparirà qui',
		savedDocs: 'Documenti Salvati',
		welcome: 'Benvenuto',
	},
	ja: {
		appName: 'DocTranslation',
		signUp: 'サインアップ',
		logIn: 'ログイン',
		logOut: 'ログアウト',
		appLang: 'アプリの言語：',
		authMsg: '続行するにはサインアップまたはログインしてください',
		emailPhone: 'メールまたは電話',
		password: 'パスワード',
		captureOrUpload: '写真を撮るまたはアップロード',
		takePhoto: '写真を撮る',
		closeCamera: 'カメラを閉じる',
		capture: 'キャプチャ',
		translate: '翻訳',
		targetLang: 'ターゲット言語',
		extractTranslate: '抽出して翻訳',
		saveDoc: 'ドキュメントを保存',
		tts: '音読',
		translatedPlaceholder: '翻訳されたテキストがここに表示されます',
		savedDocs: '保存されたドキュメント',
		welcome: 'ようこそ',
	},
	tr: {
		appName: 'DocTranslation',
		signUp: 'Kayıt Ol',
		logIn: 'Giriş Yap',
		logOut: 'Çıkış Yap',
		appLang: 'Uygulama Dili:',
		authMsg: 'Devam etmek için kayıt olun veya giriş yapın',
		emailPhone: 'E-posta veya telefon',
		password: 'Şifre',
		captureOrUpload: 'Fotoğraf Çek veya Yükle',
		takePhoto: 'Fotoğraf Çek',
		closeCamera: 'Kamerayı Kapat',
		capture: 'Çek',
		translate: 'Çevir',
		targetLang: 'Hedef dil',
		extractTranslate: 'Çıkar ve Çevir',
		saveDoc: 'Belgeyi Kaydet',
		tts: 'Sesli Oku',
		translatedPlaceholder: 'Çevrilen metin burada görünecek',
		savedDocs: 'Kaydedilen Belgeler',
		welcome: 'Hoş geldiniz',
	},
};
let appLang = localStorage.getItem('appLang') || 'en';

function setAppLang(lang) {
	appLang = lang;
	localStorage.setItem('appLang', lang);
	updateAppLangUI();
}

function updateAppLangUI() {
	// Update both selectors
	const selAuth = $('app-lang-select-auth');
	const selMain = $('app-lang-select-main');
	if (selAuth) selAuth.value = appLang;
	if (selMain) selMain.value = appLang;

	// Get translation set
	const t = translations[appLang] || translations['en'];

	// Update static UI text
	document.title = t.appName;
	// Auth screen
	const appNameH1 = document.querySelector('#auth-screen h1');
	if (appNameH1) appNameH1.textContent = t.appName;
	const authMsg = document.getElementById('auth-message');
	if (authMsg) authMsg.textContent = t.authMsg;
	const signupBtn = document.getElementById('signup-btn');
	if (signupBtn) signupBtn.textContent = t.signUp;
	const loginBtn = document.getElementById('login-btn');
	if (loginBtn) loginBtn.textContent = t.logIn;
	const appLangLabels = document.querySelectorAll('label[for^="app-lang-select"]');
	appLangLabels.forEach(lab => lab.innerHTML = `<b>${t.appLang}</b>`);
	const authIdentifier = document.getElementById('auth-identifier');
	if (authIdentifier) authIdentifier.placeholder = t.emailPhone;
	const authPassword = document.getElementById('auth-password');
	if (authPassword) authPassword.placeholder = t.password;
	// Main screen
	const welcomeBanner = document.getElementById('welcome-banner');
	if (welcomeBanner) welcomeBanner.childNodes[0].textContent = t.welcome + ' ';
	const logoutBtn = document.getElementById('logout-btn');
	if (logoutBtn) logoutBtn.textContent = t.logOut;
	// Capture/Upload
	const captureCard = document.querySelector('#main-screen .card h2');
	if (captureCard) captureCard.textContent = t.captureOrUpload;
	const takePhotoBtn = document.getElementById('start-camera');
	if (takePhotoBtn) takePhotoBtn.textContent = t.takePhoto;
	const closeCameraBtn = document.getElementById('stop-camera');
	if (closeCameraBtn) closeCameraBtn.textContent = t.closeCamera;
	const captureBtn = document.getElementById('capture-btn');
	if (captureBtn) captureBtn.textContent = t.capture;
	// Translate
	const translateCard = document.querySelectorAll('#main-screen .card h2')[1];
	if (translateCard) translateCard.textContent = t.translate;
	const targetLangLabel = document.querySelector('label[for="lang-select"], label[for=lang-select]');
	if (targetLangLabel) targetLangLabel.childNodes[0].textContent = t.targetLang + ' ';
	const extractBtn = document.getElementById('extract-translate');
	if (extractBtn) extractBtn.textContent = t.extractTranslate;
	const saveDocBtn = document.getElementById('save-doc');
	if (saveDocBtn) saveDocBtn.textContent = t.saveDoc;
	const ttsBtn = document.getElementById('tts-btn');
	if (ttsBtn) ttsBtn.textContent = t.tts;
	const translatedText = document.getElementById('translated-text');
	if (translatedText) translatedText.placeholder = t.translatedPlaceholder;
	// Saved docs
	const savedDocsHeader = document.querySelectorAll('#main-screen .card h3')[0];
	if (savedDocsHeader) savedDocsHeader.textContent = t.savedDocs;
}

window.addEventListener('DOMContentLoaded', () => {
	// Populate selectors (in case HTML changes)
	const selAuth = $('app-lang-select-auth');
	const selMain = $('app-lang-select-main');
	[selAuth, selMain].forEach(sel => {
		if (sel) {
			sel.innerHTML = '';
			supportedLangs.forEach(l => {
				const o = document.createElement('option');
				o.value = l.code; o.textContent = l.label; sel.appendChild(o);
			});
			sel.value = appLang;
			sel.addEventListener('change', e => setAppLang(e.target.value));
		}
	});
	updateAppLangUI();
});

// --- Auth (demo, localStorage) ---
const authScreen = $('auth-screen');
const mainScreen = $('main-screen');
const userLabel = $('user-label');
const signupBtn = $('signup-btn');
const loginBtn = $('login-btn');
const logoutBtn = $('logout-btn');

function usersKey(){return 'translateapp_users'}
function currentKey(){return 'translateapp_current'}

function loadUsers(){return JSON.parse(localStorage.getItem(usersKey())||'{}')}
function saveUsers(u){localStorage.setItem(usersKey(),JSON.stringify(u))}

function showAuth(){authScreen.classList.remove('hidden');mainScreen.classList.add('hidden')}
function showMain() {
	authScreen.classList.add('hidden');
	mainScreen.classList.remove('hidden');
}

function updateUI() {
	const cur = localStorage.getItem(currentKey());
	if (cur) {
		userLabel.textContent = cur;
		showMain();
		loadDocsList();
	} else {
		showAuth();
	}
}
signupBtn.addEventListener('click',async()=>{
	const id = $('auth-identifier').value.trim(); const pw = $('auth-password').value;
	const errorDiv = document.getElementById('auth-error');
	errorDiv.textContent = '';
	if(!id||!pw) { errorDiv.textContent = 'Provide identifier and password'; return; }
	if(firebaseAvailable){
		try{
			if(id.startsWith('+')){
				window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{size:'invisible'});
				const confirmationResult = await firebase.auth().signInWithPhoneNumber(id, window.recaptchaVerifier);
				const code = prompt('Enter verification code sent to ' + id);
				const result = await confirmationResult.confirm(code);
				localStorage.setItem(currentKey(), result.user.phoneNumber || result.user.email || 'user'); updateUI();
			} else {
				await firebase.auth().createUserWithEmailAndPassword(id,pw);
				localStorage.setItem(currentKey(), id); updateUI();
			}
		}catch(e){ errorDiv.textContent = 'Auth error: ' + (e.message || e); }
	} else {
		const users = loadUsers(); if(users[id]) { errorDiv.textContent = 'User exists, please log in'; return; }
		users[id] = {password:pw,created:Date.now()}; saveUsers(users); localStorage.setItem(currentKey(),id); updateUI();
	}
});

loginBtn.addEventListener('click',async()=>{
	const id = $('auth-identifier').value.trim(); const pw = $('auth-password').value;
	const errorDiv = document.getElementById('auth-error');
	errorDiv.textContent = '';
	if(firebaseAvailable){
		try{
			if(id.startsWith('+')){
				window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{size:'invisible'});
				const confirmationResult = await firebase.auth().signInWithPhoneNumber(id, window.recaptchaVerifier);
				const code = prompt('Enter verification code sent to ' + id);
				const result = await confirmationResult.confirm(code);
				localStorage.setItem(currentKey(), result.user.phoneNumber || result.user.email || 'user'); updateUI();
			} else {
				await firebase.auth().signInWithEmailAndPassword(id,pw);
				localStorage.setItem(currentKey(), id); updateUI();
			}
		}catch(e){ errorDiv.textContent = 'Auth error: ' + (e.message || e); }
	} else {
		const users = loadUsers(); if(!users[id]||users[id].password !== pw) { errorDiv.textContent = 'Invalid credentials'; return; }
		localStorage.setItem(currentKey(),id); updateUI();
	}
});
const forgotBtn = document.getElementById('forgot-btn');
if (forgotBtn) forgotBtn.addEventListener('click', async () => {
	const errorDiv = document.getElementById('auth-error');
	errorDiv.textContent = '';
	const id = $('auth-identifier').value.trim();
	if (!id) { errorDiv.textContent = 'Enter your email or phone first.'; return; }
	if (!firebaseAvailable) {
		errorDiv.textContent = 'Password reset requires Firebase setup.';
		return;
	}
	if (id.startsWith('+')) {
		// Phone reset: instruct user to use app or contact support (Firebase phone reset is not direct)
		errorDiv.textContent = 'Password reset for phone sign-in is not supported here. Please use your phone provider or contact support.';
		return;
	}
	// Email reset
	try {
		await firebase.auth().sendPasswordResetEmail(id);
		errorDiv.style.color = 'green';
		errorDiv.textContent = 'Password reset email sent! Check your inbox.';
		setTimeout(()=>{ errorDiv.textContent = ''; errorDiv.style.color = 'red'; }, 8000);
	} catch (e) {
		errorDiv.textContent = 'Reset failed: ' + (e.message || e);
	}
});

logoutBtn.addEventListener('click',async()=>{if(firebaseAvailable){try{await firebase.auth().signOut();}catch(e){} } localStorage.removeItem(currentKey()); updateUI();});

// --- Camera / Upload ---
const startCameraBtn = $('start-camera');
const fileInput = $('file-input');
const cameraArea = $('camera-area');
const video = $('video');
const captureBtn = $('capture-btn');
const stopCameraBtn = $('stop-camera');
const previewCanvas = $('preview');
const previewImg = $('preview-img');

let stream=null; let latestBlob=null;

async function startCamera(){
	try{stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false}); video.srcObject = stream; cameraArea.classList.remove('hidden');}
	catch(e){alert('Camera not available: '+e.message)}
}

function stopCamera(){ if(stream){stream.getTracks().forEach(t=>t.stop()); stream=null;} cameraArea.classList.add('hidden'); }

captureBtn.addEventListener('click',()=>{
	const w = video.videoWidth, h = video.videoHeight;
	if(w === 0 || h === 0){ alert('Video not ready, try again'); return; }
	previewCanvas.width=w; previewCanvas.height=h;
	const ctx = previewCanvas.getContext('2d');
	ctx.drawImage(video,0,0,w,h);
	previewCanvas.toBlob(b=>{
		if(b){
			latestBlob=b;
			console.log('Captured blob size:', b.size);
			previewImg.src = URL.createObjectURL(b);
			previewImg.classList.remove('hidden');
			previewCanvas.classList.add('hidden');
		} else {
			alert('Failed to capture image');
		}
	}, 'image/png');
	stopCamera();
});

startCameraBtn.addEventListener('click',startCamera);
stopCameraBtn.addEventListener('click',stopCamera);

fileInput.addEventListener('change',e=>{
	const f = e.target.files[0]; if(!f) return; 
	if(!f.type.startsWith('image/')){ alert('Please select an image file'); return; }
	latestBlob = f; console.log('Uploaded file size:', f.size); previewImg.src = URL.createObjectURL(f); previewImg.classList.remove('hidden');
});

// --- Languages list ---
const langSelect = $('lang-select');
const languages = [
	{code:'en',name:'English'},{code:'es',name:'Spanish'},{code:'fr',name:'French'},{code:'de',name:'German'},{code:'ar',name:'Arabic'},{code:'zh',name:'Chinese'},{code:'hi',name:'Hindi'},{code:'ru',name:'Russian'},
	{code:'it',name:'Italian'},{code:'pt',name:'Portuguese'},{code:'ja',name:'Japanese'},{code:'ko',name:'Korean'},{code:'nl',name:'Dutch'},{code:'sv',name:'Swedish'},{code:'da',name:'Danish'},{code:'no',name:'Norwegian'},{code:'fi',name:'Finnish'},{code:'pl',name:'Polish'},{code:'tr',name:'Turkish'},{code:'he',name:'Hebrew'},{code:'th',name:'Thai'},{code:'vi',name:'Vietnamese'}
];
languages.forEach(l=>{const o=document.createElement('option');o.value=l.code;o.textContent=l.name;langSelect.appendChild(o)});

// --- OCR + Translation ---
const extractBtn = $('extract-translate');
const translatedText = $('translated-text');
const docType = $('doc-type');

async function extractTextFromBlob(blob){
	console.log('Blob size:', blob.size, 'type:', blob.type);
	if(!blob || blob.size === 0 || !blob.type || !blob.type.startsWith('image/')) throw new Error('Invalid or empty image blob');
	const { Tesseract } = window;
	if (!Tesseract) throw new Error('Tesseract not loaded');
	try {
		console.log('Initializing Tesseract...');
		let text;
		// Try v4 API
		try {
			const worker = Tesseract.createWorker({ logger: m => console.log(m) });
			if (typeof worker.load === 'function') {
				await worker.load();
				await worker.loadLanguage('eng');
				await worker.initialize('eng');
				console.log('Recognizing...');
				const result = await worker.recognize(blob);
				text = result.data.text;
				await worker.terminate();
			} else {
				// Fallback to v2/v3 API
				const result = await Tesseract.recognize(blob, 'eng');
				text = result.data ? result.data.text : result.text;
			}
		} catch (err) {
			// Fallback to v2/v3 API if v4 fails
			const result = await Tesseract.recognize(blob, 'eng');
			text = result.data ? result.data.text : result.text;
		}
		return text;
	} catch (e) {
		console.error('Tesseract error:', e);
		// Fallback to AI OCR if HF token
		if (CONFIG.huggingfaceToken) {
			console.log('Trying AI OCR with Hugging Face...');
			try {
				const base64 = await blobToBase64(blob);
				console.log('Base64 length:', base64.length);
				const hfRes = await fetch('https://api-inference.huggingface.co/models/microsoft/trocr-base-printed', {
					method: 'POST', headers: { 'Authorization': 'Bearer ' + CONFIG.huggingfaceToken, 'Content-Type': 'application/json' },
					body: JSON.stringify({ inputs: [base64] })
				});
				console.log('HF response status:', hfRes.status);
				if(hfRes.ok){
					const contentType = hfRes.headers.get('content-type');
					let hfData;
					if(contentType && contentType.includes('application/json')){
						hfData = await hfRes.json();
						console.log('HF OCR result:', hfData);
						if(Array.isArray(hfData) && hfData[0] && hfData[0].generated_text) return hfData[0].generated_text;
						if(hfData.generated_text) return hfData.generated_text;
						if(hfData.error) console.error('HF error:', hfData.error);
					} else {
						hfData = await hfRes.text();
						console.log('HF OCR text result:', hfData);
						return hfData.trim();
					}
				} else {
					console.warn('HF OCR failed:', hfRes.status);
					try{
						const errData = await hfRes.json();
						console.warn('HF error data:', errData);
					}catch(e){ console.warn('HF error not JSON'); }
				}
			}catch(hfErr){ console.error('HF OCR error:', hfErr); }
		}
		throw e;
	}
}

async function classifyDocument(text){
	if(!CONFIG.huggingfaceToken) return 'Unknown';
	try{
		console.log('Classifying document type with AI');
		const categories = CONFIG.documentTypes || ["receipt", "invoice", "letter", "contract", "other"];
		const hfRes = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli',{
			method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+CONFIG.huggingfaceToken},
			body: JSON.stringify({inputs: text, parameters: {candidate_labels: categories}})
		});
		if(hfRes.ok){
			const hfData = await hfRes.json();
			console.log('HF classification result:', hfData);
			if(hfData.labels && hfData.labels[0]) return hfData.labels[0];
		} else {
			console.warn('HF classification failed:', hfRes.status);
		}
	}catch(err){ console.warn('HF classification error', err.message) }
	return 'Unknown';
}

async function blobToBase64(blob){
	return new Promise((resolve,reject)=>{
		const reader = new FileReader();
		reader.onload = () => {
			if(!reader.result) reject('Failed to read blob');
			resolve(reader.result.split(',')[1]); // raw base64
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

async function blobToDataUrl(blob){
	return new Promise((resolve,reject)=>{
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

async function translateText(text, target){
	console.log('Translating:', text, 'to', target);
	if(CONFIG.huggingfaceToken){
		// Use AI for translation with Hugging Face M2M100
		try{
			console.log('Using AI translation with Hugging Face M2M100');
			const hfRes = await fetch('https://api-inference.huggingface.co/models/facebook/m2m100_418M',{
				method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+CONFIG.huggingfaceToken},
				body: JSON.stringify({inputs:text,parameters:{target_lang: target}})
			});
			if(hfRes.ok){
				const contentType = hfRes.headers.get('content-type');
				let hfData;
				if(contentType && contentType.includes('application/json')){
					hfData = await hfRes.json();
					console.log('HF translation result:', hfData);
					if(Array.isArray(hfData) && hfData[0] && hfData[0].generated_text) {console.log('HF translation success'); return hfData[0].generated_text;}
					if(hfData.generated_text) {console.log('HF translation success'); return hfData.generated_text;}
					if(hfData.error) console.error('HF translation error:', hfData.error);
				} else {
					hfData = await hfRes.text();
					console.log('HF translation text result:', hfData);
					return hfData.trim();
				}
			} else {
				console.warn('HF translation failed:', hfRes.status);
				try{
					const errData = await hfRes.json();
					console.warn('HF error data:', errData);
				}catch(e){ console.warn('HF error not JSON'); }
			}
		}catch(err){ console.warn('HF translation error', err.message) }
	}
	// Fallback to MyMemory Translate
	try{
		const endpoint = CONFIG.translateEndpoint || 'https://api.mymemory.translated.net/get';
		console.log('Falling back to MyMemory at', endpoint);
		const url = `${endpoint}?q=${encodeURIComponent(text)}&langpair=en|${target}`;
		const res = await fetch(url);
		console.log('MyMemory status:', res.status);
		if(res.ok){ 
			const data = await res.json(); 
			console.log('MyMemory data:', data);
			if(data && data.responseData && data.responseData.translatedText) {console.log('MyMemory success'); return data.responseData.translatedText; } 
		} else {
			console.log('MyMemory error response:', await res.text());
		}
		console.warn('MyMemory failed:', res.status);
	}catch(e){ console.warn('MyMemory error', e.message) }

	return '[Translation failed]';
}

extractBtn.addEventListener('click',async()=>{
	if(!latestBlob) return alert('Take or upload a photo first');
	extractBtn.disabled=true; extractBtn.textContent='Working...';
	docType.textContent = '';
	try{
		console.log('Starting OCR...');
		const extracted = await extractTextFromBlob(latestBlob);
		console.log('Extracted text:', extracted);
		if(!extracted.trim()) return alert('No text found in image');
		// AI document identification
		const type = await classifyDocument(extracted);
		docType.textContent = 'Document type: ' + type;
		// AI translation
		const translated = await translateText(extracted, langSelect.value);
		console.log('Translated text:', translated);
		translatedText.value = translated;
	}catch(e){console.error('Error:', e); alert('Error: '+e.message)}
	finally{extractBtn.disabled=false; extractBtn.textContent='Extract & Translate'}
});

// --- Save document (PDF) ---
const saveBtn = $('save-doc');
const docsList = $('docs-list');

function docsKey(){ return `translateapp_docs_${localStorage.getItem(currentKey())||'anon'}` }

function loadDocsList(){ docsList.innerHTML=''; const docs = JSON.parse(localStorage.getItem(docsKey())||'[]'); docs.forEach((d,i)=>{
	const li = document.createElement('li'); li.textContent = d.name + ' — ' + new Date(d.date).toLocaleString();
  const dl = document.createElement('div'); const open = document.createElement('button'); open.textContent='Open'; open.addEventListener('click',async()=>{
		if(d.url){
      window.open(d.url);
    } else {
      alert('File not available');
    }
  });
  const download = document.createElement('button'); download.textContent='Download'; download.addEventListener('click',()=>{ if(d.url) window.open(d.url); else alert('Download not available'); });
  dl.appendChild(open); dl.appendChild(download); li.appendChild(dl); docsList.appendChild(li);
})}

saveBtn.addEventListener('click',async()=>{
	const text = translatedText.value.trim(); if(!text) return alert('No translated text to save');
	try{
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF(); const lines = doc.splitTextToSize(text, 170);
		doc.text(lines, 10, 10);
		const blob = doc.output('blob');
		if(window.showSaveFilePicker){
			const handle = await window.showSaveFilePicker({suggestedName:'translation.pdf',types:[{description:'PDF',accept:{'application/pdf':['.pdf']}}]});
			const writable = await handle.createWritable(); await writable.write(blob); await writable.close();
			alert('Saved to chosen folder');
		} else {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a'); a.href = url; a.download = 'translation.pdf'; document.body.appendChild(a); a.click(); a.remove();
			// store reference in localStorage (url object) for listing; note these URLs may be revoked on reload
			const docs = JSON.parse(localStorage.getItem(docsKey())||'[]'); const rec = {name:'translation.pdf',date:Date.now(),url:url}; docs.unshift(rec); localStorage.setItem(docsKey(),JSON.stringify(docs)); loadDocsList();
		}
	}catch(e){alert('Save failed: '+e.message)}
});

// --- Text-to-Speech ---
const ttsBtn = $('tts-btn');
ttsBtn.addEventListener('click',()=>{
	const text = translatedText.value.trim(); if(!text) return alert('Nothing to read');
	const ut = new SpeechSynthesisUtterance(text); ut.lang = langSelect.value; speechSynthesis.cancel(); speechSynthesis.speak(ut);
});

const ttsStopBtn = document.getElementById('tts-stop-btn');
if (ttsStopBtn) ttsStopBtn.addEventListener('click',()=>{ speechSynthesis.cancel(); });



// --- Theme Toggle ---
function setTheme(mode) {
	document.body.classList.remove('light', 'dark');
	document.body.classList.add(mode);
	localStorage.setItem('theme', mode);
	// Update all theme toggle button icons
	const btns = [
		document.getElementById('theme-toggle-btn'),
		document.getElementById('theme-toggle-btn-auth')
	];
	btns.forEach(btn => {
		if (btn) btn.textContent = mode === 'dark' ? '☀️' : '🌙';
	});
}

function toggleTheme() {
	const current = document.body.classList.contains('dark') ? 'dark' : 'light';
	setTheme(current === 'dark' ? 'light' : 'dark');
}

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleBtnAuth = document.getElementById('theme-toggle-btn-auth');
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleBtnAuth) themeToggleBtnAuth.addEventListener('click', toggleTheme);

// On load, set theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
	setTheme(savedTheme);
} else {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	setTheme(prefersDark ? 'dark' : 'light');
}

// --- Initialize ---
updateUI();


// Make sure service worker registration is optional
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}


// End of file
