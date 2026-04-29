// document.addEventListener("DOMContentLoaded", () => {
//   const preloader = document.getElementById("preloader");

//   // safety check
//   if (!preloader) return;

//   const hasSeenPreloader = sessionStorage.getItem("preloaderShown");

//   if (!hasSeenPreloader) {

//     const animation = lottie.loadAnimation({
//       container: document.getElementById('lottie-container'),
//       renderer: 'svg',
//       loop: false,
//       autoplay: true,
//       path: 'img/logo-preloader.json'
//     });

//     animation.addEventListener('complete', () => {

//       // small delay for polish
//       setTimeout(() => {
//         preloader.classList.add('fade-out');
//         document.body.classList.add('loaded');

//         setTimeout(() => {
//           preloader.style.display = 'none';
//         }, 600); // matches CSS transition

//       }, 200);

//     });

//     // mark as shown for this session
//     sessionStorage.setItem("preloaderShown", "true");

//   } else {
//     // skip preloader entirely
//     preloader.style.display = 'none';
//     document.body.classList.add('loaded');
//   }
// });

// // ======= Hamburger Menu (Mobile Nav Toggle) =======
// const hamburger = document.querySelector(".hamburger");
// const navMenu = document.querySelector(".nav-menu");

// hamburger?.addEventListener("click", () => {
//   hamburger.classList.toggle("active");
//   navMenu.classList.toggle("active");
// });

// document.querySelectorAll(".nav-link").forEach(n => {
//   n.addEventListener("click", () => {
//     hamburger?.classList.remove("active");
//     navMenu?.classList.remove("active");
//   });
// });

// // ======= Navbar Background & Logo Change =======
// const navbar = document.querySelector(".navbar");
// const logo = document.getElementById("logo");

// // ✅ Preload both logo images into cache
// const logoYellow = new Image();
// logoYellow.src = "img/logo-w-wordmark-yellow.png";

// const logoDefault = new Image();
// logoDefault.src = "img/logo-w-wordmark.png";

// function isMobile() {
//   return window.innerWidth <= 768;
// }

// function changeLogo(isSolid) {
//   if (!logo) return;

//   const newSrc = isMobile() || isSolid
//     ? logoYellow.src
//     : logoDefault.src;

//   if (logo.src !== newSrc) {
//     logo.src = newSrc;
//   }
// }

// function updateNavbar() {
//   if (!navbar) return;

//   const atTop = window.scrollY === 0 || navbar.matches(':hover');
//   navbar.classList.toggle('solid', atTop);
//   navbar.classList.toggle('scrolled', !atTop);
//   changeLogo(atTop);
// }

// window.addEventListener("DOMContentLoaded", updateNavbar);
// window.addEventListener("scroll", updateNavbar);

// navbar?.addEventListener("mouseenter", () => {
//   navbar.classList.add("solid");
//   navbar.classList.remove("scrolled");
//   changeLogo(true);
// });

// navbar?.addEventListener("mouseleave", () => {
//   if (window.scrollY === 0) {
//     navbar.classList.add("solid");
//     navbar.classList.remove("scrolled");
//     changeLogo(true);
//   } else {
//     navbar.classList.add("scrolled");
//     navbar.classList.remove("solid");
//     changeLogo(false);
//   }
// });

// // ======= Back to Top Button =======
// const backToTopButton = document.getElementById("back-to-top");

// window.addEventListener("scroll", () => {
//   if (!backToTopButton) return;

//   if (window.scrollY > 300) {
//     backToTopButton.classList.add("show");
//   } else {
//     backToTopButton.classList.remove("show");
//   }
// });

// backToTopButton?.addEventListener("click", () => {
//   window.scrollTo({ top: 0});

//   if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
//     backToTopButton.blur();
//   }
// });

// // ======= Lightbox =======

