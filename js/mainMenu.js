const UI_MODES = {
  light: 0,
  dark: 1,
};

const rulebook = document.querySelector("#rulebook");
const stats_display = document.querySelector("#stats");

const playCountDisplay = document.querySelector("#play_count_display");
const highscoreDisplay = document.querySelector("#highscore_display");
const correctAnswerDisplay = document.querySelector("#correct_answer_display");
const wrongAnswerDisplay = document.querySelector("#wrong_answer_display");

const body = document.querySelector("body");

let theme = window.localStorage.getItem("swipegame_theming")
  ? +window.localStorage.getItem("swipegame_theming")
  : UI_MODES.dark;

let numberOfTimesPlayed = window.localStorage.getItem(
  "swipegame_number_of_times_played"
)
  ? +window.localStorage.getItem("swipegame_number_of_times_played")
  : 0;

playCountDisplay.innerText = numberOfTimesPlayed;

let highscore = window.localStorage.getItem("swipegame_highscore")
  ? +window.localStorage.getItem("swipegame_highscore")
  : 0;

highscoreDisplay.innerText = highscore;

let correctAnswers = window.localStorage.getItem("swipegame_correct_answers")
  ? +window.localStorage.getItem("swipegame_correct_answers")
  : 0;

correctAnswerDisplay.innerText = correctAnswers;

let wrongAnswers = window.localStorage.getItem("swipegame_wrong_answers")
  ? +window.localStorage.getItem("swipegame_wrong_answers")
  : 0;

wrongAnswerDisplay.innerText = wrongAnswers;

const audioButton = document.querySelector("#mute_audio");
const hoverSound = new Audio("../audio/hover1.ogg");

let muted = true;

const audioStatus = () => {
  if (muted) {
    hoverSound.volume = 0;
    audioButton.classList.add("mdi-volume-off");
    audioButton.classList.remove("mdi-volume-source");
  } else {
    hoverSound.volume = 1;
    audioButton.classList.remove("mdi-volume-off");
    audioButton.classList.add("mdi-volume-source");
  }
};

const playHoverSound = () => {
  if (!muted) {
    hoverSound.play();
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

wrongAnswerDisplay.innerText = wrongAnswers;

const showRules = () => {
  hoverSound.play();
  rulebook.style.display = "flex";
};

const hideRules = () => {
  hoverSound.play();
  rulebook.style.display = "none";
};

const showStats = () => {
  hoverSound.play();
  stats_display.style.display = "flex";
};

const hideStats = () => {
  hoverSound.play();
  stats_display.style.display = "none";
};

const toggleMode = () => {
  theme = theme === UI_MODES.dark ? UI_MODES.light : UI_MODES.dark;

  determineBodyClass();
};

const determineBodyClass = () => {
  if (theme === UI_MODES.dark) {
    body.classList.remove("light");
    body.classList.add("dark");
    window.localStorage.setItem("swipegame_theming", UI_MODES.dark);
  } else {
    body.classList.add("light");
    body.classList.remove("dark");
    window.localStorage.setItem("swipegame_theming", UI_MODES.light);
  }
};

const resetStats = () => {
  if (
    window.confirm(
      "Are you sure want to delete the stats? This is unrecoverable"
    )
  ) {
    highscore = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    numberOfTimesPlayed = 0;

    window.localStorage.setItem("swipegame_correct_answers", 0);
    window.localStorage.setItem("swipegame_wrong_answers", 0);
    window.localStorage.setItem("swipegame_highscore", 0);
    window.localStorage.setItem("swipegame_number_of_times_played", 0);

    playCountDisplay.innerText = numberOfTimesPlayed;
    highscoreDisplay.innerText = highscore;
    correctAnswerDisplay.innerText = correctAnswers;
    wrongAnswerDisplay.innerText = wrongAnswers;
  }
};

const installButton = document.querySelector("#install_button");

installButton.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  installButton.style.display = "block";
});

const installApp = () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  promptEvent.prompt();
  promptEvent.userChoice.then((result) => {
    console.log("userChoice", result);
    window.deferredPrompt = null;
    installButton.style.display = "none";
  });
};

//serviceworker and stuff
const updateButton = document.querySelector("#update_button");
let newWorker;
let refreshing;

updateButton.style.display = "none";

updateButton.addEventListener("click", () => {
  newWorker.postMessage({ action: "skipWaiting" });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        switch (newWorker.state) {
          case "installed":
            if (navigator.serviceWorker.controller) {
              updateButton.style.display = "block";
            }
            break;
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

audioStatus();
determineBodyClass();
