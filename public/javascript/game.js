// class for Game {} ?

class Game {
  constructor(playerObj) {
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

    this.testLog();
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
    let trackObj = new Game(this.user);
    this.filterObj = trackObj.createFilterObj();
    this.gameStatObj = trackObj.createStatObj();

    console.log(this.filterObj);
  },



  testLog() {
    console.log(this.user);
  },

};


document.addEventListener('DOMContentLoaded', () => {
  App.init();
});