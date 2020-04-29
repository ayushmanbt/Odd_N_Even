const audioButton = document.querySelector("#mute_audio");
const hoverSound = new Audio("../audio/hover1.ogg");
let muted = true;

export const playHoverSound = () => {
  muted ? null : hoverSound.play();
};

document.querySelectorAll(".pause_button").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    playHoverSound();
  });
});

document.querySelector("#mute_button").addEventListener("click", () => {
  if (muted) {
    muted = false;
    audioStatus();
  } else {
    muted = true;
    audioStatus();
  }
  window.localStorage.setItem("swipegame_audiostatus", muted);
});

export const audioStatus = () => {
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
