import './styles.css';
import gsap from 'gsap';

// BOTTLE CONFIG
const bottleConfig = {
  green: {
    zIndex: 2,
    initial: {
      largeScreen: { x: 10 },
      smallScreen: { x: 10 },
    },
    fanOut: {
      largeScreen: { y: -35, x: -35, rotate: -14 },
      smallScreen: { y: -30, x: -12, rotate: -8 },
    },
    description: {
      largeScreen: { x: -110, y: -200 },
      smallScreen: { x: 0, y: -220 },
    },
  },
  purple: {
    zIndex: 1,
    initial: {
      largeScreen: { x: -15 },
      smallScreen: { x: -13 },
    },
    fanOut: {
      largeScreen: { y: -55, x: -10, rotate: 2 },
      smallScreen: { y: -50, x: -8, rotate: 2 },
    },
    description: {
      largeScreen: { x: 95, y: -300 },
      smallScreen: { x: 0, y: -275 },
    },
  },
  orange: {
    zIndex: 3,
    initial: {
      largeScreen: { x: -27 },
      smallScreen: { x: -25 },
    },
    fanOut: {
      largeScreen: { y: -35, x: 25, rotate: 15 },
      smallScreen: { y: -30, x: 3, rotate: 8 },
    },
    description: {
      largeScreen: { x: 60, y: -100 },
      smallScreen: { x: 0, y: -160 },
    },
  },
};


// DOM ELEMENTS
const elements = {
  parent: document.querySelector('.bottle-all'),
  allWrappers: document.querySelectorAll('.bottle-wrapper'),
  allBottles: document.querySelectorAll('.bottle'),
  allBottleLinks: document.querySelectorAll('.bottle-wrapper a'), 
  allDescriptions: document.querySelectorAll('.description'),
  heroTitle: document.querySelector('.hero-title'),
  heroSub: document.querySelector('.hero-sub'),
  menuButton: document.getElementById('menu-button'),
  menuClose: document.getElementById('menu-close'),
  menuScreen: document.getElementById('menu-screen'),
  menuBackdrop: document.getElementById('menu-backdrop')
};

const isTouchDevice = navigator.maxTouchPoints > 0;
let parentHoverTimeline;


// ===========
// ANIMATIONS
// ===========

// Fan Out
function createParentHoverAnimation() {
  parentHoverTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      gsap.set(elements.allBottleLinks, { pointerEvents: 'auto' });

      if (window.innerWidth < 1024 || isTouchDevice) {
        elements.allWrappers.forEach(wrapper => {
          const desc = wrapper.querySelector('.description');
          const bottleType = wrapper.dataset.bottle;
          const view = window.innerWidth < 1024 ? 'smallScreen' : 'largeScreen';
          const animProps = bottleConfig[bottleType].description[view];
          gsap.to(desc, {
            opacity: 1,
            ...animProps,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      }
    },
    onReverseComplete: () => {
      gsap.set(elements.allBottleLinks, { pointerEvents: 'none' });
    },
    onUpdate: () => {
      elements.allWrappers.forEach(wrapper => {
        const rotation = gsap.getProperty(wrapper, 'rotate');
        const desc = wrapper.querySelector('.description');
        gsap.set(desc, { rotation: -rotation });
      });
    },
  });

  const mm = gsap.matchMedia();
  mm.add(
    {
      isLargeScreen: `(min-width: 1024px)`,
      isSmallScreen: `(max-width: 1023px)`,
    },
    (context) => {
      const view = context.conditions.isLargeScreen ? 'largeScreen' : 'smallScreen';
      elements.allWrappers.forEach(wrapper => {
        const bottleType = wrapper.dataset.bottle;
        const config = bottleConfig[bottleType].fanOut[view];
        parentHoverTimeline.to(
          wrapper,
          { ...config, duration: 0.5, ease: 'back.inOut' },
          '<'
        );
      });
    }
  );
}

// Reset Z Index
function resetAllZIndexes() {
  elements.allWrappers.forEach(wrapper => {
    const bottleType = wrapper.dataset.bottle;
    wrapper.style.zIndex = bottleConfig[bottleType].zIndex;
  });
}

// Fan In
function reverseFanAnimation() {
    gsap.to(elements.allDescriptions, {
        opacity: 0,
        y: 0,
        x: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            parentHoverTimeline.reverse();
            resetAllZIndexes();
        }
    });

    gsap.to(elements.allBottles, { scale: 1, duration: 0.3, overwrite: true });
}


