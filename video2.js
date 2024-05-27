document.addEventListener("DOMContentLoaded", function() {
  var playIcon = 'URL_OF_PLAY_ICON'; // URL of play icon
  var pauseIcon = 'URL_OF_PAUSE_ICON'; // URL of pause icon
  var offset = window.innerHeight * 0.20; // 20% offset

  document.querySelectorAll('.myVideo').forEach((video, index) => {
    var button = document.querySelectorAll('.play-pause-button')[index];
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
      hasPlayed = false; // Allow video to be played again when scrolled into view
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