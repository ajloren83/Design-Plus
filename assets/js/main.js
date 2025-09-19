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

    // Init Swiper for Project Gallery Side Images
    const sideImagesSwiper = new Swiper('.side-images-swiper', {
      direction: 'vertical',
      slidesPerView: 4.5,
      spaceBetween: 16, // 1rem = 16px
      freeMode: true,
      watchSlidesProgress: true,
      centeredSlides: false,
      on: {
        slideChange: function() {
          // Update main image when side image is clicked
          const activeSlide = this.slides[this.activeIndex];
          if (activeSlide) {
            const img = activeSlide.querySelector('img');
            if (img) {
              const mainImage = document.getElementById('mainImage');
              const imageCounter = document.querySelector('.image-counter');
              if (mainImage) {
                mainImage.src = img.src;
                mainImage.alt = img.alt;
              }
              if (imageCounter) {
                imageCounter.textContent = `${this.activeIndex + 1}/${this.slides.length}`;
              }
            }
          }
        }
      }
    });

    // Add click handlers to side images
    const sideImageSlides = document.querySelectorAll('.side-image-slide');
    sideImageSlides.forEach((slide, index) => {
      slide.addEventListener('click', function() {
        // Update current image index
        currentImageIndex = index;
        
        // Update main image
        const img = this.querySelector('img');
        if (img) {
          const mainImage = document.getElementById('mainImage');
          const imageCounter = document.querySelector('.image-counter');
          if (mainImage) {
            mainImage.src = img.src;
            mainImage.alt = img.alt;
          }
          if (imageCounter) {
            imageCounter.textContent = `${index + 1}/${sideImageSlides.length}`;
          }
        }
        
        // Scroll to show the selected image fully
        // For the last image, we need to scroll more to show it completely
        if (index === sideImageSlides.length - 1) {
          // For the last image, scroll to show it fully
          sideImagesSwiper.slideTo(index, 300);
          // Additional scroll to ensure last image is fully visible
          setTimeout(() => {
            const swiperWrapper = sideImagesSwiper.wrapperEl;
            const slideHeight = sideImageSlides[index].offsetHeight;
            const spaceBetween = 16; // 1rem = 16px
            const totalScroll = (index * (slideHeight + spaceBetween)) + slideHeight;
            swiperWrapper.style.transform = `translate3d(0px, -${totalScroll - sideImagesSwiper.height}px, 0px)`;
          }, 50);
        } else {
          sideImagesSwiper.slideTo(index, 300);
        }
        
        // Update active slide after a short delay
        setTimeout(() => {
          sideImageSlides.forEach(s => s.classList.remove('swiper-slide-active'));
          this.classList.add('swiper-slide-active');
        }, 50);
      });
    });

    // Set first slide as active
    if (sideImageSlides.length > 0) {
      sideImageSlides[0].classList.add('swiper-slide-active');
    }

    // Navigation buttons functionality
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    const mainImage = document.getElementById('mainImage');
    const imageCounter = document.querySelector('.image-counter');
    let currentImageIndex = 0;

    function updateMainImage(index) {
      if (sideImageSlides[index]) {
        const img = sideImageSlides[index].querySelector('img');
        if (img && mainImage) {
          mainImage.src = img.src;
          mainImage.alt = img.alt;
        }
        if (imageCounter) {
          imageCounter.textContent = `${index + 1}/${sideImageSlides.length}`;
        }
        
        // Scroll to show the selected image fully
        // For the last image, we need to scroll more to show it completely
        if (index === sideImageSlides.length - 1) {
          // For the last image, scroll to show it fully
          sideImagesSwiper.slideTo(index, 300);
          // Additional scroll to ensure last image is fully visible
          setTimeout(() => {
            const swiperWrapper = sideImagesSwiper.wrapperEl;
            const slideHeight = sideImageSlides[index].offsetHeight;
            const spaceBetween = 16; // 1rem = 16px
            const totalScroll = (index * (slideHeight + spaceBetween)) + slideHeight;
            swiperWrapper.style.transform = `translate3d(0px, -${totalScroll - sideImagesSwiper.height}px, 0px)`;
          }, 50);
        } else {
          sideImagesSwiper.slideTo(index, 300);
        }
        
        // Update active slide after a short delay to ensure Swiper has updated
        setTimeout(() => {
          sideImageSlides.forEach(s => s.classList.remove('swiper-slide-active'));
          if (sideImageSlides[index]) {
            sideImageSlides[index].classList.add('swiper-slide-active');
          }
        }, 50);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + sideImageSlides.length) % sideImageSlides.length;
        updateMainImage(currentImageIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % sideImageSlides.length;
        updateMainImage(currentImageIndex);
      });
    }

    // Fullscreen button functionality
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', function() {
        // Get current image and counter
        const mainImage = document.getElementById('mainImage');
        const imageCounter = document.querySelector('.image-counter');
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryModalCounter');
        
        if (mainImage && modalImage) {
          modalImage.src = mainImage.src;
          modalImage.alt = mainImage.alt;
        }
        
        if (imageCounter && modalCounter) {
          modalCounter.textContent = imageCounter.textContent;
        }
        
        const modal = new bootstrap.Modal(document.getElementById('fullscreenGalleryModal'));
        modal.show();
      });
    }

    // Modal navigation functionality
    const modalPrevBtn = document.getElementById('galleryModalPrevBtn');
    const modalNextBtn = document.getElementById('galleryModalNextBtn');
    const modalImage = document.getElementById('galleryModalImage');
    const modalCounter = document.getElementById('galleryModalCounter');

    function updateModalImage(index) {
      if (sideImageSlides[index]) {
        const img = sideImageSlides[index].querySelector('img');
        if (img && modalImage) {
          modalImage.src = img.src;
          modalImage.alt = img.alt;
        }
        if (modalCounter) {
          modalCounter.textContent = `${index + 1}/${sideImageSlides.length}`;
        }
      }
    }

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + sideImageSlides.length) % sideImageSlides.length;
        updateModalImage(currentImageIndex);
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % sideImageSlides.length;
        updateModalImage(currentImageIndex);
      });
    }
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
    // Don't interfere with Bootstrap dropdowns
    if (!e.target.closest('.filter-dropdown') && !e.target.closest('.navbar .dropdown')) {
      document.querySelectorAll('.filter-dropdown').forEach(container => {
        container.classList.remove('active');
        const button = container.querySelector('.filter-btn');
        if (button) button.classList.remove('active');
      });
    }
  });

  // Handle dropdown item selection (only for regular dropdown items, not category-main, not Bootstrap navbar dropdowns)
  const dropdownItems = document.querySelectorAll('.filter-dropdown .dropdown-item:not(.category-main)');
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
  const subItems = document.querySelectorAll('.filter-dropdown .sub-item');
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
  const searchResults = document.getElementById('searchResults');
  const searchQuery = document.querySelector('.search-query');
  
  if (searchInput && searchButton && searchResults && searchQuery) {
    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        // Update search query text with quotes
        searchQuery.textContent = `"${query}"`;
        // Show search results section
        searchResults.style.display = 'block';
        // Scroll to search results with offset for fixed navigation
        const navHeight = 100; // Navigation height + 20px margin
        const elementPosition = searchResults.offsetTop;
        const offsetPosition = elementPosition - navHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Hide search results if no query
        searchResults.style.display = 'none';
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

// Country code dropdown functionality
function initCountryCodeDropdown() {
  const countryCode = document.querySelector('.country-code');
  if (!countryCode) return;

  // Create dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'country-dropdown';
  dropdown.innerHTML = `
    <div class="country-dropdown-menu">
      <div class="country-option" data-code="+91">🇮🇳 +91</div>
      <div class="country-option" data-code="+1">🇺🇸 +1</div>
      <div class="country-option" data-code="+44">🇬🇧 +44</div>
      <div class="country-option" data-code="+65">🇸🇬 +65</div>
      <div class="country-option" data-code="+60">🇲🇾 +60</div>
      <div class="country-option" data-code="+62">🇮🇩 +62</div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .country-code {
      position: relative;
      cursor: pointer;
    }
    .country-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0.5rem;
      width: max-content;
      background: var(--clr-neutral-0);
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: none;
    }
    .country-dropdown-menu {
      padding: 0.5rem 0;
    }
    .country-option {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .country-option:hover {
      background: var(--clr-gold-50);
    }
  `;
  document.head.appendChild(style);

  // Insert dropdown after country code
  countryCode.parentNode.insertBefore(dropdown, countryCode.nextSibling);

  // Toggle dropdown
  countryCode.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
  });

  // Handle option selection
  dropdown.addEventListener('click', function(e) {
    if (e.target.classList.contains('country-option')) {
      const code = e.target.dataset.code;
      const text = e.target.textContent;
      countryCode.querySelector('.country-code-text').textContent = code;
      dropdown.style.display = 'none';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    dropdown.style.display = 'none';
  });
}

