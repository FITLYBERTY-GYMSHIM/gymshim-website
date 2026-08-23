/* ================================================================
   BOOK A DEMO — Premium Interactive Modal
   Three.js Particle Background + GSAP Animations
   Senior Frontend Developer Quality
   ================================================================ */

(function () {
  'use strict';

  var CHECK = String.fromCharCode(10003);
  var DASH = String.fromCharCode(8212);

  /* ── DOM refs ── */
  var overlay = document.getElementById('bookingModalOverlay');
  if (!overlay) return;
  var box = overlay.querySelector('.booking-modal-box');
  var closeBtn = document.getElementById('bookingModalClose');
  var subtitle = document.getElementById('bookingModalSubtitle');

  var stepPanels = {};
  for (var i = 1; i <= 4; i++) {
    stepPanels[i] = overlay.querySelector('[data-step-panel="' + i + '"]');
  }

  var stepDots = [], stepLabels = [], stepLines = [];
  for (var j = 1; j <= 4; j++) {
    stepDots.push(document.getElementById('stepDot' + j));
    stepLabels.push(document.getElementById('stepLabel' + j));
  }
  for (var k = 1; k <= 3; k++) {
    stepLines.push(document.getElementById('stepLine' + k));
  }

  var demoTypeGrid = document.getElementById('demoTypeGrid');
  var toStep2FromType = document.getElementById('toStep2FromType');
  var bookingState = document.getElementById('bookingState');
  var bookingCity = document.getElementById('bookingCity');
  var toStep3FromLocation = document.getElementById('toStep3FromLocation');
  var backToStep1FromLocation = document.getElementById('backToStep1FromLocation');
  var prevMonthBtn = document.getElementById('prevMonthBtn');
  var nextMonthBtn = document.getElementById('nextMonthBtn');
  var calendarMonthLabel = document.getElementById('calendarMonthLabel');
  var calendarGrid = document.getElementById('calendarGrid');
  var selectedDateLabel = document.getElementById('selectedDateLabel');
  var timeSlotGrid = document.getElementById('timeSlotGrid');
  var toStep4FromTime = document.getElementById('toStep4FromTime');
  var backToStep2FromTime = document.getElementById('backToStep2FromTime');
  var detailsToggleBtn = document.getElementById('detailsToggleBtn');
  var detailsToggleText = document.getElementById('detailsToggleText');
  var detailsExpand = document.getElementById('detailsExpand');
  var submitBookingBtn = document.getElementById('submitBookingBtn');
  var bookingForm = document.getElementById('bookingForm');
  var backToStep3FromDetails = document.getElementById('backToStep3FromDetails');
  var bookingSuccess = document.getElementById('bookingSuccess');
  var bookingSuccessDetail = document.getElementById('bookingSuccessDetail');
  var googleCalendarLink = document.getElementById('googleCalendarLink');

  /* ── Constants ── */
  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MAX_DAYS_AHEAD = 60, SLOT_START_HOUR = 9, SLOT_END_HOUR = 18, SLOT_INTERVAL_MIN = 30, MIN_LEAD_MIN = 30, DEMO_DURATION_MIN = 30;

  /* ── State ── */
  var currentStep = 1, selectedDemoType = null, selectedState = null, selectedCity = null;
  var viewDate = startOfMonth(new Date()), selectedDate = null, selectedTime = null;

  /* ── Three.js State ── */
  var threeScene = null, threeCamera = null, threeRenderer = null, threeParticles = null;
  var threeAnimId = null, threeMouseX = 0, threeMouseY = 0;

  /* ══════════════════════════════════════════════════════════════
     THREE.JS PARTICLE BACKGROUND
     ══════════════════════════════════════════════════════════════ */

  function initThreeBackground() {
    if (typeof THREE === 'undefined') return;

    var canvas = document.getElementById('bookingThreeCanvas');
    if (!canvas) return;

    try {
      threeScene = new THREE.Scene();

      var w = overlay.offsetWidth || window.innerWidth;
      var h = overlay.offsetHeight || window.innerHeight;

      threeCamera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      threeCamera.position.z = 5;

      threeRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      threeRenderer.setSize(w, h);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeRenderer.setClearColor(0x000000, 0);

      /* ── Particle system ── */
      var particleCount = 120;
      var positions = new Float32Array(particleCount * 3);
      var colors = new Float32Array(particleCount * 3);
      var sizes = new Float32Array(particleCount);

      var colorPalette = [
        { r: 0.85, g: 0.14, b: 0.30 },  /* accent-1 red */
        { r: 1.0, g: 0.30, b: 0.42 },   /* pink */
        { r: 0.4, g: 0.55, b: 1.0 },    /* blue */
        { r: 0.9, g: 0.9, b: 0.95 },    /* white-ish */
        { r: 0.6, g: 0.3, b: 0.8 },     /* purple */
      ];

      for (var pi = 0; pi < particleCount; pi++) {
        var i3 = pi * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 4 - 1;

        var col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;

        sizes[pi] = Math.random() * 3 + 1;
      }

      var geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      var material = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      threeParticles = new THREE.Points(geometry, material);
      threeScene.add(threeParticles);

      /* ── Ambient light rings ── */
      for (var ri = 0; ri < 3; ri++) {
        var ringGeo = new THREE.RingGeometry(1.5 + ri * 0.8, 1.55 + ri * 0.8, 64);
        var ringMat = new THREE.MeshBasicMaterial({
          color: ri === 0 ? 0xd8234a : ri === 1 ? 0x4a6cf7 : 0xff6b8a,
          transparent: true,
          opacity: 0.06 - ri * 0.015,
          side: THREE.DoubleSide
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.userData = { rotSpeed: 0.002 + ri * 0.001, baseRot: ri * 0.5 };
        threeScene.add(ring);
      }

      /* ── Start animation ── */
      animateThree();
    } catch (e) {
      console.warn('Three.js init failed:', e);
    }
  }

  function animateThree() {
    if (!threeRenderer) return;
    threeAnimId = requestAnimationFrame(animateThree);

    var time = Date.now() * 0.001;

    /* Rotate particles */
    if (threeParticles) {
      threeParticles.rotation.y = time * 0.05 + threeMouseX * 0.3;
      threeParticles.rotation.x = Math.sin(time * 0.1) * 0.1 + threeMouseY * 0.2;

      /* Float individual particles */
      var positions = threeParticles.geometry.attributes.position.array;
      for (var pi = 0; pi < positions.length; pi += 3) {
        positions[pi + 1] += Math.sin(time + pi) * 0.0003;
        positions[pi] += Math.cos(time * 0.7 + pi) * 0.0002;
      }
      threeParticles.geometry.attributes.position.needsUpdate = true;
    }

    /* Rotate rings */
    threeScene.children.forEach(function (child) {
      if (child.isMesh && child.userData.rotSpeed) {
        child.rotation.z = time * child.userData.rotSpeed + child.userData.baseRot;
        child.rotation.x = Math.sin(time * 0.3) * 0.2;
      }
    });

    threeRenderer.render(threeScene, threeCamera);
  }

  function destroyThree() {
    if (threeAnimId) cancelAnimationFrame(threeAnimId);
    threeAnimId = null;
    if (threeRenderer) {
      threeRenderer.dispose();
      threeRenderer = null;
    }
    if (threeScene) {
      threeScene.traverse(function (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      threeScene = null;
    }
    threeParticles = null;
    threeCamera = null;
  }

  /* ══════════════════════════════════════════════════════════════
     GSAP ANIMATIONS
     ══════════════════════════════════════════════════════════════ */

  function getGSAP() {
    return typeof gsap !== 'undefined' ? gsap : null;
  }

  function animateModalOpen() {
    var tl = getGSAP();
    if (!tl) {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('booking-modal-locked');
      return;
    }

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('booking-modal-locked');

    var tlSeq = tl.timeline();

    /* Overlay fade */
    tlSeq.fromTo(overlay, {
      opacity: 0,
      backdropFilter: 'blur(0px)'
    }, {
      opacity: 1,
      backdropFilter: 'blur(16px)',
      duration: 0.5,
      ease: 'power3.out'
    });

    /* Box entrance */
    tlSeq.fromTo(box, {
      scale: 0.85,
      y: 40,
      opacity: 0,
      rotateX: 4
    }, {
      scale: 1,
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.65,
      ease: 'back.out(1.2)'
    }, '-=0.3');

    /* Header text */
    var head = box.querySelector('.booking-modal-head');
    if (head) {
      tlSeq.fromTo(head, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3');
    }

    /* Step indicator */
    var indicator = box.querySelector('.booking-step-indicator');
    if (indicator) {
      tlSeq.fromTo(indicator, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }

    /* Step 1 cards stagger */
    var cards = demoTypeGrid ? demoTypeGrid.querySelectorAll('.demo-type-card') : [];
    if (cards.length) {
      tlSeq.fromTo(cards, {
        y: 30,
        opacity: 0,
        scale: 0.9
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)'
      }, '-=0.2');
    }

    /* Continue button */
    var btn1 = box.querySelector('[data-step-panel="1"] .btn-primary');
    if (btn1) {
      tlSeq.fromTo(btn1, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
    }
  }

  function animateModalClose(callback) {
    var tl = getGSAP();

    if (!tl) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('booking-modal-locked');
      if (callback) setTimeout(callback, 300);
      return;
    }

    var tlSeq = tl.timeline({
      onComplete: function () {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('booking-modal-locked');
        if (callback) setTimeout(callback, 50);
      }
    });

    /* Close button spin */
    tlSeq.to(closeBtn, { rotation: 90, duration: 0.2, ease: 'power2.in' });

    /* Box exit */
    tlSeq.to(box, {
      scale: 0.9,
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in'
    }, '-=0.1');

    /* Overlay fade */
    tlSeq.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.15');
  }

  function animateStepTransition(fromStep, toStep) {
    var tl = getGSAP();
    var fromPanel = stepPanels[fromStep];
    var toPanel = stepPanels[toStep];
    if (!tl || !fromPanel || !toPanel) {
      goToStep(toStep);
      return;
    }

    var direction = toStep > fromStep ? 1 : -1;

    /* Exit current */
    var exitTl = tl.timeline();
    exitTl.to(fromPanel, {
      x: -40 * direction,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: function () {
        fromPanel.hidden = true;
        fromPanel.style.transform = '';
        fromPanel.style.opacity = '';
      }
    });

    /* Show + enter next */
    toPanel.hidden = false;
    var elements = toPanel.querySelectorAll('h3, .demo-type-heading, .location-form, .booking-modal-grid, .booking-step-actions, .time-slot-grid, .login-form, .booking-details-panel');

    var enterTl = tl.timeline({ delay: 0.05 });
    enterTl.fromTo(toPanel, {
      x: 50 * direction,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out'
    });

    if (elements.length) {
      enterTl.fromTo(elements, {
        y: 20,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.out'
      }, '-=0.2');
    }

    /* Stagger grid items in new step */
    var gridItems = toPanel.querySelectorAll('.demo-type-card, .calendar-grid button, .time-slot-grid button');
    if (gridItems.length && gridItems.length <= 20) {
      enterTl.fromTo(gridItems, {
        scale: 0.85,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        stagger: 0.03,
        ease: 'back.out(1.5)'
      }, '-=0.2');
    }
  }

  function animateSuccess() {
    var tl = getGSAP();

    /* Hide step indicator */
    var indicator = box.querySelector('.booking-step-indicator');
    if (indicator) indicator.style.display = 'none';

    /* Hide all step panels */
    for (var s = 1; s <= 4; s++) {
      if (stepPanels[s]) stepPanels[s].hidden = true;
    }

    bookingSuccess.classList.add('visible');

    if (!tl) return;

    var tlSeq = tl.timeline();

    /* Icon pop */
    tlSeq.fromTo('.booking-success-icon', {
      scale: 0,
      rotation: -180
    }, {
      scale: 1,
      rotation: 0,
      duration: 0.7,
      ease: 'back.out(2)'
    });

    /* Title slide */
    tlSeq.fromTo('.booking-success h3', {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.3');

    /* Description */
    tlSeq.fromTo('#bookingSuccessDetail', {
      y: 20,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');

    /* Calendar link */
    tlSeq.fromTo('#googleCalendarLink', {
      y: 15,
      opacity: 0,
      scale: 0.9
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.5)'
    }, '-=0.15');
  }

  function animateCardSelection(card) {
    var tl = getGSAP();
    if (!tl) return;

    /* Pulse effect */
    tl.fromTo(card, {
      scale: 0.95
    }, {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2)'
    });

    /* Ring burst */
    var burst = document.createElement('div');
    burst.style.cssText = 'position:absolute;inset:0;border-radius:16px;border:2px solid rgba(216,35,74,0.5);pointer-events:none;';
    card.appendChild(burst);
    tl.fromTo(burst, {
      scale: 1,
      opacity: 0.8
    }, {
      scale: 1.1,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: function () { burst.remove(); }
    });
  }

  function animateStepDots() {
    var tl = getGSAP();
    if (!tl) return;

    stepDots.forEach(function (dot) {
      if (dot.classList.contains('active')) {
        tl.fromTo(dot, { scale: 1 }, {
          scale: 1.15,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
    });
  }

  function animateCalendarCells() {
    var tl = getGSAP();
    if (!tl) return;

    var cells = calendarGrid.querySelectorAll('button:not(.other-month)');
    tl.fromTo(cells, {
      opacity: 0,
      y: 8
    }, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.01,
      ease: 'power2.out'
    });
  }

  function animateTimeSlots() {
    var tl = getGSAP();
    if (!tl) return;

    var slots = timeSlotGrid.querySelectorAll('button');
    tl.fromTo(slots, {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      stagger: 0.02,
      ease: 'back.out(1.5)'
    });
  }

  /* ══════════════════════════════════════════════════════════════
     UTILITY FUNCTIONS
     ══════════════════════════════════════════════════════════════ */

  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function isSameDay(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function maxBookableDate() { return startOfDay(addDays(new Date(), MAX_DAYS_AHEAD)); }
  function formatTime(date) { var h = date.getHours(), m = String(date.getMinutes()).padStart(2, '0'), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + m + ' ' + ap; }
  function formatDateLong(date) { if (!date) return ''; return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function timeKeyToDate(midnight, key) { var p = key.split(':').map(Number), d = new Date(midnight); d.setHours(p[0], p[1], 0, 0); return d; }

  /* ══════════════════════════════════════════════════════════════
     STEP NAVIGATION
     ══════════════════════════════════════════════════════════════ */

  function updateStepIndicator(step) {
    for (var i = 0; i < 4; i++) {
      var dot = stepDots[i], lbl = stepLabels[i];
      dot.classList.remove('active', 'done');
      lbl.classList.remove('active');

      if (i + 1 < step) {
        dot.classList.add('done');
        dot.textContent = CHECK;
      } else if (i + 1 === step) {
        dot.classList.add('active');
        lbl.classList.add('active');
        dot.textContent = (i + 1).toString();
      } else {
        dot.textContent = (i + 1).toString();
      }
    }
    for (var j = 0; j < 3; j++) {
      stepLines[j].classList.toggle('filled', j + 1 < step);
    }
    animateStepDots();
  }

  function goToStep(step, animate) {
    if (animate) {
      animateStepTransition(currentStep, step);
    }
    currentStep = step;

    /* Only update DOM directly when not animating */
    if (!animate) {
      for (var s = 1; s <= 4; s++) {
        stepPanels[s].hidden = s !== step;
      }
    }

    updateStepIndicator(step);

    var sub;
    if (step === 4) {
      sub = formatDateLong(selectedDate) + ' at ' + formatTime(timeKeyToDate(selectedDate, selectedTime)) + DASH + 'just need a few details.';
    } else {
      sub = {
        1: 'Choose a demo type to get started.',
        2: (selectedDemoType ? selectedDemoType + DASH : '') + 'Select your location.',
        3: 'Pick a date and time that works for you.'
      }[step] || '';
    }
    subtitle.textContent = sub;

    if (step === 4 && selectedDate && selectedTime) {
      var se = document.getElementById('bookingSummaryDateTime');
      if (se) se.textContent = formatDateLong(selectedDate) + ' at ' + formatTime(timeKeyToDate(selectedDate, selectedTime));
      var te = document.getElementById('bookingSummaryType');
      if (te) te.textContent = selectedDemoType || 'Online Demo';
      var le = document.getElementById('bookingSummaryLocation');
      if (le) le.textContent = (selectedState || '') + (selectedCity ? ', ' + selectedCity : '');
    }
    box.scrollTop = 0;
  }

  /* ══════════════════════════════════════════════════════════════
     DEMO TYPE CARDS
     ══════════════════════════════════════════════════════════════ */

  function initDemoTypeCards() {
    demoTypeGrid.querySelectorAll('.demo-type-card').forEach(function (card) {
      card.addEventListener('click', function () {
        demoTypeGrid.querySelectorAll('.demo-type-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        selectedDemoType = card.getAttribute('data-demo-type');
        toStep2FromType.disabled = false;
        animateCardSelection(card);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     LOCATION SELECTS
     ══════════════════════════════════════════════════════════════ */

  function initLocationSelects() {
    if (typeof INDIA_LOCATIONS === 'undefined') { console.warn('INDIA_LOCATIONS not loaded'); return; }
    Object.keys(INDIA_LOCATIONS).sort().forEach(function (state) {
      var o = document.createElement('option');
      o.value = state;
      o.textContent = state;
      bookingState.appendChild(o);
    });
    bookingState.addEventListener('change', function () {
      selectedState = bookingState.value;
      bookingCity.innerHTML = '<option value="" disabled selected>Select your city</option>';
      (INDIA_LOCATIONS[selectedState] || []).sort().forEach(function (city) {
        var o = document.createElement('option');
        o.value = city;
        o.textContent = city;
        bookingCity.appendChild(o);
      });
      bookingCity.disabled = false;
      selectedCity = null;
      toStep3FromLocation.disabled = true;
    });
    bookingCity.addEventListener('change', function () {
      selectedCity = bookingCity.value;
      toStep3FromLocation.disabled = false;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     CALENDAR
     ══════════════════════════════════════════════════════════════ */

  function renderCalendar() {
    calendarMonthLabel.textContent = MONTH_NAMES[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
    var today = startOfDay(new Date());
    prevMonthBtn.disabled = viewDate.getTime() <= startOfMonth(today).getTime();

    var fm = startOfMonth(viewDate), fw = fm.getDay(), gs = addDays(fm, -fw), mx = maxBookableDate();
    calendarGrid.innerHTML = '';

    for (var i = 0; i < 42; i++) {
      var cd = addDays(gs, i), btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = cd.getDate();
      var icm = cd.getMonth() === viewDate.getMonth(), ip = cd.getTime() < today.getTime(), itf = cd.getTime() > mx.getTime(), itd = isSameDay(cd, today), is = selectedDate && isSameDay(cd, selectedDate);
      if (!icm) btn.classList.add('other-month');
      if (itd) btn.classList.add('today');
      if (is) btn.classList.add('selected');
      if (ip || itf || !icm) { btn.disabled = true; if (ip) btn.classList.add('past'); }
      else {
        (function (d) {
          btn.addEventListener('click', function () { selectDate(d); });
        })(cd);
      }
      calendarGrid.appendChild(btn);
    }

    var ab = Array.from(calendarGrid.children), r6 = ab.slice(35);
    if (r6.every(function (b) { return b.classList.contains('other-month'); })) {
      r6.forEach(function (b) { b.remove(); });
    }

    animateCalendarCells();
  }

  function selectDate(date) {
    selectedDate = startOfDay(date);
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    updateSelectedSummary();
    updateContinueState3();
  }

  function renderTimeSlots() {
    timeSlotGrid.innerHTML = '';
    if (!selectedDate) return;
    var now = new Date(), itd = isSameDay(selectedDate, now), slots = [];
    for (var h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
      for (var m = 0; m < 60; m += SLOT_INTERVAL_MIN) {
        var sd = new Date(selectedDate);
        sd.setHours(h, m, 0, 0);
        if (itd && (sd - now) / 60000 < MIN_LEAD_MIN) continue;
        slots.push(sd);
      }
    }
    if (slots.length === 0) {
      var e = document.createElement('p');
      e.className = 'time-slot-empty';
      e.textContent = 'No slots left for this day, try another date.';
      timeSlotGrid.appendChild(e);
      return;
    }
    slots.forEach(function (sd) {
      var k = sd.getHours() + ':' + String(sd.getMinutes()).padStart(2, '0');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = formatTime(sd);
      if (selectedTime === k) btn.classList.add('selected');
      btn.addEventListener('click', (function (kk) {
        return function () {
          selectedTime = kk;
          renderTimeSlots();
          updateSelectedSummary();
          updateContinueState3();
        };
      })(k));
      timeSlotGrid.appendChild(btn);
    });
    animateTimeSlots();
  }

  function updateSelectedSummary() {
    if (!selectedDate) {
      selectedDateLabel.textContent = 'Choose a date to see open times';
      selectedDateLabel.classList.add('placeholder');
      return;
    }
    selectedDateLabel.classList.remove('placeholder');
    selectedDateLabel.textContent = selectedTime ? formatDateLong(selectedDate) + ' at ' + formatTime(timeKeyToDate(selectedDate, selectedTime)) : formatDateLong(selectedDate) + DASH + 'pick a time';
  }

  function updateContinueState3() {
    toStep4FromTime.disabled = !(selectedDate && selectedTime);
  }

  /* ══════════════════════════════════════════════════════════════
     DETAILS TOGGLE
     ══════════════════════════════════════════════════════════════ */

  function toggleDetails() {
    var expanded = detailsToggleBtn.classList.toggle('expanded');
    detailsExpand.classList.toggle('expanded', expanded);
    detailsToggleText.textContent = expanded ? 'Less details' : 'More details';
  }

  /* ══════════════════════════════════════════════════════════════
     GOOGLE CALENDAR
     ══════════════════════════════════════════════════════════════ */

  function buildGoogleCalendarUrl(date, time) {
    var dt = timeKeyToDate(date, time), end = new Date(dt.getTime() + DEMO_DURATION_MIN * 60000);
    function fc(d) {
      return d.getFullYear().toString() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + '00';
    }
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Book a Demo - ' + (selectedDemoType || 'Gymshim')) + '&dates=' + fc(dt) + '/' + fc(end) + '&details=' + encodeURIComponent('Demo type: ' + (selectedDemoType || 'N/A') + ' | Duration: 30 minutes') + '&location=' + encodeURIComponent((selectedCity || '') + (selectedState ? ', ' + selectedState : ''));
  }

  /* ══════════════════════════════════════════════════════════════
     SUBMIT BOOKING
     ══════════════════════════════════════════════════════════════ */

  async function submitBooking() {
    if (!bookingForm.checkValidity()) { bookingForm.reportValidity(); return; }

    var name = document.getElementById('bookingName').value.trim();
    var email = document.getElementById('bookingEmail').value.trim();
    var phone = document.getElementById('bookingPhone').value.trim();
    var gymName = document.getElementById('bookingGymName').value.trim();
    var when = formatDateLong(selectedDate) + ' at ' + formatTime(timeKeyToDate(selectedDate, selectedTime));

    /* Loading state */
    var originalText = submitBookingBtn.textContent;
    submitBookingBtn.disabled = true;
    submitBookingBtn.innerHTML = '<span class="booking-loading-spinner"></span>';

    var data = {
      name: name, email: email, phone: phone, gymName: gymName,
      demoType: selectedDemoType, state: selectedState, city: selectedCity,
      date: formatDateLong(selectedDate),
      time: formatTime(timeKeyToDate(selectedDate, selectedTime)),
      duration: '30 minutes'
    };

    console.log(data);
    try {
      var r = await fetch(BOOKING_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
      console.log(r);
    } catch (err) {
      console.error('Booking failed:', err);
    }

    bookingSuccessDetail.textContent = 'Thanks' + (name ? ', ' + name : '') + ' ' + DASH + ' see you ' + when + '. A confirmation has been sent to your email.';

    animateSuccess();

    var cu = buildGoogleCalendarUrl(selectedDate, selectedTime);
    googleCalendarLink.href = cu;
    googleCalendarLink.style.display = 'inline-flex';
    submitBookingBtn.disabled = false;
    submitBookingBtn.textContent = originalText;
  }

  /* ══════════════════════════════════════════════════════════════
     OPEN / CLOSE / RESET
     ══════════════════════════════════════════════════════════════ */

  function openModal() {
    /* iOS-Safari-safe scroll lock: plain overflow:hidden on body does not
       reliably block background scroll on iOS, and can fail to restore the
       scroll position afterward. Pin body with position:fixed instead and
       remember the offset so we can put it back exactly on close. */
    var scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.scrollLockY = String(scrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    /* Stop Lenis smooth scroll from hijacking wheel events */
    if (window.lenis) { try { window.lenis.stop(); } catch(e) {} }
    /* Add lenis-prevent attribute for good measure */
    overlay.setAttribute('data-lenis-prevent', '');
    initThreeBackground();
    animateModalOpen();
    document.addEventListener('keydown', onKeydown);
  }

function closeModal() {
    animateModalClose(function () {
      destroyThree();
      resetModal();

      /* Fully restore page scrolling — undo the position:fixed lock and
         jump back to the exact scroll offset we were at before opening. */
      document.body.classList.remove('booking-modal-locked');
      document.documentElement.classList.remove('lenis-stopped');

      var lockedY = parseInt(document.body.dataset.scrollLockY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      delete document.body.dataset.scrollLockY;

      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      window.scrollTo(0, lockedY);

      /* Let the reflow settle BEFORE waking Lenis back up, otherwise Lenis
         resumes from a stale internal scroll position/target that no
         longer matches the real DOM and swallows the next scroll input. */
      requestAnimationFrame(function () {
        if (window.lenis) {
          try {
            window.lenis.resize();          // re-measure content height
            window.lenis.start();
            window.lenis.scrollTo(lockedY, { immediate: true }); // resync internal target to real position
          } catch (e) {}
        }
        if (window.ScrollTrigger) {
          try { window.ScrollTrigger.refresh(); } catch (e) {}
        }
      });
    });
}

  function resetModal() {
    currentStep = 1;
    selectedDemoType = null;
    selectedState = null;
    selectedCity = null;
    viewDate = startOfMonth(new Date());
    selectedDate = null;
    selectedTime = null;
    bookingForm.reset();

    bookingSuccess.classList.remove('visible');
    document.querySelector('.booking-step-indicator').style.display = '';
    detailsToggleBtn.classList.remove('expanded');
    detailsExpand.classList.remove('expanded');
    detailsToggleText.textContent = 'More details';

    demoTypeGrid.querySelectorAll('.demo-type-card').forEach(function (c) { c.classList.remove('selected'); });
    toStep2FromType.disabled = true;

    if (bookingState) {
      bookingState.selectedIndex = 0;
      bookingCity.innerHTML = '<option value="" disabled selected>Select your city</option>';
      bookingCity.disabled = true;
    }
    toStep3FromLocation.disabled = true;
    googleCalendarLink.href = '#';
    googleCalendarLink.style.display = 'none';

    goToStep(1, false);
    renderCalendar();
    renderTimeSlots();
    updateSelectedSummary();
    updateContinueState3();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL BLEED PREVENTION
     ══════════════════════════════════════════════════════════════ */

  /* Stop wheel events from scrolling the background page */
  overlay.addEventListener('wheel', function (e) {
    /* Only prevent if the modal box is scrollable */
    var boxEl = box;
    var atTop = boxEl.scrollTop <= 0;
    var atBottom = boxEl.scrollTop + boxEl.clientHeight >= boxEl.scrollHeight - 2;

    /* Scrolling down and already at bottom — allow page scroll */
    if (e.deltaY > 0 && atBottom) return;
    /* Scrolling up and already at top — allow page scroll */
    if (e.deltaY < 0 && atTop) return;

    e.stopPropagation();
  }, true);

  /* Stop touch move from scrolling the background page */
  overlay.addEventListener('touchmove', function (e) {
    var boxEl = box;
    var atTop = boxEl.scrollTop <= 0;
    var atBottom = boxEl.scrollTop + boxEl.clientHeight >= boxEl.scrollHeight - 2;

    if (e.touches[0] && e.touches[0].clientY) {
      /* Not easily direction-detectable, just prevent on the overlay */
    }

    /* If box is scrollable, stop propagation */
    if (boxEl.scrollHeight > boxEl.clientHeight) {
      e.stopPropagation();
    }
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════════
     MOUSE TRACKING (for Three.js)
     ══════════════════════════════════════════════════════════════ */

  overlay.addEventListener('mousemove', function (e) {
    var rect = box.getBoundingClientRect();
    threeMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    threeMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  /* ══════════════════════════════════════════════════════════════
     EVENT LISTENERS
     ══════════════════════════════════════════════════════════════ */

  /* Trigger booking modal from links */
  document.querySelectorAll('a[href="booking.html"], a[href$="/booking.html"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  /* Step navigation */
  toStep2FromType.addEventListener('click', function () { goToStep(2, true); });
  backToStep1FromLocation.addEventListener('click', function () { goToStep(1, true); });
  toStep3FromLocation.addEventListener('click', function () { goToStep(3, true); });
  backToStep2FromTime.addEventListener('click', function () { goToStep(2, true); });
  toStep4FromTime.addEventListener('click', function () { goToStep(4, true); });
  backToStep3FromDetails.addEventListener('click', function () { goToStep(3, true); });

  /* Calendar nav */
  prevMonthBtn.addEventListener('click', function () {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener('click', function () {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  detailsToggleBtn.addEventListener('click', toggleDetails);
  submitBookingBtn.addEventListener('click', submitBooking);

  /* ── Init ── */
  initDemoTypeCards();
  initLocationSelects();
  renderCalendar();
  renderTimeSlots();
  updateSelectedSummary();
  updateContinueState3();
})();

var BOOKING_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-BnUgmJn-FvX8FLunnPnQF1bQq8nixXRBn6ofihUPYvZa-M-hghmvb2EbGksW-xtJ/exec';