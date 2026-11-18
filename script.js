document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? 'CLOSE ✕' : 'MENU ☰';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'MENU ☰';
      });
    });
  }

  // Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');
      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox Modal for Gallery Photos
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const desc = item.querySelector('.gallery-desc')?.textContent || '';

      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Contact Form Handling
  const contactForm = document.getElementById('ravenContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName')?.value.trim() || '';
      const lastName = document.getElementById('lastName')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const service = document.getElementById('serviceType')?.value || 'Tile Work & Remodeling';
      const location = document.getElementById('location')?.value.trim() || 'Greater Portland Area';
      const message = document.getElementById('message')?.value.trim() || '';

      const subject = encodeURIComponent(
        `New Remodeling Estimate Request: ${service} (${firstName} ${lastName} - ${location})`
      );
      const body = encodeURIComponent(
        `Name: ${firstName} ${lastName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Project Type: ${service}\n` +
        `City / Area: ${location}\n\n` +
        `Project Details:\n${message}`
      );

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML =
          `Thank you, <strong>${firstName}</strong>! Your project inquiry for <strong>${service}</strong> is ready. ` +
          `We have opened your email client to send directly to <strong>rayen@ravenremodeling.org</strong> & <strong>nicolas@ravenremodeling.org</strong>, ` +
          `or you can call us anytime at <a href="tel:+15039669834" style="text-decoration:underline;">(503) 966-9834</a>.`;
      }

      window.location.href = `mailto:rayen@ravenremodeling.org,nicolas@ravenremodeling.org?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }
});
