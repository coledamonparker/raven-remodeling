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

  // Floating "Get a Quote" Button: hide cleanly once user reaches #contact
  const floatingQuoteBtn = document.getElementById('floatingQuoteBtn');
  const contactSection = document.getElementById('contact');

  if (floatingQuoteBtn && contactSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          floatingQuoteBtn.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(contactSection);
  }

  // Gallery Filtering & Horizontal Carousel Scroll Controls
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrevBtn = document.getElementById('galleryPrev');
  const galleryNextBtn = document.getElementById('galleryNext');

  const getVisibleItems = () =>
    galleryItems.filter((item) => !item.classList.contains('hidden'));

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

      if (galleryTrack) {
        galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });
  });

  if (galleryTrack && galleryPrevBtn && galleryNextBtn) {
    const scrollStep = 340;
    galleryPrevBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
    galleryNextBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  // Clickable Lightbox Modal with Prev/Next Navigation
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxIndex = 0;

  const showLightboxAt = (index) => {
    const visible = getVisibleItems();
    if (!visible.length || !lightbox || !lightboxImg) return;
    currentLightboxIndex = (index + visible.length) % visible.length;
    const item = visible[currentLightboxIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title')?.textContent || '';
    const desc = item.querySelector('.gallery-desc')?.textContent || '';

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) showLightboxAt(idx);
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxAt(currentLightboxIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxAt(currentLightboxIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxAt(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxAt(currentLightboxIndex + 1);
  });

  // Contact / Quote Form Handling
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
        `New Quote Request: ${service} (${firstName} ${lastName} - ${location})`
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
          `Thank you, <strong>${firstName}</strong>! Your quote request for <strong>${service}</strong> is ready. ` +
          `We opened your email client to send directly to <strong>rayen@ravenremodeling.org</strong> & <strong>nicolas@ravenremodeling.org</strong>, ` +
          `or call us anytime at <a href="tel:+15039669834" style="text-decoration:underline;">(503) 966-9834</a>.`;
      }

      window.location.href = `mailto:rayen@ravenremodeling.org,nicolas@ravenremodeling.org?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }
});
