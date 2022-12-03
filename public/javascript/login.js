
const Login = {
  async init() {
    this.bindEvents();
    await this.inactivatePlayers().catch(this.logError);
    this.currentUser = {};
  },

  inactivatePlayers() {
    let url = '/reset';
    return fetch(url);
  },

  logError(err) {
    console.error(err);
  },

  bindEvents() {
    const logInSubmitBtn = document.getElementById('submit_login');
    logInSubmitBtn.addEventListener('click', this.checkAuthentication.bind(this));

    const createUserBtn = document.getElementById('new_user_btn');
    createUserBtn.addEventListener('click', this.createNewUser.bind(this));

    const newUserForm = document.getElementById('new_user');
    newUserForm.addEventListener('mousedown', this.clearMsgForm.bind(this));
  },

  clearMsgForm() {
    const logInForm = document.getElementById('login');
    const h2 = document.getElementById('login_msg');

    logInForm.username.value = "";
    logInForm.password.value = "";

    h2.classList.remove('show');
  },

  async checkAuthentication() {
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');

    let userInfo = {
      username: nameInput.value,
      userpassword: passwordInput.value
    };

    let userArray = await this.searchForUser(userInfo).catch(this.logError);
    if (userArray.length > 0) {
        await this.recordCurrentUser(userArray[0]).catch(this.logError);
        this.requestGamePage();
    } else {
      this.showNotFoundMsg();
    }
  },

  async searchForUser(userObj) {
    let url = '/login';
    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userObj)
    };

    return fetch(url, init).then(response => response.json());
  },

  sendNewUserData(newUserObj) {
    let url = '/new';
    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newUserObj)
    };

    return fetch(url, init).then(response => response.text());
  },

  showSuccessMsg() {
    const savedH2 = document.getElementById('saved_msg');
    savedH2.classList.add('show');
  },

  async createNewUser() {
    let form = document.getElementById('new_user');
    let idObj = {
      username: form.username.value,
      userpassword: form.password.value,
    };

    let text = await this.sendNewUserData(idObj).catch(this.logError);
    if (text === 'saved') {
      this.showSuccessMsg();
    }
  },

  async requestGamePage() {
    let htmlStr = await fetch('/game').then(response => response.text()).catch(console.error);// 
    let newHTML = document.open("text/html", "replace");
    newHTML.write(htmlStr);
    newHTML.close();
  },

  // requestGamePage() {
  //   window.location.href = 'game';
  // },

  recordCurrentUser(userObj) {
    let url = '/active';

    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userObj)
    };

    return fetch(url, init);
  },

  showNotFoundMsg() {
    const logInH3 = document.getElementById('login_msg');
    logInH3.classList.add('show');
  },

};

document.addEventListener('DOMContentLoaded', () => {
  Login.init();
});
