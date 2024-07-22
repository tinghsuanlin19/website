  // figma prototype switch - funfacts app
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
          iframe.src = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FpYz4umLC6uIt4lGcKbfLq0%2FFunFacts-App%3Fpage-id%3D2388%253A72%26node-id%3D2388-977%26viewport%3D286%252C-486%252C0.49%26t%3DodXm6t3y87KFFGqX-1%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D2388%253A977';

          desc1.style.display = 'block';
          desc2.style.display = 'none';
      } else if (prototype === 'prototype2') {
          button2.classList.add('current');
          button2.classList.remove('enabled');

          button1.classList.add('enabled');
          button1.classList.remove('current');

          currentFill.style.transform = 'translateX(7rem)';
          iframe.src = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FpYz4umLC6uIt4lGcKbfLq0%2FFunFacts-App%3Fpage-id%3D2018%253A5417%26node-id%3D4966-2820%26viewport%3D707%252C1620%252C0.42%26t%3DOH8nl28ZB6jWe2WB-1%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D4966%253A2820';

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