// ===============
// EVENT HANDLERS
// ===============
function handleIndividualBottleHover(e) {
  if (isTouchDevice) return;

  const bottle = e.currentTarget;
  const wrapper = bottle.closest('.bottle-wrapper');
  if (!wrapper) return;

  const desc = wrapper.querySelector('.description');
  const bottleType = wrapper.dataset.bottle;
  const config = bottleConfig[bottleType];

  const view = window.innerWidth < 1024 ? 'smallScreen' : 'largeScreen';
  const animProps = config.description[view];
  const scaleValue = window.innerWidth < 1024 ? 1.1 : 1.2;

  wrapper.style.zIndex = 50;
  gsap.to(bottle, { scale: scaleValue, duration: 0.3, ease: 'back.inOut' });

  gsap.delayedCall(0.2, () => {
    if (!wrapper.matches(':hover')) return;
    gsap.fromTo(
      desc,
      { opacity: 0 },
      { opacity: 1, ...animProps, duration: 0.4, ease: 'power2.out' }
    );
  });
}

function handleIndividualBottleMouseOut(e) {
  if (isTouchDevice) return;

  const bottle = e.currentTarget;
  const wrapper = bottle.closest('.bottle-wrapper');
  if (!wrapper) return;

  const desc = wrapper.querySelector('.description');
  const bottleType = wrapper.dataset.bottle;
  const initialZIndex = bottleConfig[bottleType].zIndex;

  gsap.killTweensOf(desc);
  gsap.to(bottle, { scale: 1, duration: 0.4, ease: 'back.inOut' });
  gsap.to(desc, { opacity: 0, y: 0, x: 0, duration: 0.3, ease: 'power2.in' });
  wrapper.style.zIndex = initialZIndex;
}

function handleClickOutside(event) {
    if (isTouchDevice && elements.parent && !elements.parent.contains(event.target)) {
        reverseFanAnimation();
    }
}


// ===============
// INITIALIZATION
// ===============
function initializeInteractions() {
  createParentHoverAnimation();

  if (isTouchDevice) {
    elements.parent.addEventListener('click', () => {
      if (parentHoverTimeline.progress() === 0) {
        parentHoverTimeline.play();
      }
    });
    document.addEventListener('click', handleClickOutside);
  } else {
    elements.parent.addEventListener('mouseenter', () => parentHoverTimeline.play());
    elements.parent.addEventListener('mouseleave', () => {
        reverseFanAnimation();
    });
  }

  if (!isTouchDevice) {
    elements.allBottles.forEach((bottle) => {
      bottle.addEventListener('mouseover', handleIndividualBottleHover);
      bottle.addEventListener('mouseout', handleIndividualBottleMouseOut);
    });
  }
}


// =====
// INTRO
// =====
function runIntroAnimation() {
  gsap.set([elements.heroTitle, elements.heroSub], { opacity: 0, y: 50 });
  gsap.set(elements.allWrappers, { y: 200, opacity: 0 });
  gsap.set(elements.allBottleLinks, { pointerEvents: 'none' }); 

  const mm = gsap.matchMedia();
  mm.add({
      isLargeScreen: `(min-width: 1024px)`,
      isSmallScreen: `(max-width: 1023px)`,
    }, (context) => {
      const view = context.conditions.isLargeScreen ? 'largeScreen' : 'smallScreen';

      elements.allWrappers.forEach(wrapper => {
        const bottleType = wrapper.dataset.bottle;
        const config = bottleConfig[bottleType];
        gsap.set(wrapper, {
          x: config.initial[view].x,
          zIndex: config.zIndex,
        });
      });
    }
  );

  gsap.timeline({ onComplete: initializeInteractions })
    .to(elements.allWrappers, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' })
    .to([elements.heroTitle, elements.heroSub], { y: 0, opacity: 1, stagger: 0.2, duration: 0.4, ease: 'power2.out' }, "<0.3");
}


// ====
// MENU
// ====
  let menuTimeline = null;

  function openMenu() {
      if (menuTimeline) {
          menuTimeline.play();
          return;
      }
      menuTimeline = gsap.timeline({ paused: true });
      menuTimeline
          .to(elements.menuBackdrop, {
              opacity: 1,
              duration: 0.2,
              onStart: () => elements.menuBackdrop.classList.remove('hidden')
          }, 0)
          .to(elements.menuScreen, {
              x: 0,
              duration: 0.2,
              ease: 'power2.inOut',
              onStart: () => elements.menuScreen.classList.remove('translate-x-full')
          }, 0);
      menuTimeline.play();
  }

  function closeMenu() {
      if (menuTimeline) {
          menuTimeline.reverse();
          menuTimeline.eventCallback('onReverseComplete', () => {
              elements.menuBackdrop.classList.add('hidden');
              elements.menuScreen.classList.add('-translate-x-full');
          });
      }
  }

  elements.menuButton.addEventListener('click', openMenu);
  elements.menuClose.addEventListener('click', closeMenu);
  elements.menuBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.menuBackdrop) {
          closeMenu();
      }
  });

  
runIntroAnimation();