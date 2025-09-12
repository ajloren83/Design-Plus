document.addEventListener('DOMContentLoaded', function () {
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
  // Auto year for footer copyright if placeholder exists
  var footerYear = document.querySelector('[data-current-year]');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
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
      spaceBetween: 0.75 * 16, 
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

  // Renovation Ideas Page Functionality
  // Categories carousel functionality with Swiper
  if (window.Swiper) {
    const categoriesSwiper = new Swiper('.categories-swiper', {
      slidesPerView: 6,
      spaceBetween: 12,
      speed: 600,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      navigation: {
        nextEl: '.categories-next',
        prevEl: '.categories-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 3,
          spaceBetween: 8,
          navigation: {
            enabled: false,
          },
        },
        480: {
          slidesPerView: 4,
          spaceBetween: 12,
          navigation: {
            enabled: false,
          },
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 16,
          navigation: {
            enabled: true,
          },
        },
        992: {
          slidesPerView: 6,
          spaceBetween: 16,
          navigation: {
            enabled: true,
          },
        },
      },
    });
    
    // Debug: Check if navigation buttons are found
    console.log('Categories Swiper initialized:', categoriesSwiper);
    console.log('Navigation buttons found:', {
      prev: document.querySelector('.categories-prev'),
      next: document.querySelector('.categories-next')
    });
  }

  // Project like button functionality
  const likeButtons = document.querySelectorAll('.project-like-btn');
  likeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const svg = this.querySelector('svg');
      const path = svg.querySelector('path');
      
      // Toggle like state
      if (path.getAttribute('fill') === 'currentColor') {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        this.style.color = 'var(--clr-neutral-600)';
      } else {
        path.setAttribute('fill', 'currentColor');
        path.removeAttribute('stroke');
        this.style.color = 'var(--clr-gold-600)';
      }
    });
  });

  // Inspiration tags functionality
  const inspirationTags = document.querySelectorAll('.inspiration-tag');
  inspirationTags.forEach(tag => {
    tag.addEventListener('click', function() {
      // Remove active class from all tags
      inspirationTags.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tag
      this.classList.add('active');
      
      // You can add filtering functionality here
      console.log('Selected inspiration:', this.textContent);
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-container .btn');
  
  if (searchInput && searchButton) {
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        console.log('Searching for:', query);
        // Add search functionality here
      }
    };
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // Filter functionality
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      console.log('Filter changed:', this.previousElementSibling.textContent, this.value);
      // Add filtering functionality here
    });
  });

  // Mobile filter toggle
  const filterToggle = document.querySelector('[data-bs-target="#filterCollapse"]');
  if (filterToggle) {
    filterToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  }
});