// document.addEventListener("DOMContentLoaded", () => {
//   const thumbnails = document.querySelectorAll(".project-thumbnail");
//   const lightbox = document.getElementById("lightbox-overlay");
//   const lightboxImg = document.getElementById("lightbox-img");
//   const closeBtn = document.getElementById("close-btn");
//   const lightboxContent = document.querySelector(".lightbox-content");

//   if (!lightbox || !lightboxImg || !closeBtn || thumbnails.length === 0) return;

//   let lastTap = 0;
//   let pinchStartDist = 0;
//   let currentScale = 1;
//   let lastScale = 1;
//   let isDragging = false;
//   let dragStart = { x: 0, y: 0 };
//   let imgTranslate = { x: 0, y: 0 };
//   let lastTranslate = { x: 0, y: 0 };
//   let swipeStart = null;
//   let swipeTranslate = { x: 0, y: 0 };
//   let isSwipingToClose = false;

//   // Open lightbox
//   thumbnails.forEach(thumbnail => {
//     thumbnail.addEventListener("click", () => {
//       const highRes = thumbnail.getAttribute("data-highres") || thumbnail.src;
//       lightboxImg.src = highRes;
//       lightbox.classList.remove("hidden");
//       document.body.classList.add("no-scroll");
//       resetZoomAndPan();

//       // Hide Back to Top when lightbox is open
//       if (backToTopButton) backToTopButton.style.display = "none";
//     });
//   });

//   // Close lightbox
//   function closeLightbox() {
//     lightbox.classList.add("hidden");
//     document.body.classList.remove("no-scroll");
//     lightboxImg.src = "";
//     resetZoomAndPan();

//     // Show Back to Top again
//     if (backToTopButton) backToTopButton.style.display = "";
//   }

//   closeBtn.addEventListener("click", closeLightbox);

//   // Click outside content closes lightbox
//   lightbox.addEventListener("click", (e) => {
//     if (e.target === lightbox) closeLightbox();
//   });

//   // Prevent clicks inside content from closing
//   lightboxContent.addEventListener("click", (e) => {
//     e.stopPropagation();
//   });

//   // ESC key close
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
//       closeLightbox();
//     }
//   });

//   // Desktop zoom toggle
//   lightboxImg.addEventListener("click", () => {
//     if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; // skip on touch devices
//     toggleZoom();
//   });

//   // TOUCH HANDLERS
//   lightboxImg.addEventListener("touchstart", handleTouchStart, { passive: false });
//   lightboxImg.addEventListener("touchmove", handleTouchMove, { passive: false });
//   lightboxImg.addEventListener("touchend", handleTouchEnd);

//   function handleTouchStart(e) {
//     if (e.touches.length === 2) {
//       e.preventDefault();
//       pinchStartDist = getDistance(e.touches[0], e.touches[1]);
//     } else if (e.touches.length === 1) {
//       const now = Date.now();
//       if (now - lastTap < 300) {
//         e.preventDefault();
//         toggleZoom();
//         return;
//       }
//       lastTap = now;

//       if (currentScale === 1) {
//         // Start swipe-to-close gesture
//         isSwipingToClose = true;
//         swipeStart = {
//           x: e.touches[0].clientX,
//           y: e.touches[0].clientY,
//         };
//         swipeTranslate = { x: 0, y: 0 };
//       } else {
//         // Normal drag to pan when zoomed in
//         isDragging = true;
//         dragStart = {
//           x: e.touches[0].clientX - imgTranslate.x,
//           y: e.touches[0].clientY - imgTranslate.y,
//         };
//       }
//     }
//   }

//   function handleTouchMove(e) {
//     if (e.touches.length === 2) {
//       e.preventDefault();
//       const newDist = getDistance(e.touches[0], e.touches[1]);
//       const scaleChange = newDist / pinchStartDist;
//       currentScale = Math.min(Math.max(lastScale * scaleChange, 1), 5);
//       applyTransform();
//     } else if (e.touches.length === 1) {
//       if (isSwipingToClose) {
//         e.preventDefault();
//         swipeTranslate.x = e.touches[0].clientX - swipeStart.x;
//         swipeTranslate.y = e.touches[0].clientY - swipeStart.y;

