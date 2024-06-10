document.addEventListener("DOMContentLoaded", function() {
  // URLs for light and dark theme icons
  var lightPlayIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665ca69b536e722683540799_icon_play_light.svg';
  var darkPlayIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/665c79405109ee93b0840805_icon_play_dark.svg';
  var lightPauseIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/6666ac9d538404cec75972ec_icon_pause_light.svg';
  var darkPauseIcon = 'https://uploads-ssl.webflow.com/5dde919caf313a3410908cfd/6666ac9d80a915f45359304c_icon_pause_dark.svg';
  var offset = window.innerHeight * 0.10; // 20% offset

  document.querySelectorAll('.w-video').forEach((video, index) => {
    var button = document.querySelectorAll('.play-pause_icon')[index];
    var hasPlayed = false; // Track if the video has started playing

    // Function to get the correct icon based on the theme
    function getIcon(iconType) {
      var theme = button.getAttribute('data-theme');
      if (theme === 'dark') {
        return iconType === 'play' ? darkPlayIcon : darkPauseIcon;
      } else {
        return iconType === 'play' ? lightPlayIcon : lightPauseIcon;
      }
    }

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
