  // figma prototype switch - essence app
  // Wait until the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    function togglePrototype(prototype) {
      const button1 = document.querySelector('.toggle_button_1');
      const button2 = document.querySelector('.toggle_button_2');
      const currentFill = document.querySelector('.toggle_button_fill_current');
      const iframe = document.querySelector('.figma_prototype'); // Target the iframe with class figma_prototype
      const desc1 = document.querySelector('.prototype_description_1');
      const desc2 = document.querySelector('.prototype_description_2');

      if (prototype === 'prototype1') {
          button1.classList.add('current');
          button1.classList.remove('enabled');

          button2.classList.add('enabled');
          button2.classList.remove('current');

          currentFill.style.transform = 'translateX(0)';
          iframe.src = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FwKB5Hs1ZmGupiBixHXbyQK%2FPrototype%3Fpage-id%3D30%253A1264%26node-id%3D3734-1828%26viewport%3D970%252C688%252C0.35%26t%3DKvD8JohQAd5aLcD2-1%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D3734%253A1828';

          desc1.style.display = 'block';
          desc2.style.display = 'none';
      } else if (prototype === 'prototype2') {
          button2.classList.add('current');
          button2.classList.remove('enabled');

          button1.classList.add('enabled');
          button1.classList.remove('current');

          currentFill.style.transform = 'translateX(6rem)';
          iframe.src = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FwKB5Hs1ZmGupiBixHXbyQK%2FPrototype%3Fpage-id%3D30%253A1912%26node-id%3D3734-2248%26viewport%3D1422%252C1655%252C0.86%26t%3De7lFSYrDt1HYqRqv-1%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D3734%253A2248';

          desc1.style.display = 'none';
          desc2.style.display = 'block';
      }
    }

    // Add click event listeners to the buttons
    document.querySelector('.toggle_button_1').addEventListener('click', function() {
      togglePrototype('prototype1');
    });

    document.querySelector('.toggle_button_2').addEventListener('click', function() {
      togglePrototype('prototype2');
    });
  });
