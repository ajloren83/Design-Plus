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
});


