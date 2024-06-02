document.addEventListener("DOMContentLoaded", function() {
  var playIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c79405109ee93b0840805_icon_play_dark.svg'; // URL of play icon
  var pauseIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c793fa7680cd7c30b1816_icon_pause_dark.svg'; // URL of pause icon
  var offset = window.innerHeight * 0.20; // 20% offset

  document.querySelectorAll('.newVideoClass').forEach((video, index) => {
    var button = document.querySelectorAll('.newButtonClass')[index];
    var hasPlayed = false; // Track if the video has started playing

    // Play video when first in view
    function checkVideoVisibility() {
      var rect = video.getBoundingClientRect();
      var isVisible = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

      if (isVisible && !hasPlayed) {
        video.play();
        button.src = pauseIcon;
        hasPlayed = true; // Mark video as having started
      }
    }

    // Change button state when video ends
    video.addEventListener('ended', () => {
      button.src = playIcon;
    });

    // Toggle play/pause on button click
    button.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        button.src = pauseIcon;
      } else {
        video.pause();
        button.src = playIcon;
      }
    });

    window.addEventListener('scroll', checkVideoVisibility);
    window.addEventListener('resize', checkVideoVisibility);

    checkVideoVisibility(); // Initial check
  });
});
