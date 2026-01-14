(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion) {
      initDataStream();
    }

    initReveal();
    initSmoothScroll();
    initContactForm();
  });

  /* =========================================
     Subtle Data Stream Animation
     ========================================= */
  function initDataStream() {
    const canvas = document.getElementById('data-stream');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let streams = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStreams();
    }

    class Stream {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * -1; // Start above screen
        this.speed = Math.random() * 0.5 + 0.1; // Very slow
        this.length = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.1 + 0.05; // Very faint
        this.width = Math.random() * 1 + 0.5;
      }

      update() {
        this.y += this.speed;
        if (this.y > height + this.length) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        // Gradient for fading tail
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
        gradient.addColorStop(0, `rgba(88, 166, 255, 0)`);
        gradient.addColorStop(1, `rgba(88, 166, 255, ${this.opacity})`); // Blue tint

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.length);
        ctx.stroke();
      }
    }

    function initStreams() {
      streams = [];
      const count = Math.floor(width / 20); // Density
      for (let i = 0; i < count; i++) {
        streams.push(new Stream());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      streams.forEach(stream => {
        stream.update();
        stream.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
  }

  /* =========================================
     Reveal on Scroll
     ========================================= */
  function initReveal() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }

  /* =========================================
     Smooth Scroll
     ========================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* =========================================
     Contact Form Handling
     ========================================= */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const feedback = form.querySelector('.form-feedback');
    const submitButton = form.querySelector('button[type="submit"]');
    const honeypot = form.querySelector('input[name="website"]');

    // EmailJS keys from existing code
    const serviceId = form.dataset.emailjsService;
    const templateId = form.dataset.emailjsTemplate;
    const publicKey = form.dataset.emailjsPublicKey;
    const toEmail = form.dataset.emailjsToEmail;
    const fromEmail = form.dataset.emailjsFromEmail;

    function setFeedback(message, type) {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.className = 'form-feedback ' + (type || '');
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (honeypot && honeypot.value) {
        return; // Bot detected
      }

      if (submitButton) submitButton.disabled = true;
      setFeedback('Sending...', '');

      const formData = new FormData(form);

      const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: formData.get('name'),
          from_email: formData.get('email'),
          company: formData.get('company'),
          message: formData.get('message'),
          reply_to: formData.get('email'),
          to_email: toEmail
        }
      };

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });

        if (response.ok) {
          setFeedback('Message sent. We will be in touch.', 'success');
          form.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (error) {
        console.error('Email error:', error);
        setFeedback('Something went wrong. Please try again later.', 'error');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
})();
