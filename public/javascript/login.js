
const Login = {
  async init() {
    this.bindEvents();
    let resetText = await this.inactivatePlayers().catch(this.logError);

    console.log(resetText);
    
    this.currentUser = {};
  },

  inactivatePlayers() {
    let url = '/reset';
    // fetch(url).then(response => response.text())
    //   .then(text => console.log(text)).catch((err) => console.error(err));

    return fetch(url).then(response => response.text());
    //.then(text => console.log(text));//.catch((err) => console.error(err));
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

  checkAuthentication() {
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');

    let userInfo = {
      username: nameInput.value,
      userpassword: passwordInput.value
    };

    this.searchForUser(userInfo);
  },

  searchForUser(userObj) {
    let url = '/login';

    console.log(userObj);

    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userObj)
    };

    fetch(url, init).then(response => response.json())
      .then(data => {// data is an [ {} ] , or empty..
        if (data.length > 0) {
          console.log(data[0]);
          this.recordCurrentUser(data[0]);
          this.requestGamePage();
        } else {
          this.showNotFoundMsg();
        }
      })
      .catch((err) => console.error(err));
  },

  sendNewUserData(newUserObj) {// ok, change route
    let url = '/new';
    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newUserObj)
    };

    fetch(url, init).then(response => response.text())
      .then(text => {
        console.log(text);
        this.showSuccessMsg();
      }).catch((err) => console.error(err));
    // route sends text back, logged only
  },

  showSuccessMsg() {
    const savedH2 = document.getElementById('saved_msg');
    savedH2.classList.add('show');
  },

  createNewUser() {
    let form = document.getElementById('new_user');
    let idObj = {
      username: form.username.value,
      userpassword: form.password.value,
    };

    this.sendNewUserData(idObj);
  },

  requestGamePage() {
    window.location.href = `${window.location.href}game`;
  },

  recordCurrentUser(userObj) {
    let url = '/active';

    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userObj)
    };

    fetch(url, init).then(response => response.text())
      .then(text => console.log(text)).catch((err) => console.error(err));
  },

  showNotFoundMsg() {
    const logInH3 = document.getElementById('login_msg');
    logInH3.classList.add('show');
  },

};

document.addEventListener('DOMContentLoaded', () => {
  Login.init();
});
