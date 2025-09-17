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
  // Simple image carousel for project images
  const projectImages = [
    'assets/images/project/project-1-1.png',
    'assets/images/project/project-1-2.png',
    'assets/images/project/project-1-3.png',
    'assets/images/project/project-1-4.png',
    'assets/images/project/project-1-5.png',
    'assets/images/project/project-1-6.png'
  ];
  
  // Initialize carousel for each project
  function initProjectCarousel(projectNumber) {
    const projectImage = document.getElementById(`projectImage${projectNumber}`);
    const prevBtn = document.getElementById(`prevBtn${projectNumber}`);
    const nextBtn = document.getElementById(`nextBtn${projectNumber}`);
    
    if (projectImage && prevBtn && nextBtn) {
      let currentImageIndex = 0;
      
      // Function to update image
      function updateImage() {
        projectImage.src = projectImages[currentImageIndex];
      }
      
      // Previous button click
      prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        updateImage();
      });
      
      // Next button click
      nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        updateImage();
      });
      
    }
  }
  
  // Initialize carousels for all projects
  for (let i = 1; i <= 6; i++) {
    initProjectCarousel(i);
  }

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
    
  }

  // Filter dropdown functionality
  const filterButtons = document.querySelectorAll('[data-dropdown]');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdownId = this.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId);
      const dropdownContainer = this.closest('.filter-dropdown');
      
      // Close all other dropdowns
      document.querySelectorAll('.filter-dropdown').forEach(container => {
        if (container !== dropdownContainer) {
          container.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      if (dropdownContainer) {
        dropdownContainer.classList.toggle('active');
        button.classList.toggle('active');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.filter-dropdown')) {
      document.querySelectorAll('.filter-dropdown').forEach(container => {
        container.classList.remove('active');
        const button = container.querySelector('.filter-btn');
        if (button) button.classList.remove('active');
      });
    }
  });

  // Handle dropdown item selection (only for regular dropdown items, not category-main)
  const dropdownItems = document.querySelectorAll('.dropdown-item:not(.category-main)');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dropdownContainer = this.closest('.filter-dropdown');
      const button = dropdownContainer.querySelector('.filter-btn');
      const buttonText = button.querySelector('span');
      
      // Remove selected class from all items in this dropdown
      dropdownContainer.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
        dropdownItem.classList.remove('selected');
      });
      
      // Add selected class to selected item
      this.classList.add('selected');
      
      // Add selected class to button and update text
      button.classList.add('selected');
      buttonText.textContent = this.textContent;
      
      // Close dropdown
      dropdownContainer.classList.remove('active');
    });
  });

  // Handle sub-item selection (don't close dropdown)
  const subItems = document.querySelectorAll('.sub-item');
  subItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dropdownContainer = this.closest('.filter-dropdown');
      const button = dropdownContainer.querySelector('.filter-btn');
      const buttonText = button.querySelector('span');
      
      // Remove selected class from all items in this dropdown
      dropdownContainer.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
        dropdownItem.classList.remove('selected');
      });
      
      // Add selected class to selected sub-item
      this.classList.add('selected');
      
      // Add selected class to button and update text
      button.classList.add('selected');
      buttonText.textContent = this.textContent;
      
      // Close dropdown after sub-item selection
      dropdownContainer.classList.remove('active');
    });
  });

  // Handle mobile clicks for main categories to show sub-categories
  const categoryMains = document.querySelectorAll('.category-main');
  categoryMains.forEach(categoryMain => {
    categoryMain.addEventListener('click', function(e) {
      // Only on mobile (screen width <= 991px)
      if (window.innerWidth <= 991) {
        e.preventDefault();
        
        const dropdownCategory = this.closest('.dropdown-category');
        const dropdownContainer = this.closest('.filter-dropdown');
        
        // Remove active class from all categories in this dropdown
        dropdownContainer.querySelectorAll('.dropdown-category').forEach(cat => {
          cat.classList.remove('active');
        });
        
        // Toggle active class on clicked category
        dropdownCategory.classList.toggle('active');
      }
    });
  });


  // Project like button functionality
  const likeButtons = document.querySelectorAll('.project-like-btn');
  likeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const svg = this.querySelector('svg');
      const path = svg.querySelector('path');
      
      // Toggle like state
      if (this.classList.contains('active')) {
        // Remove active state
        this.classList.remove('active');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
      } else {
        // Add active state
        this.classList.add('active');
        path.setAttribute('fill', 'currentColor');
        path.removeAttribute('stroke');
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
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-container .btn');
  
  if (searchInput && searchButton) {
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
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

// Observer to automatically add banner when dp-original-banner class is added
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const target = mutation.target;
      if (target.classList.contains('dp-original-banner') && !target.querySelector('.banner-svg')) {
        // Create banner HTML
        const bannerHTML = `
          <div class="banner-svg">
            <svg viewBox="0 0 184 87" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="75" width="13.126" height="11.9167" fill="var(--clr-gold-900)"/>
              <rect x="165.857" width="17.4336" height="7.9848" fill="var(--clr-gold-900)"/>
              <path d="M0 59.6177L129.554 0H183.291L0 86.8279V59.6177Z" fill="var(--clr-gold-600)"/>
            </svg>
          </div>
          <div class="banner-text">DP Originals</div>
        `;
        
        // Insert banner as first child
        target.insertAdjacentHTML('afterbegin', bannerHTML);
      }
    }
  });
});

// Start observing all project cards
document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    
    // Check if card already has dp-original-banner class on page load
    if (card.classList.contains('dp-original-banner') && !card.querySelector('.banner-svg')) {
      // Create banner HTML
      const bannerHTML = `
        <div class="banner-svg">
          <svg viewBox="0 0 184 87" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="75" width="13.126" height="11.9167" fill="var(--clr-gold-900)"/>
            <rect x="165.857" width="17.4336" height="7.9848" fill="var(--clr-gold-900)"/>
            <path d="M0 59.6177L129.554 0H183.291L0 86.8279V59.6177Z" fill="var(--clr-gold-600)"/>
          </svg>
        </div>
        <div class="banner-text">DP Originals</div>
      `;
      
      // Insert banner as first child
      card.insertAdjacentHTML('afterbegin', bannerHTML);
    }
  });
});
