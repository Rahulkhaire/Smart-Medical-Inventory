
// Home page specific JS

document.addEventListener('DOMContentLoaded', function () {
  // common.js already initialized appState
  // wire up category cards (home) - they were added in common.js, but ensure search input is present
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const q = encodeURIComponent(searchInput.value.trim());
      window.location.href = `products.html#search=${q}`;
    });
  }
  
  // --- Categories carousel: continuous left auto-scroll ---
  const carousel = document.querySelector('.categories-carousel');
  const track = document.querySelector('.categories-track');

  if (carousel && track) {
    // Clone the track content to allow seamless looping
    let isPaused = false;
    let rafId = null;
    let speed = 40; // pixels per second (positive -> moves left)
    let offset = 0;

    // Ensure there's enough content by duplicating children until track width >= carousel width * 2
    function ensureLoopable() {
      const children = Array.from(track.children);
      let totalW = children.reduce((s, el) => s + el.offsetWidth + parseInt(getComputedStyle(track).gap || 24), 0);
      // If not wide enough, append clones until wide
      let i = 0;
      while (totalW < carousel.offsetWidth * 2 && i < 10) {
        const clone = children[i % children.length].cloneNode(true);
        // mark clones as hidden from assistive tech to avoid duplicate announcements
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-clone', 'true');
        track.appendChild(clone);
        totalW += clone.offsetWidth + parseInt(getComputedStyle(track).gap || 24);
        i++;
      }
    }

    ensureLoopable();

    // Animation loop
    let lastTime = null;
    function step(ts) {
      if (!lastTime) lastTime = ts;
      const delta = (ts - lastTime) / 1000; // seconds
      lastTime = ts;

      if (!isPaused) {
        offset += speed * delta;
        // When offset exceeds width of first child, move the first child to the end and reduce offset
        const first = track.children[0];
        if (first) {
          const firstW = first.offsetWidth + parseInt(getComputedStyle(track).gap || 24);
          if (offset >= firstW) {
            offset -= firstW;
            track.appendChild(first);
          }
        }
        track.style.transform = `translateX(${-offset}px)`;
      }
      rafId = requestAnimationFrame(step);
    }

    // Start animation
    rafId = requestAnimationFrame(step);

    // Pause on hover/focus/touch
    function pause() { isPaused = true; }
    function resume() { isPaused = false; }

    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('focusin', pause);
    carousel.addEventListener('focusout', resume);
    carousel.addEventListener('touchstart', pause, {passive: true});
    carousel.addEventListener('touchend', resume);

    // Prev / Next buttons
    const btnPrev = carousel.querySelector('.carousel-prev');
    const btnNext = carousel.querySelector('.carousel-next');
    function scrollByItem(direction = 1) {
      // direction: 1 -> next (left), -1 -> prev (right)
      const children = Array.from(track.children);
      if (children.length === 0) return;
      // Compute width to scroll (first visible child width)
      const firstW = children[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      // Update offset smoothly
      offset += direction * firstW;
      // Clamp offset then move elements accordingly
      if (offset < 0) {
        // move last to front
        const last = track.children[track.children.length - 1];
        track.insertBefore(last, track.children[0]);
        offset += last.offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      }
      // animate quick jump using CSS transition
      track.style.transition = 'transform 320ms cubic-bezier(.2,.9,.2,1)';
      track.style.transform = `translateX(${-offset}px)`;
      setTimeout(() => {
        track.style.transition = '';
      }, 350);
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { pause(); scrollByItem(-1); setTimeout(resume, 800); });
    if (btnNext) btnNext.addEventListener('click', function () { pause(); scrollByItem(1); setTimeout(resume, 800); });

    // Pointer drag support (mouse + touch)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;

    function onPointerDown(e) {
      isDragging = true;
      pause();
      track.classList.add('dragging');
      dragStartX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      dragStartOffset = offset;
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const dx = clientX - dragStartX;
      offset = Math.max(0, dragStartOffset - dx);
      track.style.transform = `translateX(${-offset}px)`;
    }
    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      // resume after short delay
      setTimeout(resume, 250);
    }

    track.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    track.addEventListener('touchstart', onPointerDown, {passive: true});
    window.addEventListener('touchmove', onPointerMove, {passive: true});
    window.addEventListener('touchend', onPointerUp);

    // Recalculate on resize
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        // reset offset and ensure enough items
        offset = 0;
        track.style.transform = 'translateX(0)';
        ensureLoopable();
      }, 150);
    });
  }
});
