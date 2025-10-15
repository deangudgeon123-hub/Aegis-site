document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
  });

  reveals.forEach((el) => observer.observe(el));

  const scrollLinks = document.querySelectorAll('a[href^="#"], [data-scroll]');
  const header = document.querySelector('.site-header');

  function scrollToTarget(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 12;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const dataTarget = link.getAttribute('data-scroll');
      const targetSelector = dataTarget || (href && href.startsWith('#') ? href : null);

      if (targetSelector) {
        event.preventDefault();
        scrollToTarget(targetSelector);
      }
    });
  });

  const waitlistForm = document.querySelector('.waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = waitlistForm.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        waitlistForm.classList.add('submitted');
        waitlistForm.innerHTML = '<span class="confirmation">You\'re locked in. Expect a secure transmission soon.</span>';
      }
    });
  }
});
