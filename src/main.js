import '../styles.css';
import gsap from 'gsap';

// CONFIG
const bottleConfig = {
  green: {
    zIndex: 2,
    initial: {
      desktop: { x: 10 },
      mobile: { x: 10 },
    },
    fanOut: {
      desktop: { y: -35, x: -35, rotate: -14 },
      mobile: { y: -30, x: -12, rotate: -8 },
    },
    description: {
      desktop: { x: -110, y: -200 },
      mobile: { x: 0, y: -220 },
    },
  },
  purple: {
    zIndex: 1,
    initial: {
      desktop: { x: -15 },
      mobile: { x: -13 },
    },
    fanOut: {
      desktop: { y: -55, x: -10, rotate: 2 },
      mobile: { y: -50, x: -8, rotate: 2 },
    },
    description: {
      desktop: { x: 95, y: -300 },
      mobile: { x: 0, y: -275 },
    },
  },
  orange: {
    zIndex: 3,
    initial: {
      desktop: { x: -27 },
      mobile: { x: -25 },
    },
    fanOut: {
      desktop: { y: -35, x: 25, rotate: 15 },
      mobile: { y: -30, x: 3, rotate: 8 },
    },
    description: {
      desktop: { x: 60, y: -100 },
      mobile: { x: 0, y: -160 },
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


// ANIMATIONS
/**
 * Creates the main fan-out animation timeline dynamically.
 */
function createParentHoverAnimation() {
  parentHoverTimeline = gsap.timeline({
    paused: true,
    // NEW: Callback for when the fan-out animation completes
    onComplete: () => {
      if (isTouchDevice) {
        elements.allWrappers.forEach(wrapper => {
          const desc = wrapper.querySelector('.description');
          const bottleType = wrapper.dataset.bottle;
          // Get the mobile animation properties from the config
          const animProps = bottleConfig[bottleType].description.mobile; 
          
          // Animate opacity AND position (x, y)
          gsap.to(desc, { 
            opacity: 1, 
            ...animProps, // Applies the x and y values
            duration: 0.4, 
            ease: 'power2.out' 
          });
        });
      }
    },
    // NEW: Callback for when the fan-in (reverse) animation starts
    onReverseComplete: () => {
        if (isTouchDevice) {
            // Reset opacity AND position
             gsap.set(elements.allDescriptions, { opacity: 0, x: 0, y: 0 });
        }
    },
    onUpdate: () => {
      elements.allWrappers.forEach(wrapper => {
        const rotation = gsap.getProperty(wrapper, 'rotate');
        const desc = wrapper.querySelector('.description');
        gsap.set(desc, { rotation: -rotation });
      });
    },
  });

  // ... the rest of the function remains the same
  const mm = gsap.matchMedia();
  mm.add(
    {
      isDesktop: `(min-width: 1024px)`,
      isMobile: `(max-width: 1023px)`,
    },
    (context) => {
      const { isDesktop } = context.conditions;
      const view = isDesktop ? 'desktop' : 'mobile';

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

/**
 * Resets all bottle wrappers to their default z-index.
 */
function resetAllZIndexes() {
  elements.allWrappers.forEach(wrapper => {
    const bottleType = wrapper.dataset.bottle;
    wrapper.style.zIndex = bottleConfig[bottleType].zIndex;
  });
}

// =================================================================
// EVENT HANDLERS
// =================================================================

function handleIndividualBottleHover(e) {
  const bottle = e.currentTarget;
  const wrapper = bottle.closest('.bottle-wrapper');
  if (!wrapper) return;

  const desc = wrapper.querySelector('.description');
  const bottleType = wrapper.dataset.bottle;
  const config = bottleConfig[bottleType];

  const isDesktop = window.matchMedia('(min-width: 769px)').matches;
  const view = isDesktop ? 'desktop' : 'mobile';
  const animProps = config.description[view];
  const scaleValue = isDesktop ? 1.2 : 1.1;

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

/**
 * Reverses the fan animation if a click happens outside the parent container.
 */
function handleClickOutside(event) {
  if (elements.parent && !elements.parent.contains(event.target)) {
    parentHoverTimeline.reverse();
    gsap.set(elements.allBottleLinks, { pointerEvents: 'none' }); 
    resetAllZIndexes();
  }
}

// =================================================================
// INITIALIZATION
// =================================================================

function initializeInteractions() {
  createParentHoverAnimation();

  if (isTouchDevice) {
    elements.parent.addEventListener('click', () => {
      parentHoverTimeline.play();
      gsap.set(elements.allBottleLinks, { pointerEvents: 'auto' }); 
    });
    document.addEventListener('click', handleClickOutside);
  } else {
    elements.parent.addEventListener('mouseenter', () => {
      parentHoverTimeline.play();
      // ENABLE links on hover in
      gsap.set(elements.allBottleLinks, { pointerEvents: 'auto' }); 
    });
    elements.parent.addEventListener('mouseleave', () => {
      parentHoverTimeline.reverse();
      // DISABLE links on hover out
      gsap.set(elements.allBottleLinks, { pointerEvents: 'none' }); 
      
      gsap.killTweensOf(elements.allDescriptions);
      gsap.to(elements.allBottles, { scale: 1, duration: 0.3, overwrite: true });
      gsap.to(elements.allDescriptions, { opacity: 0, y: 0, x: 0, duration: 0.2, ease: 'power2.in' });
      resetAllZIndexes();
    });

    elements.allBottles.forEach((bottle) => {
      bottle.addEventListener('mouseover', handleIndividualBottleHover);
      bottle.addEventListener('mouseout', handleIndividualBottleMouseOut);
    });
  }
}

function runIntroAnimation() {
  // Set initial hidden states
  gsap.set([elements.heroTitle, elements.heroSub], { opacity: 0, y: 50 });
  gsap.set(elements.allWrappers, { y: 200, opacity: 0 });
  gsap.set(elements.allBottleLinks, { pointerEvents: 'none' }); 

  // Set initial positions and z-indexes from config
  const mm = gsap.matchMedia();
  mm.add({
      isDesktop: `(min-width: 769px)`,
      isMobile: `(max-width: 768px)`,
    }, (context) => {
      const { isDesktop } = context.conditions;
      const view = isDesktop ? 'desktop' : 'mobile';

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

  // Create and play intro timeline
  gsap.timeline({ onComplete: initializeInteractions })
    .to(elements.allWrappers, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' })
    .to([elements.heroTitle, elements.heroSub], { y: 0, opacity: 1, stagger: 0.2, duration: 0.4, ease: 'power2.out' }, "<0.3");
}


// MENU
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

// Run everything!
runIntroAnimation();