//theme
import { toggleTheme } from "./modules/themeHandling.js";
import { AudioManager, createAudioEntry } from "./modules/audioManager.js";

import {
  getFromLocalStorage,
  setToLocalStorage,
} from "./modules/localStorageHandler.js";

import "./modules/sharing.js";

(function () {
  //theme
  document
    .querySelector(".toggle_button")
    .addEventListener("click", toggleTheme);

  //audio
  const hoverSound = createAudioEntry("hoverSound", "../audio/hover1.ogg");

  const audioManager = AudioManager.createFromURLs([hoverSound]);

  document.querySelectorAll(".pause_button").forEach((element) => {
    element.addEventListener("mouseenter", () =>
      audioManager.playAudio(hoverSound)
    );
  });

  document.querySelector("#mute_button").addEventListener("click", () => {
    audioManager.playAudio(hoverSound);
    audioManager.toggleMuteStatus();
  });
  //rulebook
  const rulebook = document.querySelector("#rulebook");
  document.querySelector("#hide_rules_button").addEventListener("click", () => {
    audioManager.playAudio(hoverSound);
    rulebook.style.display = "none";
  });
  document.querySelector("#show_rules_button").addEventListener("click", () => {
    audioManager.playAudio(hoverSound);
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
    audioManager.playAudio(hoverSound);
    stats_display.style.display = "flex";
  });

  document.querySelector("#hide_stats_button").addEventListener("click", () => {
    audioManager.playAudio(hoverSound);
    stats_display.style.display = "none";
  });

  document
    .querySelector("#delete_stats_button")
    .addEventListener("click", () => {
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

  //username
  const dialog_box = document.getElementById("name_dialog");
  const dialog_form = document.getElementById('dialog_form');
  const dialog_form_input = document.getElementById("username");
  const cancelDialogBox = document.getElementById("canceldialog")
  let userName = getFromLocalStorage("swipegame-username");

  const setUsername = (name) => {
    dialog_form_input.value = name;
  }

  dialog_form.addEventListener("submit", function(e){
    userName = this.username.value;
    cancelDialogBox.style.display == "none" ? cancelDialogBox.style.display = "block" : null;
    setToLocalStorage("swipegame-username", userName);
    getWelcomeMessage();
  })

  if (userName === "0") {
    setUsername("User" + Math.floor(Math.random() * 300 + 1));
    cancelDialogBox.style.display = "none";
    dialog_box.showModal();
  }

  const getWelcomeMessage = () => {
    const initation_message = ["Hello", "Howdy", "Welcome", "Hello There!"];
    let index = Math.floor(Math.random() * initation_message.length);
    document.querySelector(
      "#welcome_message"
    ).innerText = `${initation_message[index]}, ${userName}`;
  };

  getWelcomeMessage();

  document.querySelector("#change_name").addEventListener("click", () => {
    setUsername(userName);
    dialog_box.showModal();
  });


  
  cancelDialogBox.addEventListener("click", () => {
    dialog_box.close();
  })

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
    navigator.serviceWorker.register("../sw.js", { scope: "/" }).then((reg) => {
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
})();
