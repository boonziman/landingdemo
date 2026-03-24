/* ============================================================
   Synapse AI — Site JavaScript  (v3 — Premium)
   Navigation, Tabs, Scroll Reveals, Parallax, Smooth Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ═══════════════════════════════════════════════════════════
     1. Mobile Menu Toggle
     ═══════════════════════════════════════════════════════════ */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      mobileMenu.classList.toggle('flex', isHidden);
      const icon = mobileToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     2. Feature Tabs (Deep-Dive Section)
     ═══════════════════════════════════════════════════════════ */
  const featureTabs = document.querySelectorAll('.feature-tab');

  featureTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      featureTabs.forEach((t) => {
        t.classList.remove('active', 'border-primary', 'bg-primary/[0.03]');
        t.classList.add('border-transparent');
        const h = t.querySelector('h4');
        const d = t.querySelector('p');
        if (h) { h.classList.remove('text-white'); h.classList.add('text-muted'); }
        if (d) d.classList.add('opacity-60');
      });

      tab.classList.add('active', 'border-primary', 'bg-primary/[0.03]');
      tab.classList.remove('border-transparent');
      const h = tab.querySelector('h4');
      const d = tab.querySelector('p');
      if (h) { h.classList.add('text-white'); h.classList.remove('text-muted'); }
      if (d) d.classList.remove('opacity-60');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     3. Scroll Reveal — Unified Observer
     Handles both .reveal-on-scroll and .scroll-reveal elements.
     Uses staggered delays via CSS transition-delay on each element.
     ═══════════════════════════════════════════════════════════ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a tiny delay based on data attribute or CSS transition-delay
            const delay = entry.target.style.transitionDelay || '0ms';
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add('active', 'visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal-on-scroll, .scroll-reveal').forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback — show everything immediately
    document.querySelectorAll('.reveal-on-scroll, .scroll-reveal').forEach((el) => {
      el.classList.add('active', 'visible');
    });
  }

  /* ═══════════════════════════════════════════════════════════
     4. Parallax Effect for Mockup Frame (desktop only)
     ═══════════════════════════════════════════════════════════ */
  const mockupFrame = document.getElementById('mockup-frame');
  const isMobile = window.innerWidth < 768;

  if (mockupFrame && !isMobile && !prefersReducedMotion) {
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xNorm = (clientX / innerWidth - 0.5);
        const yNorm = (clientY / innerHeight - 0.5);

        mockupFrame.style.transform =
          `translateY(${yNorm * -6}px) rotateX(${yNorm * 2}deg) rotateY(${xNorm * 2}deg)`;

        ticking = false;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     5. Smooth-Scroll for Anchor Links
     ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      // Only handle same-page hash links
      if (href.startsWith('#') || href.startsWith('/#')) {
        const hash = '#' + href.split('#')[1];
        if (!hash || hash === '#') return;

        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();

          // Close mobile menu
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            const icon = mobileToggle?.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'menu';
          }

          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, hash);
        }
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     6. Active Nav Highlighting on Scroll
     ═══════════════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href*="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    let scrollTicking = false;

    const highlightNav = () => {
      const scrollY = window.scrollY + 150;

      sections.forEach((section) => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('text-white');
            link.classList.add('text-muted');
            if (link.getAttribute('href').includes('#' + id)) {
              link.classList.add('text-white');
              link.classList.remove('text-muted');
            }
          });
        }
      });
      scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(highlightNav);
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     7. Navbar Background on Scroll
     ═══════════════════════════════════════════════════════════ */
  const header = document.querySelector('header');
  if (header) {
    const headerParent = header.closest('.relative, [class*="bg-transparent"]');
    let navTicking = false;

    window.addEventListener('scroll', () => {
      if (navTicking) return;
      navTicking = true;

      requestAnimationFrame(() => {
        const target = headerParent || header;
        if (window.scrollY > 60) {
          target.style.backdropFilter = 'blur(12px)';
          target.style.webkitBackdropFilter = 'blur(12px)';
          target.style.backgroundColor = 'rgba(5, 9, 20, 0.8)';
        } else {
          target.style.backdropFilter = 'none';
          target.style.webkitBackdropFilter = 'none';
          target.style.backgroundColor = 'transparent';
        }
        navTicking = false;
      });
    }, { passive: true });
  }
});