//         // Move image with finger
//         lightboxImg.style.transition = "none";
//         lightboxImg.style.transform = `translate(${swipeTranslate.x}px, ${swipeTranslate.y}px) scale(1)`;

//         // Optionally fade out background depending on swipe distance (vertical only)
//         const opacity = Math.max(1 - Math.abs(swipeTranslate.y) / 300, 0);
//         lightbox.style.backgroundColor = `rgba(0,0,0,${opacity * 0.8})`;
//       } else if (isDragging && currentScale > 1) {
//         e.preventDefault();
//         imgTranslate.x = e.touches[0].clientX - dragStart.x;
//         imgTranslate.y = e.touches[0].clientY - dragStart.y;
//         applyTransform();
//       }
//     }
//   }

//   function handleTouchEnd(e) {
//     if (isSwipingToClose) {
//       // Swipe threshold to close — vertical swipe of 100px or more
//       if (Math.abs(swipeTranslate.y) > 100) {
//         // Animate image off screen before closing
//         const direction = swipeTranslate.y > 0 ? 1 : -1;
//         lightboxImg.style.transition = "transform 0.3s ease";
//         lightboxImg.style.transform = `translate(0, ${direction * 1000}px) scale(1)`;
//         lightbox.style.backgroundColor = "rgba(0,0,0,0)";
//         setTimeout(() => {
//           closeLightbox();
//           // Reset styles after close
//           lightboxImg.style.transition = "";
//           lightboxImg.style.transform = "";
//           lightbox.style.backgroundColor = "rgba(0,0,0,0.8)";
//         }, 300);
//       } else {
//         // Snap back if not passed threshold
//         lightboxImg.style.transition = "transform 0.3s ease";
//         lightboxImg.style.transform = "translate(0,0) scale(1)";
//         lightbox.style.backgroundColor = "rgba(0,0,0,0.8)";
//       }
//       isSwipingToClose = false;
//       swipeStart = null;
//       swipeTranslate = { x: 0, y: 0 };
//     }

//     if (e.touches.length < 2) {
//       lastScale = currentScale;
//       lastTranslate.x = imgTranslate.x;
//       lastTranslate.y = imgTranslate.y;
//       if (currentScale === 1 && !isSwipingToClose) {
//         // reset pan if zoom reset
//         imgTranslate = { x: 0, y: 0 };
//         lastTranslate = { x: 0, y: 0 };
//         applyTransform();
//       }
//     }
//     if (e.touches.length === 0) {
//       isDragging = false;
//     }
//   }

//   function toggleZoom() {
//     if (currentScale === 1) {
//       currentScale = 2;  // zoom to 2x on double tap, adjust if you want
//       lastScale = currentScale;
//       lightboxImg.classList.add("zoomed");
//     } else {
//       currentScale = 1;
//       lastScale = 1;
//       imgTranslate = { x: 0, y: 0 };
//       lastTranslate = { x: 0, y: 0 };
//       lightboxImg.classList.remove("zoomed");
//     }
//     applyTransform();
//   }

//   function resetZoomAndPan() {
//     currentScale = 1;
//     lastScale = 1;
//     imgTranslate = { x: 0, y: 0 };
//     lastTranslate = { x: 0, y: 0 };
//     lightboxImg.classList.remove("zoomed");
//     applyTransform();
//   }

//   function applyTransform() {
//     lightboxImg.style.transform = `scale(${currentScale}) translate(${imgTranslate.x / currentScale}px, ${imgTranslate.y / currentScale}px)`;
//   }

//   function getDistance(touch1, touch2) {
//     return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
//   }
// });

// // Fade in sections

// const sections = document.querySelectorAll('.fade-in-section');

// const observer = new IntersectionObserver((entries, observer) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('is-visible');
//     }
//   });
// }, {
//   threshold: 0.1 // Adjust how much of the div should be visible before triggering
// });

