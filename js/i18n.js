const translations = {
  "es": {
    "title_login": "Cuenta Nintendo",
    "instruction": "Inicia sesión con tu cuenta Nintendo <br>o crea una cuenta nueva.",
    "has_account": "¿Tienes ya una cuenta?",
    "email_placeholder": "Correo electrónico",
    "password_placeholder": "Contraseña",
    "btn_login": "Iniciar sesión",
    "no_account": "¿No tienes cuenta?",
    "btn_create": "Crear una cuenta Nintendo",
    
    "title_register": "Crear cuenta Nintendo",
    "btn_register": "Crear cuenta",
    "already_account": "¿Ya tienes cuenta?",
    "link_login": "Inicia sesión",
    
    "footer_help": "Ayuda",
    "footer_contract": "Contrato de la cuenta Nintendo",
    "footer_privacy": "Política de privacidad de la cuenta Nintendo",
    "footer_web_privacy": "Contacto y política de privacidad de este sitio web",
    "footer_nintendo": "Sitio web de Nintendo",
    "copyright": "© Nintendo"
  },
  "en": {
    "title_login": "Nintendo Account",
    "instruction": "Sign in with your Nintendo Account <br>or create a new one.",
    "has_account": "Already have an account?",
    "email_placeholder": "Email address",
    "password_placeholder": "Password",
    "btn_login": "Sign in",
    "no_account": "Don't have an account?",
    "btn_create": "Create a Nintendo Account",
    
    "title_register": "Create Nintendo Account",
    "btn_register": "Create account",
    "already_account": "Already have an account?",
    "link_login": "Sign in",
    
    "footer_help": "Help",
    "footer_contract": "Nintendo Account Agreement",
    "footer_privacy": "Nintendo Account Privacy Policy",
    "footer_web_privacy": "Contact & Website Privacy Policy",
    "footer_nintendo": "Nintendo Website",
    "copyright": "© Nintendo"
  },
  "pt": {
    "title_login": "Conta Nintendo",
    "instruction": "Faça login com sua Conta Nintendo <br>ou crie uma nova conta.",
    "has_account": "Já tem uma conta?",
    "email_placeholder": "Endereço de e-mail",
    "password_placeholder": "Senha",
    "btn_login": "Fazer login",
    "no_account": "Não tem uma conta?",
    "btn_create": "Criar uma Conta Nintendo",
    
    "title_register": "Criar Conta Nintendo",
    "btn_register": "Criar conta",
    "already_account": "Já tem uma conta?",
    "link_login": "Fazer login",
    
    "footer_help": "Ajuda",
    "footer_contract": "Contrato da Conta Nintendo",
    "footer_privacy": "Política de Privacidade da Conta",
    "footer_web_privacy": "Contato e Privacidade do site",
    "footer_nintendo": "Site da Nintendo",
    "copyright": "© Nintendo"
  },
  "zh": {
    "title_login": "Nintendo 账号",
    "instruction": "请使用您的 Nintendo 账号登录<br>或创建一个新账号。",
    "has_account": "已有账号？",
    "email_placeholder": "电子邮箱",
    "password_placeholder": "密码",
    "btn_login": "登录",
    "no_account": "没有账号？",
    "btn_create": "创建 Nintendo 账号",
    
    "title_register": "创建 Nintendo 账号",
    "btn_register": "创建账号",
    "already_account": "已有账号？",
    "link_login": "登录",
    
    "footer_help": "帮助",
    "footer_contract": "Nintendo 账号协议",
    "footer_privacy": "Nintendo 账号隐私政策",
    "footer_web_privacy": "联系方式与网站隐私",
    "footer_nintendo": "Nintendo 官网",
    "copyright": "© Nintendo"
  },
  "ja": {
    "title_login": "ニンテンドーアカウント",
    "instruction": "ニンテンドーアカウントでログイン<br>または新しいアカウントを作成してください。",
    "has_account": "すでにアカウントをお持ちですか？",
    "email_placeholder": "メールアドレス",
    "password_placeholder": "パスワード",
    "btn_login": "ログイン",
    "no_account": "アカウントをお持ちではありませんか？",
    "btn_create": "ニンテンドーアカウントを作成",
    
    "title_register": "ニンテンドーアカウントを作成",
    "btn_register": "アカウントを作成",
    "already_account": "すでにアカウントをお持ちですか？",
    "link_login": "ログイン",
    
    "footer_help": "ヘルプ",
    "footer_contract": "ニンテンドーアカウント利用規約",
    "footer_privacy": "プライバシーポリシー",
    "footer_web_privacy": "ウェブサイトのプライバシー",
    "footer_nintendo": "任天堂ウェブサイト",
    "copyright": "© Nintendo"
  },
  "ko": {
    "title_login": "닌텐도 어카운트",
    "instruction": "닌텐도 어카운트로 로그인<br>또는 새 어카운트를 만드세요.",
    "has_account": "이미 계정이 있으신가요?",
    "email_placeholder": "이메일 주소",
    "password_placeholder": "비밀번호",
    "btn_login": "로그인",
    "no_account": "계정이 없으신가요?",
    "btn_create": "닌텐도 어카운트 만들기",
    
    "title_register": "닌텐도 어카운트 만들기",
    "btn_register": "어카운트 만들기",
    "already_account": "이미 계정이 있으신가요?",
    "link_login": "로그인",
    
    "footer_help": "도움말",
    "footer_contract": "어카운트 이용약관",
    "footer_privacy": "개인정보처리방침",
    "footer_web_privacy": "웹사이트 개인정보 보호",
    "footer_nintendo": "닌텐도 웹사이트",
    "copyright": "© Nintendo"
  }
};

const langMap = {
  "Español (España)": "es",
  "English (United States)": "en",
  "中文 (中国)": "zh",
  "日本語 (日本)": "ja",
  "한국어 (대한민국)": "ko",
  "Português (Brasil)": "pt"
};

document.addEventListener("DOMContentLoaded", () => {
  // Load saved language or default to ES
  let savedLangCode = localStorage.getItem("nintendo_lang") || "es";
  applyLanguage(savedLangCode);

  const langSelectors = document.querySelectorAll(".language-selector");
  
  // Set the selector to match local storage
  langSelectors.forEach(selector => {
      Array.from(selector.options).forEach(opt => {
          if (langMap[opt.value] === savedLangCode) {
              opt.selected = true;
          }
      });
      
      selector.addEventListener("change", (e) => {
          const selectedText = e.target.value;
          const code = langMap[selectedText];
          if (code) {
              localStorage.setItem("nintendo_lang", code);
              applyLanguage(code);
          }
      });
  });
});

function applyLanguage(code) {
  const dict = translations[code];
  if (!dict) return;

  const translatableElements = document.querySelectorAll("[data-i18n]");
  translatableElements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = dict[key];
      if (translation) {
          if(el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
              el.setAttribute("placeholder", translation);
          } else {
              el.innerHTML = translation;
          }
      }
  });
}
