
class Game {
  constructor(playerObj) {
    this.player = playerObj;
  }

  createFilterObj() {
    return {
      username: this.player.username,
      password: this.player.password
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
  },

  findUserObject() {
    let url = '/find';
    return fetch(url).then(response => response.json())
      .then(data => data).catch((err) => console.error(err));
  },

  makeReqForQuestions() {
    const url = "https://the-trivia-api.com/api/questions?limit=50&region=US&difficulty=medium";
    return fetch(url).then(response => response.json())
    .catch((err) => console.error(err));
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

  bindEvents() {
    const btn = document.getElementById('submit');
    btn.addEventListener('click', this.updateStatObj.bind(this));

    const startBtn = document.getElementById('start_btn');
    startBtn.addEventListener('mousedown', this.removeOverlay.bind(this));

    const playBtn = document.getElementById('play_again');
    playBtn.addEventListener('mousedown', this.startNewGame.bind(this));

    const quitBtn = document.getElementById('quit');
    quitBtn.addEventListener('mousedown', () => {
      window.location.href = "http://localhost:3000";
    });
  },

   async showStandings() {
    console.log('in show standings');
    const standingsDiv = document.getElementById('standings_div');
    standingsDiv.classList.remove('hide_overlay');


    // get all docs, [], pass to templ fn
    let arrDocs = await this.getAllDocs();

    // sort array by games played
    function compare(a, b) {
      if (a.numGamesPlayed > b.numGamesPlayed) { return -1 };
      if (a.numGamesPlayed < b.numGamesPlayed) {return 1 };
      return 0;
    }

    arrDocs.sort(compare);
    let templObj = { array: arrDocs };
    standingsDiv.innerHTML = this.standingsTempFn(templObj);
  },

  startNewGame() {
    this.renderQuestion();
    this.rebindSubmitBtn();
    this.setUpGameObjects();
    this.removeReplayOverlay();
  },

  removeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hide_overlay');
  },

  removeReplayOverlay() {
    const replayOverlay = document.getElementById('replay_overlay');
    replayOverlay.classList.add('hide_overlay'); 
  },

  setUpGameObjects() {
    let trackObj = new Game(this.user[0]);
    this.filterObj = trackObj.createFilterObj();
    this.gameStatObj = trackObj.createStatObj();
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

  collectAnswer() {
    const form = document.getElementById('form');
    let clickedGuess = form.querySelector('.highlight_click');
    if (clickedGuess) {
      return clickedGuess.dataset.text;
    } else {
      console.log('no guess');// notify player..
    }
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

    if (this.gameStatObj.totalGuesses > 4) {
      setTimeout(() => {
        this.endGame();
      }, 1500);
    } else {
      setTimeout(() => {
        this.renderQuestion();
        this.rebindSubmitBtn();
      }, 1500);
      console.log(guess);
      console.log('correct: ' + this.currentCorrect);
      console.log(this.gameStatObj);
    }
  },

  rebindSubmitBtn() {
    const btn = document.getElementById('submit');
    btn.addEventListener('click', this.updateStatObj.bind(this));
  },

  // end game, update game stats for player
  // prompt to play again.. 
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

  showGameMsg() {
    const p = document.getElementById('result_msg');
    p.textContent = `You scored ${this.gameStatObj.correct} out of ${this.gameStatObj.totalGuesses}`;
  },

  promptUser() {
    const replayOverlay = document.getElementById('replay_overlay');
    replayOverlay.classList.remove('hide_overlay');
  },

  recordGame(gameObj) {
    let url = '/update';
    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(gameObj)
    };

    return fetch(url, init).then(response => response.text())
    .then(text => console.log(text)).catch((err) => console.log(err));// returning text !!

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

  makePostRequest(newDocObj) {
    
    let url ='/new';

    let init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(newDocObj)
    };

    fetch(url, init).then(response => response.text())
      .then(text => console.log(text)).catch((err) => console.error(err));
  },

  getAllDocs() {
    return fetch('/data').then(response => response.json())
      .then(data => data).catch((err) => console.error(err));
  },

  clearCollection() {
    fetch('/clear').then(response => response.text())
      .then(text => console.log(text)).catch((err) => console.error(err));
  }
};

document.addEventListener('DOMContentLoaded', () =>{
  App.init();
  // App.clearCollection();// remove all players from collection
});

