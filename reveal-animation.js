document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.will-change');

    // Set initial styles for elements with the .will-change class
    elements.forEach(element => {
        if (getComputedStyle(element).willChange.includes('transform')) {
            element.style.transform = "translateY(0.8em)";
        }
        element.style.opacity = "0";
    });

    function handleScroll() {
        const windowHeight = window.innerHeight;
        const offset = windowHeight * 0.10; // 10% offset

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementOffset = rect.top;
            const willChange = getComputedStyle(element).willChange;

            if (elementOffset < windowHeight - offset) {
                if (willChange.includes('transform')) {
                    element.style.transform = "translateY(0em)";
                }
                element.style.opacity = "1";
            } else {
                if (willChange.includes('transform')) {
                    element.style.transform = "translateY(50px)";
                }
                element.style.opacity = "0";
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case the elements are already in view
});