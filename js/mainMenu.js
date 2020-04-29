//theme
import { determineBodyClass, toggleTheme } from "./modules/themeHandling.js";
//audio
import {
  audioStatus,
  playHoverSound,
} from "./modules/homepageSpecific/audioHomepage.js";

import {
  getFromLocalStorage,
  setToLocalStorage,
} from "./gameRules/localStorageHandling.js";

(function () {
  document
    .querySelector(".toggle_button")
    .addEventListener("click", toggleTheme);

  //rulebook
  const rulebook = document.querySelector("#rulebook");
  document.querySelector("#hide_rules_button").addEventListener("click", () => {
    playHoverSound();
    rulebook.style.display = "none";
  });
  document.querySelector("#show_rules_button").addEventListener("click", () => {
    playHoverSound();
    rulebook.style.display = "flex";
  });

  //stat initialization
  const playCountDisplay = document.querySelector("#play_count_display");
  const highscoreDisplay = document.querySelector("#highscore_display");
  const correctAnswerDisplay = document.querySelector(
    "#correct_answer_display"
  );
  const wrongAnswerDisplay = document.querySelector("#wrong_answer_display");

  let numberOfTimesPlayed = +getFromLocalStorage(
    "swipegame_number_of_times_played"
  );

  playCountDisplay.innerText = numberOfTimesPlayed;

  let highscore = +getFromLocalStorage("swipegame_highscore");

  highscoreDisplay.innerText = highscore;

  let correctAnswers = +getFromLocalStorage("swipegame_correct_answers");

  correctAnswerDisplay.innerText = correctAnswers;

  let wrongAnswers = +getFromLocalStorage("swipegame_wrong_answers");

  wrongAnswerDisplay.innerText = wrongAnswers;

  //the stats view
  const stats_display = document.querySelector("#stats");

  document.querySelector("#show_stats_button").addEventListener("click", () => {
    playHoverSound();
    stats_display.style.display = "flex";
  });

  document.querySelector("#hide_stats_button").addEventListener("click", () => {
    playHoverSound();
    stats_display.style.display = "none";
  });

  document.querySelector("#delete_stats_button", () => {
    if (
      window.confirm(
        "Are you sure want to delete the stats? This is unrecoverable"
      )
    ) {
      highscore = 0;
      correctAnswers = 0;
      wrongAnswers = 0;
      numberOfTimesPlayed = 0;

      setToLocalStorage("swipegame_correct_answers", 0);
      setToLocalStorage("swipegame_wrong_answers", 0);
      setToLocalStorage("swipegame_highscore", 0);
      setToLocalStorage("swipegame_number_of_times_played", 0);

      playCountDisplay.innerText = numberOfTimesPlayed;
      highscoreDisplay.innerText = highscore;
      correctAnswerDisplay.innerText = correctAnswers;
      wrongAnswerDisplay.innerText = wrongAnswers;
    }
  });

  const startupTasks = () => {
    audioStatus();
    determineBodyClass();
  };

  //everything related to installation
  const installButton = document.querySelector("#install_button");

  installButton.style.display = "none";

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    installButton.style.display = "block";
  });

  installButton.addEventListener("click", () => {
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
  });

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

  startupTasks();
})();
