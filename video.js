document.addEventListener("DOMContentLoaded", function() {
  var offset = window.innerHeight * 0.20; // 20% offset

  document.querySelectorAll('.video').forEach((video, index) => {
    var button = document.querySelectorAll('.play-pause_btn')[index];
    var playIcon = button.querySelector('.play_icon');
    var pauseIcon = button.querySelector('.pause_icon');
    var hasPlayed = false; // Track if the video has started playing

    // Play video when first in view
    function checkVideoVisibility() {
      var rect = video.getBoundingClientRect();
      var isVisible = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

      if (isVisible && !hasPlayed) {
        video.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        hasPlayed = true; // Mark video as having started
      }
    }

    // Change button state when video ends
    video.addEventListener('ended', () => {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      hasPlayed = false; // Allow video to be played again when scrolled into view
    });

    // Toggle play/pause on button click
    button.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        video.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    window.addEventListener('scroll', checkVideoVisibility);
    window.addEventListener('resize', checkVideoVisibility);

    checkVideoVisibility(); // Initial check
  });
});