//this is our shareable url
let url = window.location.origin + "/index.html";

const share = () => {
  navigator
    .share({
      title: "Odd N Even: One of the coolest game in this universe",
      text: `Come and join me at OddnEven a fun and Casual Game`,
      url: url,
    })
    .then(() => console.log("successful"))
    .catch((err) => console.log(err));
};

const shareZone = document.getElementById("share_zone");

if (shareZone) {
  if (navigator.share) {
    shareZone.innerHTML = `
      <button
        aria-placeholder="Share your Score"
        class="pause_button"
        id="share_api_button"
        title="Share Your Score"
      >
        <span class="mdi mdi-share"></span>
        <spna class="text">Share</span>
      </button>
      `;
  } else {
    shareZone.innerHTML = `
      <a
        href="https://www.facebook.com/sharer.php?u=${url}&caption=Can_you_beat_my_in_Odd_N_Even"
        aria-placeholder="Share in Facebook"
        class="pause_button"
        title="Share in facebook"
        target="_blank"
        rel="noopener"
      >
        <span class="mdi mdi-facebook"></span>
        <span class="text">FB Share</span>  
      </a>
  
      <a
        href="https://twitter.com/share?url=${url}&text=Can you beat me in Odd N Even by @AyushmanBThakur"
        aria-placeholder="Share in Twitter"
        class="pause_button"
        title="play the game?"
        target="_blank"
        rel="noopener"
      >
        <span class="mdi mdi-twitter" style="color: skyblue"></span>
        <span class="text">Twitter Share</span>
      </a>
    `;
  }

  const shareAPIbutton = document.getElementById("#share_api_button");
  if (shareAPIbutton) shareAPIbutton.addEventListener("click", () => share);
}
