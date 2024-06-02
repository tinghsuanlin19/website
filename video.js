document.addEventListener("DOMContentLoaded", function() {
  // Define icon URLs for light and dark themes
  var playIconLight = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c79405109ee93b0840805_icon_play_dark.svg';
  var pauseIconLight = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c793fa7680cd7c30b1816_icon_pause_dark.svg';
  var playIconDark = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c79405109ee93b0840805_icon_play_dark.svg'; // Replace with the actual URL of the dark theme play icon
  var pauseIconDark = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c793fa7680cd7c30b1816_icon_pause_dark.svg'; // Replace with the actual URL of the dark theme pause icon

  var offset = window.innerHeight * 0.20; // 20% offset

  function getCurrentTheme() {
    return document.body.getAttribute('data-theme') || 'light';
  }

  function getIcon(iconType) {
    var theme = getCurrentTheme();
    if (theme === 'dark') {
      return iconType === 'play' ? playIconDark : pauseIconDark;
    } else {
      return iconType === 'play' ? playIconLight : pauseIconLight;
    }
  }

  document.querySelectorAll('.myVideo').forEach((video, index) => {
    var button = document.querySelectorAll('.play-pause-button')[index];
    var hasPlayed = false; // Track if the video has started playing

    // Play video when first in view
    function checkVideoVisibility() {
      var rect = video.getBoundingClientRect();
      var isVisible = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

      if (isVisible && !hasPlayed) {
        video.play();
        button.src = getIcon('pause');
        hasPlayed = true; // Mark video as having started
      }
    }

    // Change button state when video ends
    video.addEventListener('ended', () => {
      button.src = getIcon('play');
      hasPlayed = false; // Allow video to be played again when scrolled into view
    });

    // Toggle play/pause on button click
    button.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        button.src = getIcon('pause');
      } else {
        video.pause();
        button.src = getIcon('play');
      }
    });

    window.addEventListener('scroll', checkVideoVisibility);
    window.addEventListener('resize', checkVideoVisibility);

    checkVideoVisibility(); // Initial check
  });
});
