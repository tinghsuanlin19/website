var Webflow = Webflow || [];
Webflow.push(function() {
    var l = $('#gallerySlider .w-slider-arrow-left');
    var r = $('#gallerySlider .w-slider-arrow-right');
    $('#gallerySlider')
        .on('click', '.back-button', function() {
          l.trigger('tap');
        })
        .on('click', '.next-button', function() {
          r.trigger('tap');
        });
		});