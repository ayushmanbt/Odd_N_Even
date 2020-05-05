import { toggleTheme } from "./modules/themeHandling.js";
import { getFromLocalStorage } from "./modules/localStorageHandler.js";
import { AudioManager, createAudioEntry } from "./modules/audioManager.js";

(function () {
  //audio_setup
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

  document
    .querySelector(".toggle_button")
    .addEventListener("click", toggleTheme);

  document.querySelector("#local_best").innerText = getFromLocalStorage(
    "swipegame_highscore"
  );

  //leaderboard rendering
  const LEADERBOARD_MODES = {
    all: 0,
    desktop: 1,
    mobile: 2,
  };

  let isLeaderboardLoading = false;

  let current_leaderboard_mode = LEADERBOARD_MODES.all;
  let top_5 = [];
  let top_list_container = document.querySelector(".top_five_list");

  let addSoundToList = () => {};

  const updateList = () => {
    if (top_5.length === 0)
      top_list_container.innerHTML = `<li class="top_list_item">
            <p class="score">Sorry No Update</p>
        </li>`;
    else {
      top_list_container.innerHTML = top_5.reduce(
        (acc, current) =>
          (acc += `
          <li class="top_list_item">
            <p class="name">${current.userName}(${current.deviceType})</p>
            <p class="score">${current.score}</p>
          </li>
          `),
        ""
      );
    }
    addSoundToList();
  };

  const getLeaderBoardData = async () => {
    top_list_container.innerHTML = `
    <li class="top_list_item">
        <img src="/images/Loading_2.gif" style="display: block; margin: 0 auto; background: white"/>
    </li>
    `;
    let APIString = "https://oddneven-backend.glitch.me/api/leaderboard/";
    if (current_leaderboard_mode == LEADERBOARD_MODES.desktop) {
      APIString = `${APIString}?device=desktop`;
    } else if (current_leaderboard_mode == LEADERBOARD_MODES.mobile) {
      APIString = `${APIString}?device=phone`;
    }
    isLeaderboardLoading = true;
    try {
      let response = await fetch(APIString);
      top_5 = await response.json();
      updateList();
    } catch (error) {
      //getting here means we did not get any response
      top_list_container.innerHTML = `<li class="top_list_item">
            <p class="score">Check your net connection | We have some internal difficulties</p>
        </li>`;
    } finally {
      isLeaderboardLoading = false;
    }
  };

  const updateTab = () => {
    document.querySelectorAll(".selection_item").forEach((e) => {
      if (
        current_leaderboard_mode === LEADERBOARD_MODES.all &&
        e.id === "common"
      )
        e.classList.add("active");
      else if (
        current_leaderboard_mode === LEADERBOARD_MODES.desktop &&
        e.id === "desktop"
      )
        e.classList.add("active");
      else if (
        current_leaderboard_mode === LEADERBOARD_MODES.mobile &&
        e.id === "mobile"
      )
        e.classList.add("active");
      else e.classList.remove("active");
    });
    getLeaderBoardData();
  };

  document.querySelectorAll(".selection_item").forEach((e) => {
    e.addEventListener("click", ({ toElement }) => {
      audioManager.playAudio(hoverSound);

      if (isLeaderboardLoading) return;

      if (toElement.id == "common")
        current_leaderboard_mode = LEADERBOARD_MODES.all;
      else if (toElement.id == "desktop")
        current_leaderboard_mode = LEADERBOARD_MODES.desktop;
      else if (toElement.id == "mobile")
        current_leaderboard_mode = LEADERBOARD_MODES.mobile;

      updateTab();
    });
  });

  //sound for the list
  addSoundToList = () => {
    Array.from(document.getElementsByClassName("top_list_item")).forEach(
      (e) => {
        e.addEventListener("click", () => {
          audioManager.playAudio(hoverSound);
        });
        e.addEventListener("mouseenter", () =>
          audioManager.playAudio(hoverSound)
        );
      }
    );
  };

  updateTab();
})();
