document.addEventListener("DOMContentLoaded", function() {
  var playIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/6654494e90c2fe397f246315_play_circle.svg'; // URL of play icon
  var pauseIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/6654494d316582205ed4f036_pause_circle.svg'; // URL of pause icon
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
