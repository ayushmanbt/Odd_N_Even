import { determineBodyClass, toggleTheme } from "./modules/themeHandling.js";

const body = document.querySelector("body");

determineBodyClass();

document
  .querySelector("#theme_toggler")
  .addEventListener("click", toggleTheme());

const ANSWER_MODES = {
  normal: 0,
  reversed: 1,
};

const ANSWER_OPTIONS = {
  left: 0,
  right: 1,
};

const UPPER_BOUND = 1000;

const playArea = document.querySelector(".container");
const scoreDisplay = document.querySelector("#score");
const numberDisplay = document.querySelector("#number");
const leftTextContainer = document.querySelector("#arrow_left_text");
const rightTextContainer = document.querySelector("#arrow_right_text");
const timeHolder = document.querySelector("#time");
const pauseScreen = document.querySelector("#pause_screen");
const gameOverScreen = document.querySelector("#game_over_screen");
const highscoreContainer = document.querySelector("#highscore_container");
const muteAudioButtonIcon = document.querySelector("#mute_audio");

document.querySelectorAll(".pause_button").forEach((element) => {
  element.addEventListener("mouseenter", playHoverSound());
});

//this is our shareable url
let location_split = window.location.href.split("/");
location_split.pop();
location_split.pop();
let url = location_split.join("/");
url = url + "/";

//audio related stuff
const bgm = new Audio("../audio/bgm.mp3");
const successSound = new Audio("../audio/success.wav");
const errorSound = new Audio("../audio/error.wav");
const hoverSound = new Audio("../audio/hover1.ogg");

bgm.volume = 0.2;

let muted = window.localStorage.getItem("swipegame_audiostatus")
  ? JSON.parse(window.localStorage.getItem("swipegame_audiostatus"))
  : false;

const audioStatus = () => {
  if (muted) {
    bgm.volume = 0;
    successSound.volume = 0;
    errorSound.volume = 0;
    muteAudioButtonIcon.classList.add("mdi-volume-off");
    muteAudioButtonIcon.classList.remove("mdi-volume-source");
  } else {
    bgm.volume = 0.2;
    successSound.volume = 1;
    errorSound.volume = 1;
    muteAudioButtonIcon.classList.remove("mdi-volume-off");
    muteAudioButtonIcon.classList.add("mdi-volume-source");
  }
};

const changeAudioStatus = () => {
  if (muted) {
    muted = false;
    audioStatus();
  } else {
    muted = true;
    audioStatus();
  }
  window.localStorage.setItem("swipegame_audiostatus", muted);
};

//these variables are fou touch inputs
const TOUCH_THRESHOLD = 150;

let touchStartPosX = 0;
let touchMoveX = 0;

let theme = window.localStorage.getItem("swipegame_theming")
  ? +window.localStorage.getItem("swipegame_theming")
  : UI_MODES.dark;

let localHighScore = window.localStorage.getItem("swipegame_highscore")
  ? +window.localStorage.getItem("swipegame_highscore")
  : 0;

let score = 0;
let acceptingAnswer = true;
let paused = false;

let time = 60;

let number = 21;
let answerMode = ANSWER_MODES.normal;

let correctAnswers = window.localStorage.getItem("swipegame_correct_answers")
  ? +window.localStorage.getItem("swipegame_correct_answers")
  : 0;
let wrongAnswers = window.localStorage.getItem("swipegame_wrong_answers")
  ? +window.localStorage.getItem("swipegame_wrong_answers")
  : 0;

let numberOfTimesPlayed = window.localStorage.getItem(
  "swipegame_number_of_times_played"
)
  ? +window.localStorage.getItem("swipegame_number_of_times_played")
  : 0;

let timeUpdater = setInterval(() => {
  time -= 1;
  updateTimeHolder();
}, 1000);

const updateTimeHolder = () => {
  if (time <= 0) {
    time = 0;
    clearInterval(timeUpdater);
    bgm.pause();
    acceptingAnswer = false;
    gameOverScreen.style.display = "flex";
    numberOfTimesPlayed += 1;
    window.localStorage.setItem(
      "swipegame_number_of_times_played",
      numberOfTimesPlayed
    );
    score > localHighScore ? displayNewHighScore() : displayNewScore();
  }
  timeHolder.innerText = time;
};

const displayNewHighScore = () => {
  localHighScore = score;
  window.localStorage.setItem("swipegame_highscore", localHighScore);
  updateShareZone();
  highscoreContainer.innerHTML = `
        <p>You Got new HighScore!<p>
        <p class="highscore_text">${localHighScore}</p>
      `;
};

const displayNewScore = () => {
  highscoreContainer.innerHTML = `
  <p class="highscore_text">Highscore: ${localHighScore}</p>
  <p class="score_text">Your Score: ${score}</p>
`;
};

const replayGame = () => {
  window.location.reload();
};

const pauseGame = () => {
  if (!paused) {
    clearInterval(timeUpdater);
    paused = true;
    pauseScreen.style.display = "flex";
    bgm.pause();
  } else {
    paused = false;
    timeUpdater = setInterval(() => {
      time -= 1;
      updateTimeHolder();
    }, 1000);
    bgm.play();
    pauseScreen.style.display = "none";
  }
};

const getNewQuestion = () => {
  number = Math.floor(Math.random() * UPPER_BOUND);
  numberDisplay.innerText = number;
  answerMode = Math.round(Math.random());
  if (answerMode === ANSWER_MODES.normal) {
    leftTextContainer.innerText = "odd";
    rightTextContainer.innerText = "even";
  } else {
    leftTextContainer.innerText = "even";
    rightTextContainer.innerText = "odd";
  }
};

