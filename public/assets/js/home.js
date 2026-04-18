(function () {
  const heroTrack = document.getElementById('heroBannerTrack');
  if (heroTrack && typeof window.Swiper === 'function') {
    const heroSlideCount = heroTrack.querySelectorAll('.swiper-slide').length;

    new window.Swiper(heroTrack, {
      loop: heroSlideCount > 1,
      speed: 700,
      allowTouchMove: heroSlideCount > 1,
      autoplay:
        heroSlideCount > 1
          ? {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false,
      pagination: {
        el: heroTrack.querySelector('.swiper-pagination'),
        clickable: heroSlideCount > 1,
      },
    });
  }

  const testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack && typeof window.Swiper === 'function') {
    const testimonialSlideCount = testimonialTrack.querySelectorAll('.swiper-slide').length;

    new window.Swiper(testimonialTrack, {
      loop: testimonialSlideCount > 1,
      speed: 650,
      spaceBetween: 24,
      slidesPerView: 1,
      autoplay:
        testimonialSlideCount > 1
          ? {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false,
      navigation: {
        prevEl: '#testimonialPrev',
        nextEl: '#testimonialNext',
      },
      pagination: {
        el: testimonialTrack.querySelector('.swiper-pagination'),
        clickable: testimonialSlideCount > 1,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }
})();