// Initialize country code dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initCountryCodeDropdown();
  initEnquireModal();
});

// Enquire Modal functionality
function initEnquireModal() {
  // File upload functionality
  const fileChooseBtn = document.querySelector('.file-choose-btn');
  const fileInput = document.querySelector('.file-input');
  const fileText = document.querySelector('.file-text');
  
  if (fileChooseBtn && fileInput && fileText) {
    fileChooseBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        fileText.textContent = this.files[0].name;
        fileText.classList.add('has-file');
      } else {
        fileText.textContent = 'No file chosen';
        fileText.classList.remove('has-file');
      }
    });
  }
  
  // Country code dropdown for enquire modal
  const enquireCountryCode = document.querySelector('.enquire-modal .country-code');
  if (enquireCountryCode) {
    initEnquireCountryCodeDropdown();
  }
  
  // Custom theme dropdown
  initCustomThemeDropdown();
  
  // Custom view dropdown
  initCustomViewDropdown();
}

// Initialize custom theme dropdown
function initCustomThemeDropdown() {
  const dropdown = document.getElementById('themeDropdown');
  const toggle = document.getElementById('themeToggle');
  const menu = document.getElementById('themeMenu');
  const selected = document.getElementById('themeSelected');
  const hiddenInput = document.getElementById('enquireTheme');
  const items = document.querySelectorAll('.custom-dropdown-item');

  if (!dropdown || !toggle || !menu || !selected || !hiddenInput) return;

  // Toggle dropdown
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Handle item selection
  items.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Update selected text
      selected.textContent = item.textContent;
      
      // Update hidden input value
      hiddenInput.value = item.dataset.value;
      
      // Update selected state
      items.forEach(function(i) { i.classList.remove('selected'); });
      item.classList.add('selected');
      
      // Close dropdown
      dropdown.classList.remove('open');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close dropdown on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
}

