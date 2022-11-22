
class Game {
  constructor(playerObj) {
    console.log(playerObj);

    this.player = playerObj;
  }

  createFilterObj() {
    return {
      username: this.player.username,
      userpassword: this.player.userpassword
    };
  }

  createStatObj() {
    return {
      totalGuesses: 0,
      correct: 0,
      incorrect: 0
    };
  }
};


const App = {
  init: async function() {
    this.questionIndex = 0;
    this.questions = await this.makeReqForQuestions();
    this.user = await this.findUserObject();
    this.getRefToElements();
    this.createTemplateFn();
    this.renderQuestion();
    this.setUpGameObjects();
    this.bindEvents();

    this.testLog();
  },

  bindEvents() {
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('mousedown', this.updateStatObj.bind(this));

    const startBtn = document.getElementById('start_btn');
    startBtn.addEventListener('mousedown', this.removeOverlay.bind(this));

    const playBtn = document.getElementById('play_again');
    playBtn.addEventListener('mousedown', this.startNewGame.bind(this));

    const quitBtn = document.getElementById('quit');
    quitBtn.addEventListener('mousedown', () => {
      window.location.href = "http://localhost:5000";
    });
  },

  makeReqForQuestions() {
    const url = "https://the-trivia-api.com/api/questions?limit=50&region=US&difficulty=medium";
    return fetch(url).then(response => response.json())
    .catch((err) => console.error(err));
  },

  findUserObject() {
    let url = '/find';
    return fetch(url).then(response => response.json())
      .then(data => data).catch((err) => console.log(err));
  },

  getRefToElements() {
    this.container = document.getElementById('container');
  },

  createTemplateFn() {
    let mainScript = document.getElementById('main_template');
    this.templateFn = Handlebars.compile(mainScript.innerHTML);

    let standingsScript = document.getElementById('standings_template');
    this.standingsTempFn = Handlebars.compile(standingsScript.innerHTML);

    Handlebars.registerHelper('percent', function(n1, n2) {
      return ((n1 / n2) * 100).toFixed(1);
    });
  },

  renderQuestion() {
    this.clearMessages();
    let incorrectArr = this.questions[this.questionIndex].incorrectAnswers;
    let newIndex = Math.floor(Math.random() * 4);
    incorrectArr.splice(newIndex, 0, this.questions[this.questionIndex].correctAnswer);
    this.questions[this.questionIndex].fourGuesses = incorrectArr;
    this.container.innerHTML = this.templateFn(this.questions[this.questionIndex]);
    
    this.currentCorrect = this.questions[this.questionIndex].correctAnswer;
    this.questionIndex += 1;

    this.highlightGuesses();
  },

  clearMessages() {
    const answerP = document.getElementById('answer');
    const messageDiv = document.getElementById('message');
    answerP.textContent = '';
    messageDiv.textContent = '';
  },

  highlightGuesses() {
    const form = document.getElementById('form');
  
    form.addEventListener('mouseover', (event) => {
      if (event.target.tagName === 'LABEL') {
        event.target.classList.add('highlight_hover');
      }
    });

    form.addEventListener('mouseout', (event) => {
      event.target.classList.remove('highlight_hover');
    });

    form.addEventListener('mousedown', (event) => {
      if (event.target.tagName === 'LABEL') {
        let prevClickedLabel = form.querySelector('.highlight_click');
        if (prevClickedLabel) {
          prevClickedLabel.classList.remove('highlight_click');
        }

        event.target.classList.add('highlight_click');
      }
    });
  },

  setUpGameObjects() {
    console.log(this.user);

    let trackObj = new Game(this.user);
    this.filterObj = trackObj.createFilterObj();
    this.gameStatObj = trackObj.createStatObj();
  },

  updateStatObj() {
    let guess = this.collectAnswer();

    if (guess === this.currentCorrect) {
      this.gameStatObj.correct += 1;
      this.displayCorrectMsg();
    } else {
      this.gameStatObj.incorrect += 1;
      this.displayIncorrectMsg();
    }

    this.gameStatObj.totalGuesses += 1;

    if (this.gameStatObj.totalGuesses > 2) {
      setTimeout(() => {
        this.endGame();
      }, 1500);
    } else {
      setTimeout(() => {
        this.renderQuestion();
        this.rebindSubmitBtn();
      }, 1500);
    }
  },

  collectAnswer() {
    const form = document.getElementById('form');
    let clickedGuess = form.querySelector('.highlight_click');
    if (clickedGuess) {
      return clickedGuess.dataset.text;
    } else {
      console.log('no guess');// notify player
    }
  },

  displayCorrectMsg() {
    const div = document.getElementById('message');
    div.style.color = 'yellow';
    div.classList.remove('rotate_down');
    div.classList.add('rotate_up');
    div.textContent = 'Correct !!!';
  },

  displayIncorrectMsg() {
    const div = document.getElementById('message');
    const answerP = document.getElementById('answer');
    div.style.color = 'red';
    div.classList.remove('rotate_up');
    div.classList.add('rotate_down');
    div.textContent = 'Incorrect';
    answerP.textContent = `Answer: ${this.currentCorrect}`;
  },

  rebindSubmitBtn() {
    const btn = document.getElementById('submit');
    btn.addEventListener('mousedown', this.updateStatObj.bind(this));
  },
    
  async endGame() {
    let obj = {
      filter: this.filterObj,
      gameStats: this.gameStatObj
    };

    await this.recordGame(obj);
    this.promptUser();
    this.showGameMsg();
    this.showStandings();
  },

  recordGame(gameObj) {
    let url = '/update';
    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(gameObj)
    };

    return fetch(url, init).then(response => response.text())
      .then(text => console.log(text)).catch((err) => console.log(err));
  },

  promptUser() {
    const replayOverlay = document.getElementById('replay_overlay');
    replayOverlay.classList.remove('hide_overlay');
  },

  showGameMsg() {
    const p = document.getElementById('result_msg');
    p.textContent = `You scored ${this.gameStatObj.correct} out of ${this.gameStatObj.totalGuesses}`;
  },

  async showStandings() {
    const standingsDiv = document.getElementById('standings_div');
    standingsDiv.classList.remove('hide_overlay');

    // get all users, pass to template fn
    let arrayUsers = await this.getAllUsers();
    
    function compare(a, b) {
      if (a.numgamesplayed > b.numgamesplayed) { return -1 };
      if (a.numgamesplayed < b.numgamesplayed) { return 1 };
      return 0;
    }

    arrayUsers.sort(compare);
    let templObj = { array: arrayUsers };
    standingsDiv.innerHTML = this.standingsTempFn(templObj);
  },

  getAllUsers() {
    return fetch('/data').then(response => response.json())
      .then(data => data).catch((err) => console.log(err));
  },

  removeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hide_overlay');
  },

  removeReplayOverlay() {
    const replayOverlay = document.getElementById('replay_overlay');
    replayOverlay.classList.add('hide_overlay'); 
  },

  startNewGame() {
    this.renderQuestion();
    this.rebindSubmitBtn();
    this.setUpGameObjects();
    this.removeReplayOverlay();
  },

  // testLog() {
  //   console.log(this.user);
  // },

};


document.addEventListener('DOMContentLoaded', () => {
  App.init();
});