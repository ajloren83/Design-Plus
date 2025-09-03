document.addEventListener('DOMContentLoaded', function () {
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  var faqButtons = document.querySelectorAll('[data-faq]');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var icon = btn.querySelector('span');
      if (!icon) return;
      icon.textContent = icon.textContent === '+' ? '−' : '+';
    });
  });

  // Country selector dropdown functionality
  const countryDropdown = document.querySelector('.top-bar .dropdown');
  if (countryDropdown) {
    const dropdownToggle = countryDropdown.querySelector('.dropdown-toggle');
    const dropdownItems = countryDropdown.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const countryName = this.textContent;
        const countryValue = this.getAttribute('data-value');
        
        // Update the button text
        dropdownToggle.textContent = countryName;
        
        // You can add additional functionality here (e.g., change language, redirect, etc.)
        console.log('Selected country:', countryValue);
      });
    });
  }

  // Lazy-load CSS background images via data-bg
  const lazyBgEls = document.querySelectorAll('[data-bg]');
  if (lazyBgEls.length) {
    const loadBg = el => {
      const url = el.getAttribute('data-bg');
      if (!url) return;
      const current = getComputedStyle(el).backgroundImage;
      const sep = current && current !== 'none' ? ', ' : '';
      el.style.backgroundImage = `${current}${sep}url('${url}')`;
      el.removeAttribute('data-bg');
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadBg(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyBgEls.forEach(el => io.observe(el));
    } else {
      // Fallback: load immediately
      lazyBgEls.forEach(loadBg);
    }
  }

  // Init Swiper for Reviews
  if (window.Swiper) {
    new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        768: { spaceBetween: 24 },
        992: { slidesPerView: 1.7, spaceBetween: 24 },
      },
      navigation: false,
      pagination: {
        el: null,
      },
    });

    // Init Swiper for Partners (logo slider)
    new Swiper('.partners-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 0.75 * 16, // 12px in rem
      speed: 5000,
      loop: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      freeMode: {
        enabled: true,
        momentum: false,
      },
    });
  }
});