// sections.forEach(section => {
//   observer.observe(section);
// });

// // Contact form Thank You message

// const form = document.getElementById("contact-form");
// const status = document.getElementById("form-status");

// if (form) {
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault(); // stop default page reload
//     const data = new FormData(form);

//     try {
//       const response = await fetch(form.action, {
//         method: form.method,
//         body: data,
//         headers: { 'Accept': 'application/json' }
//       });

//       if (response.ok) {
//         status.innerHTML = "Thank you for your message! I'll be in touch soon.";
//         form.reset();
//       } else {
//         status.innerHTML = "Sorry, this form is currently unavailable. Please try again later or email me directly at colin@colinstubbins.ca";
//       }
//     } catch (error) {
//       status.innerHTML = "Network error. Please try again later.";
//     }
//   });
// }

// ======= INIT =======
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initMenu();
  initNavbar();
  initBackToTop();
  initLightbox();
  initObserver();
  initForm();
});

// ======= PRELOADER =======
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const hasSeen = sessionStorage.getItem("preloaderShown");
  if (hasSeen) {
    preloader.style.display = "none";
    document.body.classList.add("loaded");
    return;
  }

  const container = document.getElementById("lottie-container");
  if (!container) return;

  const animation = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "img/logo-preloader.json"
  });

  animation.addEventListener("complete", () => {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      document.body.classList.add("loaded");
      setTimeout(() => (preloader.style.display = "none"), 600);
    }, 200);
  });

  sessionStorage.setItem("preloaderShown", "true");
}

// ======= MENU =======
function initMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu?.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    });
  });
}

// ======= NAVBAR =======
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const logo = document.getElementById("logo");
  if (!navbar || !logo) return;

  const logoYellow = new Image();
  logoYellow.src = "img/logo-w-wordmark-yellow.png";

  const logoDefault = new Image();
  logoDefault.src = "img/logo-w-wordmark.png";

  const isMobile = () => window.innerWidth <= 768;

  function changeLogo(isSolid) {
    const newSrc = isMobile() || isSolid ? logoYellow.src : logoDefault.src;
    if (logo.src !== newSrc) logo.src = newSrc;
  }

  function updateNavbar() {
    const atTop = window.scrollY === 0;
    navbar.classList.toggle("solid", atTop);
    navbar.classList.toggle("scrolled", !atTop);
    changeLogo(atTop);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateNavbar);

  updateNavbar();
}

// ======= BACK TO TOP =======
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  function update() {
    btn.classList.toggle("show", window.scrollY > 300);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      btn.blur();
    }
  });
}

// ======= LIGHTBOX (trimmed core for performance) =======
function initLightbox() {
  const thumbnails = document.querySelectorAll(".project-thumbnail");
  const lightbox = document.getElementById("lightbox-overlay");
  const img = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("close-btn");

  if (!lightbox || !img || !closeBtn || !thumbnails.length) return;

  let scale = 1;

  function open(src) {
    img.src = src;
    lightbox.classList.remove("hidden");
    document.body.classList.add("no-scroll");
    scale = 1;
    apply();
  }

  function close() {
    lightbox.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    img.src = "";
  }

  function apply() {
    requestAnimationFrame(() => {
      img.style.transform = `scale(${scale})`;
    });
  }

  thumbnails.forEach(t => {
    t.addEventListener("click", () => {
      open(t.getAttribute("data-highres") || t.src);
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });

  img.addEventListener("click", () => {
    scale = scale === 1 ? 2 : 1;
    apply();
  });
}

// ======= INTERSECTION OBSERVER =======
function initObserver() {
  const sections = document.querySelectorAll(".fade-in-section");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}

// ======= FORM =======
function initForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        status.textContent = "Thank you! I'll be in touch soon.";
        form.reset();
      } else {
        status.textContent = "Form unavailable. Try again later.";
      }
    } catch {
      status.textContent = "Network error. Please try again.";
    }
  });
}