export class AudioManager {
  //properties available inside the object
  isAudioMute = false;
  audioList = [];
  audioUI;

  udpateAudioUI() {
    if (this.isAudioMute) {
      this.audioUI.classList.add("mdi-volume-off");
      this.audioUI.classList.remove("mdi-volume-source");
    } else {
      this.audioUI.classList.remove("mdi-volume-off");
      this.audioUI.classList.add("mdi-volume-source");
    }
  }

  constructor(audio_list, audio_ui_id = "#mute_audio") {
    this.audioList = audio_list;
    this.isAudioMute = true;
    this.audioUI = document.querySelector(audio_ui_id);
    this.udpateAudioUI();
  }

  convertToAudioObject = () => {};

  static createFromURLs(audioList = []) {
    if (audioList.length === 0) return;
    let newList = audioList.map((audio) => {
      if (!audio.volume) audio.volume = 1;

      let audioObject = {
        name: audio.name,
        audioController: new Audio(audio.url),
      };
      audioObject.audioController.volume = audio.volume ?? 1;
      return audioObject;
    });

    return new AudioManager(newList);
  }

  playAudio(audio) {
    if (this.isAudioMute) return;

    let audioName = audio.name ? audio.name : audio;

    this.audioList.forEach((audio) => {
      if (audio.name === audioName) audio.audioController.play();
    });
  }

  pauseAudio(audioName) {
    if (this.isAudioMute) return;

    this.audioList.forEach((audio) => {
      if (audio.name === audioName) audio.audioController.pause();
    });
  }

  toggleMuteStatus() {
    this.isAudioMute = !this.isAudioMute;
    this.udpateAudioUI();
  }
}

export const createAudioEntry = (name, url, volume = 1) => {
  return {
    name,
    url,
    volume,
  };
};
