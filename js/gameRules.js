import { toggleTheme } from "./modules/themeHandling.js";
import {
  setToLocalStorage,
  getFromLocalStorage,
} from "./modules/localStorageHandler.js";
import { AudioManager, createAudioEntry } from "./modules/audioManager.js";
import "./modules/sharing.js";

(function () {
  /*______________THEME______________*/
  document
    .querySelector("#theme_toggler")
    .addEventListener("click", toggleTheme);

  /*______________AUDIO______________*/
  const backgroundMusic = createAudioEntry(
    "backgroundMusic",
    "../audio/bgm.mp3",
    0.2
  );
  const successSound = createAudioEntry("successSound", "../audio/success.wav");
  const errorSound = createAudioEntry("errorSound", "../audio/error.wav");
  const hoverSound = createAudioEntry("hoverSound", "../audio/hover1.ogg");

  const audioList = [backgroundMusic, successSound, errorSound, hoverSound];
  const audioManager = AudioManager.createFromURLs(audioList);

  document.querySelectorAll(".pause_button").forEach((element) => {
    element.addEventListener("mouseenter", () =>
      audioManager.playAudio(hoverSound)
    );
  });

  document.querySelector("#mute_button").addEventListener("click", () => {
    audioManager.toggleMuteStatus();
    audioManager.playAudio(hoverSound);
  });

  /*__________HIGHSCORE_________*/

  let highScore = +getFromLocalStorage("swipegame_highscore");

  const highscoreContainer = document.querySelector("#highscore_container");

  const displayNewHighScore = () => {
    highScore = score;
    setToLocalStorage("swipegame_highscore", highScore);
    highscoreContainer.innerHTML = `
          <p>You Got new HighScore!<p>
          <p class="highscore_text">${highScore}</p>
        `;
  };

  const displayNewScore = () => {
    highscoreContainer.innerHTML = `
    <p class="highscore_text">Highscore: ${highScore}</p>
    <p class="score_text">Your Score: ${score}</p>
  `;
  };

  document
    .querySelector("#remove_highscore_button")
    .addEventListener("click", () => {
      if (
        window.confirm(
          "Are you sure to remove your highscore? This will reset your highscore to 0"
        )
      ) {
        highScore = 0;
        localStorage.setItem("swipegame_highscore", 0);
        displayNewScore();
        alert("Highscore update successful");
      }
    });

  /*_______________PAUSING_______________*/

  let paused = false;
  const pauseScreen = document.querySelector("#pause_screen");

  const updatePauseStat = () => {
    if (!paused) {
      paused = true;
      pauseScreen.style.display = "flex";
      audioManager.pauseAudio(backgroundMusic);
    } else {
      paused = false;
      audioManager.playAudio(backgroundMusic);
      pauseScreen.style.display = "none";
    }
  };

  document
    .querySelector("#pause_button")
    .addEventListener("click", () => updatePauseStat());

  document
    .querySelector("#unpause_button")
    .addEventListener("click", () => updatePauseStat());

  /*________SENDING THE SCORE__________*/
  let isSendingScoreToBackend = false;

  const sendScoreToBackend = () => {
    if (isSendingScoreToBackend) return;
    isSendingScoreToBackend = true;
    const userName = getFromLocalStorage("swipegame-username");
    fetch("https://oddneven-backend.glitch.me/api/result", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        score: score,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*_________CUSTOM GAMEOVER TEXT__________*/
  const createCustomGameoverText = () => {
    const game_over_message_best = [
      "Superb",
      "You Blew The Game Away!",
      "Legendary!",
    ];
    const game_over_message_better = ["You are pro", "Awesome", "Star player"];
    const game_over_message_medioker = [
      "Good",
      "To be legend!",
      "Well played!",
    ];
    const game_over_message_bad = ["Better luck next time", "Practice"];

    let selectedArray;

    if (score > 50) selectedArray = game_over_message_best;
    else if (score > 40) selectedArray = game_over_message_better;
    else if (score > 30) selectedArray = game_over_message_medioker;
    else selectedArray = game_over_message_bad;
    let index = Math.floor(Math.random() * selectedArray.length);
    document.querySelector("#game_over_text").innerText = selectedArray[index];
  };

  /*__________TIMING & GAME END___________*/
  let numberOfTimesPlayed = +getFromLocalStorage(
    "swipegame_number_of_times_played",
    "0"
  );

  let time = 60;
  let acceptingAnswer = true;
  const timeHolder = document.querySelector("#time");

  const updateTimeDisplay = () => {
    if (time <= 0) {
      time = 0;
      //clearInterval(timeUpdater);
      audioManager.pauseAudio(backgroundMusic);
      acceptingAnswer = false;
      document.querySelector("#game_over_screen").style.display = "flex";

      createCustomGameoverText();

      numberOfTimesPlayed += 1;
      setToLocalStorage(
        "swipegame_number_of_times_played",
        numberOfTimesPlayed
      );
      sendScoreToBackend();
      score > highScore ? displayNewHighScore() : displayNewScore();
    }
    timeHolder.innerText = time;
  };

  let timeUpdater = setInterval(() => {
    if (!paused) time -= 1;
    updateTimeDisplay();
    if (time <= 0) clearInterval(timeUpdater);
  }, 1000);

  /*________QUESTION CREATION______*/
  const UPPER_BOUND = 1000;

  const ANSWER_MODES = {
    normal: 0,
    reversed: 1,
  };

  const numberDisplay = document.querySelector("#number");
  const leftTextContainer = document.querySelector("#arrow_left_text");
  const rightTextContainer = document.querySelector("#arrow_right_text");

  let number;
  let answerMode;

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

  /*__________ANSWER GIMICS____________*/

  const scoreDisplay = document.querySelector("#score");
  const body = document.querySelector("body");

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

  /*___________ANSWERING______________*/

  const ANSWER_OPTIONS = {
    left: 0,
    right: 1,
  };
  let correctAnswers = +getFromLocalStorage("swipegame_correct_answers", "0");
  let wrongAnswers = +getFromLocalStorage("swipegame_wrong_answers", "0");

  let score = 0;

  const updateScoreDisplay = () => {
    scoreDisplay.innerHTML = score;
  };

  const correctAnswerUpdate = () => {
    clearAnswerIndicationClasses();
    score += 1;
    correctAnswers += 1;

    setToLocalStorage("swipegame_correct_answers", correctAnswers);

    audioManager.playAudio(successSound);

    body.classList.add("right_answer");

    scoreDisplay.classList.remove("plus_1_score");
    scoreDisplay.classList.remove("no-before-after");
    scoreDisplay.classList.add("plus_1_score");
  };

  const wrongAnswerUpdate = () => {
    clearAnswerIndicationClasses();

    time -= 10;
    wrongAnswers += 1;

    setToLocalStorage("swipegame_wrong_answers", wrongAnswers);

    updateTimeDisplay();
    window.navigator.vibrate(200);
    audioManager.playAudio(errorSound);

    body.classList.add("wrong_answer");

    timeHolder.classList.remove("minus_10_time");
    timeHolder.classList.remove("no-before-after");
    timeHolder.classList.add("minus_10_time");
  };

  const answerHandle = (answerDirection) => {
    if (!acceptingAnswer) return;

    if (
      (answerDirection === ANSWER_OPTIONS.left &&
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
        answerMode === ANSWER_MODES.reversed)
    )
      correctAnswerUpdate();
    else wrongAnswerUpdate();

    updateScoreDisplay();
    getNewQuestion();
  };

  /*______________INPUTS______________*/

  //touchinput
  const TOUCH_THRESHOLD = 150;
  let touchStartPosX = 0;
  let touchMoveX = 0;
  const playArea = document.querySelector(".container");

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

  //click inputs
  document
    .querySelector("#arrow_left")
    .addEventListener("click", () => answerHandle(ANSWER_OPTIONS.left));
  document
    .querySelector("#arrow_right")
    .addEventListener("click", () => answerHandle(ANSWER_OPTIONS.right));

  /*_____________REPLAY GAME_______________*/
  document
    .querySelector("#replay_button")
    .addEventListener("click", () => window.location.reload());

  /*_________STARTUP METHODS______________*/
  const startupMethods = () => {
    //we will start the game as paused, a cheeky way to fire the Bacground Music
    document.querySelector("#pause_button").click();
    getNewQuestion();
    updateScoreDisplay();
    updateTimeDisplay();
  };

  startupMethods();
})();