// Initialize custom view dropdown
function initCustomViewDropdown() {
  const dropdown = document.getElementById('viewDropdown');
  const toggle = document.getElementById('viewToggle');
  const menu = document.getElementById('viewMenu');
  const selected = document.getElementById('viewSelected');
  const hiddenInput = document.getElementById('enquireView');
  const items = document.querySelectorAll('#viewMenu .custom-dropdown-item');

  if (!dropdown || !toggle || !menu || !selected || !hiddenInput) return;

  // Toggle dropdown
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Handle item selection
  items.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Update selected text
      selected.textContent = item.textContent;
      
      // Update hidden input value
      hiddenInput.value = item.dataset.value;
      
      // Update selected state
      items.forEach(function(i) { i.classList.remove('selected'); });
      item.classList.add('selected');
      
      // Close dropdown
      dropdown.classList.remove('open');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close dropdown on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
}

// Country code dropdown for enquire modal
function initEnquireCountryCodeDropdown() {
  const countryCode = document.querySelector('.enquire-modal .country-code');
  if (!countryCode) return;

  // Create dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'country-dropdown';
  dropdown.innerHTML = `
    <div class="country-dropdown-menu">
      <div class="country-option" data-code="+91">🇮🇳 +91</div>
      <div class="country-option" data-code="+1">🇺🇸 +1</div>
      <div class="country-option" data-code="+44">🇬🇧 +44</div>
      <div class="country-option" data-code="+65">🇸🇬 +65</div>
      <div class="country-option" data-code="+60">🇲🇾 +60</div>
      <div class="country-option" data-code="+62">🇮🇩 +62</div>
      <div class="country-option" data-code="+66">🇹🇭 +66</div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .enquire-modal .country-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--clr-neutral-0);
      border: 1px solid var(--clr-cream-300);
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: none;
    }
    .enquire-modal .country-dropdown-menu {
      padding: 0.5rem 0;
    }
    .enquire-modal .country-option {
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: var(--fs-h6);
      color: var(--clr-neutral-900);
      transition: background-color 0.3s ease;
    }
    .enquire-modal .country-option:hover {
      background: var(--clr-cream-200);
    }
  `;
  document.head.appendChild(style);

  // Insert dropdown after country code
  countryCode.parentNode.insertBefore(dropdown, countryCode.nextSibling);
  countryCode.parentNode.style.position = 'relative';

  // Toggle dropdown
  countryCode.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
  });

  // Handle option selection
  dropdown.addEventListener('click', function(e) {
    if (e.target.classList.contains('country-option')) {
      const code = e.target.dataset.code;
      const text = e.target.textContent;
      countryCode.querySelector('.country-code-text').textContent = code;
      dropdown.style.display = 'none';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    dropdown.style.display = 'none';
  });
}

// Custom Dropdown Functionality for Estimate Form
function initializeCustomDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.custom-dropdown-toggle');
    const menu = dropdown.querySelector('.custom-dropdown-menu');
    const items = dropdown.querySelectorAll('.custom-dropdown-item');
    const selectedSpan = dropdown.querySelector('span[id$="Selected"]');
    
    if (!toggle || !menu || !selectedSpan) return;
    
    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    
    // Handle item selection
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = item.getAttribute('data-value');
        const text = item.textContent;
        
        // Update selected text
        selectedSpan.textContent = text;
        
        // Update selected state
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        // Close dropdown
        dropdown.classList.remove('open');
        
        // Trigger change event for form validation
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
}

// Initialize custom dropdowns when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeCustomDropdowns();
});
