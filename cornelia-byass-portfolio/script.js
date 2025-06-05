document.addEventListener('DOMContentLoaded', () => {
  // Sticky header on scroll
  const header = document.querySelector('header');
  const stickyOffset = header.offsetTop;

  window.addEventListener('scroll', function () {
    if (window.scrollY > stickyOffset) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });  

  const allProjects = document.querySelectorAll('.project-wrapper');
  const lightbox = document.getElementById('lightbox');
  const lightboxSlider = lightbox.querySelector('.lightbox-slider');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  let currentLightboxIndex = 0;
  let lightboxSlides = [];

  // Open lightbox with slides (images/videos) and show current index
  function openLightbox(slides, index = 0) {
    lightboxSlider.innerHTML = '';
    lightboxSlides = slides;

    lightboxSlides.forEach(slide => {
      if (slide.type === 'image') {
        const img = document.createElement('img');
        img.src = slide.src;
        img.style.width = "100%";
        img.style.flexShrink = "0";
        img.style.objectFit = "contain";
        img.style.maxHeight = "80vh";
        lightboxSlider.appendChild(img);
      } else if (slide.type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = slide.src;
        iframe.style.width = "100%";
        iframe.style.height = "80vh";
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.style.border = 'none';
        lightboxSlider.appendChild(iframe);
      }
    });

    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('show');
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
  }

  function updateLightbox() {
    lightboxSlider.style.transform = `translateX(-${currentLightboxIndex * 100}%)`;
  }

  function nextLightboxSlide() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxSlides.length;
    updateLightbox();
  }

  function prevLightboxSlide() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxSlides.length) % lightboxSlides.length;
    updateLightbox();
  }

  // Close lightbox events
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextLightboxSlide);
  lightboxPrev.addEventListener('click', prevLightboxSlide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxSlide();
    if (e.key === 'ArrowLeft') prevLightboxSlide();
  });

  // Setup each project slider individually
  allProjects.forEach(project => {
    const slider = project.querySelector('.slider');
    const slideElements = slider.children; // all direct slide divs
    const prevArrow = project.querySelector('.arrow.prev');
    const nextArrow = project.querySelector('.arrow.next');
    const dotsContainer = project.querySelector('.pagination-dots');

    let currentIndex = 0;

    // Build slide data (type and src) only from slider children
    const slideData = Array.from(slideElements).map(slide => {
      const img = slide.querySelector('img');
      const iframe = slide.querySelector('iframe');

      if (img) {
        return { type: 'image', src: img.src };
      } else if (iframe) {
        let src = iframe.src;
        return { type: 'video', src: src };
      } else {
        return { type: 'unknown' };
      }
    });

    // Setup pagination dots for all slides (images + videos)
    dotsContainer.innerHTML = '';
    slideData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('span');

    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    // Arrow navigation
    function goToNextSlide(e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slideElements.length;
      updateSlider();
    }

    function goToPrevSlide(e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slideElements.length) % slideElements.length;
      updateSlider();
    }

    if (prevArrow) prevArrow.addEventListener('click', goToPrevSlide);
    if (nextArrow) nextArrow.addEventListener('click', goToNextSlide);

    // Clicking a slide div opens the lightbox with all slides of that project
    Array.from(slideElements).forEach((slide, idx) => {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', () => openLightbox(slideData, idx));
    });

    // Initialize slider view and dots
    updateSlider();
  });

  const originalText = "cornelia byass";
  const target = document.querySelector('.hero-title');
  let scrambleInterval;

  function scrambleText() {
    let iterations = 0;
    clearInterval(scrambleInterval);
    
    scrambleInterval = setInterval(() => {
      target.textContent = originalText
        .split('')
        .map((char, i) => {
          if (i < iterations) return originalText[i];
          return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        })
        .join('');
        
      if (iterations >= originalText.length) {
        clearInterval(scrambleInterval);
      }
      
      iterations += 1/3; // speed of reveal
    }, 30);
  }

  // Trigger scramble on scroll (for demo, only once after 100px scroll)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100 && !scrambleInterval) {
      scrambleText();
    }
  });

  // ————— Scroll detection for active nav button —————
  const sections = ['gallery', 'projects', 'about', 'contact'];
  const navButtons = sections.map(id => document.querySelector(`nav button[data-target="${id}"]`));

  function onScroll() {
    let currentSectionIndex = sections.length - 1; // default to last section
    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.25) { // roughly quarter down viewport
          currentSectionIndex = i === 0 ? 0 : i - 1;
          break;
        }
      }
    }

    navButtons.forEach(btn => btn.classList.remove('active'));
    if (navButtons[currentSectionIndex]) {
      navButtons[currentSectionIndex].classList.add('active');
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // initial highlight on page load
});
