// Navbar scroll effect
const nav = document.getElementById('nav');
const navInner = document.getElementById('nav-inner');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('bg-kruxia-black/95', 'backdrop-blur-sm');
    navInner.classList.add('border-kruxia-border');
  } else {
    nav.classList.remove('bg-kruxia-black/95', 'backdrop-blur-sm');
    navInner.classList.remove('border-kruxia-border');
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

hamburger.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  hamburgerIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
  hamburger.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    hamburger.setAttribute('aria-label', 'Open menu');
  });
});

// Example tabs functionality
document.querySelectorAll('.example-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetPanel = tab.getAttribute('data-tab');

    // Update active tab
    document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show target panel, hide others
    document.querySelectorAll('.example-panel').forEach(panel => {
      if (panel.getAttribute('data-panel') === targetPanel) {
        panel.classList.remove('hidden');
        panel.classList.add('active');
      } else {
        panel.classList.add('hidden');
        panel.classList.remove('active');
      }
    });
  });
});