const clearAnswerIndicationClasses = () => {
  body.classList.remove("no-before-after");
  body.classList.remove("right_answer");
  body.classList.remove("wrong_answer");
};

document.querySelector("body").addEventListener("animationend", () => {
  clearAnswerIndicationClasses();
  body.classList.add("no-before-after");
});

timeHolder.addEventListener("animationend", () => {
  timeHolder.classList.remove("minus_10_time");
  timeHolder.classList.add("no-before-after");
});

scoreDisplay.addEventListener("animationend", () => {
  scoreDisplay.classList.remove("plus_1_score");
  scoreDisplay.classList.add("no-before-after");
});

const correctAnswerUpdate = () => {
  clearAnswerIndicationClasses();
  score += 1;
  correctAnswers += 1;

  window.localStorage.setItem("swipegame_correct_answers", correctAnswers);

  successSound.play();

  body.classList.add("right_answer");

  scoreDisplay.classList.remove("plus_1_score");
  scoreDisplay.classList.remove("no-before-after");
  scoreDisplay.classList.add("plus_1_score");
};

const wrongAnswerUpdate = () => {
  clearAnswerIndicationClasses();

  time -= 10;
  wrongAnswers += 1;

  window.localStorage.setItem("swipegame_wrong_answers", wrongAnswers);

  updateTimeHolder();
  window.navigator.vibrate(200);
  errorSound.play();

  body.classList.add("wrong_answer");

  timeHolder.classList.remove("minus_10_time");
  timeHolder.classList.remove("no-before-after");
  timeHolder.classList.add("minus_10_time");
};

//these are for additional inputs
playArea.addEventListener("touchstart", (e) => {
  touchStartPosX = e.touches[0].pageX;
});

playArea.addEventListener("touchmove", (e) => {
  touchMoveX = e.touches[0].pageX - touchStartPosX;
});

playArea.addEventListener("touchend", () => {
  if (touchMoveX < -1 * TOUCH_THRESHOLD) answerHandle(ANSWER_OPTIONS.left);
  else if (touchMoveX > TOUCH_THRESHOLD) answerHandle(ANSWER_OPTIONS.right);

  touchMoveX = 0;
});

//keyboard inputs
document.onkeydown = (e) => {
  if (e.keyCode == "37") answerHandle(ANSWER_OPTIONS.left);
  else if (e.keyCode == "39") answerHandle(ANSWER_OPTIONS.right);
};

const answerHandle = (answerDirection) => {
  if (
    ((answerDirection === ANSWER_OPTIONS.left &&
      number % 2 === 1 &&
      answerMode === ANSWER_MODES.normal) ||
      (answerDirection === ANSWER_OPTIONS.right &&
        number % 2 === 0 &&
        answerMode === ANSWER_MODES.normal) ||
      (answerDirection === ANSWER_OPTIONS.left &&
        number % 2 === 0 &&
        answerMode === ANSWER_MODES.reversed) ||
      (answerDirection === ANSWER_OPTIONS.right &&
        number % 2 === 1 &&
        answerMode === ANSWER_MODES.reversed)) &&
    acceptingAnswer
  )
    correctAnswerUpdate();
  else if (acceptingAnswer) wrongAnswerUpdate();

  if (bgm.currentTime == 0) {
    bgm.play();
  }

  if (acceptingAnswer) {
    updateScoreDisplay();
    getNewQuestion();
  }
};

const updateScoreDisplay = () => {
  scoreDisplay.innerHTML = score;
};

const clearHighScore = () => {
  if (
    window.confirm(
      "Are you sure to remove your highscore? This will reset your highscore to 0"
    )
  ) {
    localHighScore = 0;
    localStorage.setItem("swipegame_highscore", 0);
    displayNewScore();
    alert("Highscore update successful");
  }
};

//sharing related stuff
const share = () => {
  navigator
    .share({
      title: "Odd N Even: One of the coolest game in this universe",
      text: `Can you beat my highscore of ${localHighScore} in Odd n Even a super fun casual game`,
      url: url,
    })
    .then(() => console.log("successful"))
    .catch((err) => console.log(err));
};

const shareZone = document.querySelector("#share_zone");
const updateShareZone = () => {
  if (navigator.share) {
    shareZone.innerHTML = `
      <button
      aria-placeholder="Share your Score"
      class="pause_button"
      onclick="share()"
      title="Share Your Score"
      >
       <span class="mdi mdi-share"></span>
      </button>
    `;
  } else {
    shareZone.innerHTML = `
      <a
      href="https://www.facebook.com/sharer.php?u=${url}&caption=Can_you_beat_my_highscore_of_${localHighScore}_in_Odd_N_Even"
      aria-placeholder="Share in Facebook"
      class="pause_button"
      title="Share in facebook"
      target="_blank"
      rel="noopener"
      >
        <span class="mdi mdi-facebook"></span>
      </a>
  
      <a
      href="https://twitter.com/share?url=${url}&text=Can you beat my highscore of ${localHighScore} in Odd N Even by @AyushmanBThakur"
      aria-placeholder="Share in Twitter"
      class="pause_button"
      title="play the game?"
      target="_blank"
      rel="noopener"
      >
        <span class="mdi mdi-twitter" style="color: skyblue"></span>
      </a>
    `;
  }
};

const playHoverSound = () => {
  if (!muted) {
    hoverSound.play();
  }
};

determineBodyClass();
updateScoreDisplay();
getNewQuestion();
audioStatus();
updateShareZone();
pauseGame();
