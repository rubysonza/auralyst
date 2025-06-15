import './style.css'
import gsap from "gsap";

const elements = {
  parent: document.querySelector('.bottle-all'),
  greenWrapper: document.querySelector('[data-bottle="green"]'),
  purpleWrapper: document.querySelector('[data-bottle="purple"]'),
  orangeWrapper: document.querySelector('[data-bottle="orange"]'),
  allBottles: document.querySelectorAll('.bottle'),
  allWrappers: document.querySelectorAll('.bottle-wrapper'),
  allDescriptions: document.querySelectorAll('.description'),
  heroTitle: document.querySelector('.hero-title'),
  heroSub: document.querySelector('.hero-sub')
};

const defaultZIndex = {
  green: 2,
  purple: 1,
  orange: 3
};

const descriptionAnimations = {
  green: { 
    mobile: { x: 20, y: -120 },
    desktop: { x: -95, y: -30 }
  },
  purple: { 
    mobile: { x: 30, y: -5 },
    desktop: { x: 25, y: 0 }
  },
  orange: {
    mobile: { x: -5, y: -110 },
    desktop: { x: 75, y: -20 }
  },
};

let parentHoverTimeline;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// FAN-OUT
function createParentHoverAnimation() {
  parentHoverTimeline = gsap.timeline({ 
    paused: true,
    // Counter-rotation for descriptions
    onUpdate: () => {
      elements.allWrappers.forEach(wrapper => {
        const rotation = gsap.getProperty(wrapper, 'rotate');
        const desc = wrapper.querySelector('.description');
        if (desc) {
          gsap.set(desc, { rotation: -rotation });
        }
      });
    }
  });

  let mm = gsap.matchMedia();

  // Desktop
  mm.add("(min-width: 1024px)", () => {
    parentHoverTimeline
      .to(elements.greenWrapper, { y: -35, x: -35, rotate: -14, duration: 0.5, ease: 'back.inOut' })
      .to(elements.purpleWrapper, { y: -55, x: -10, rotate: 2, duration: 0.5, ease: 'back.inOut' }, '<')
      .to(elements.orangeWrapper, { y: -35, x: 25, rotate: 15, duration: 0.5, ease: 'back.inOut' }, '<')
  });
  // Mobile
  mm.add("(max-width: 1023px)", () => {
    parentHoverTimeline
      .to(elements.greenWrapper, { y: -30, x: -12, rotate: -8, duration: 0.5, ease: 'back.inOut' })
      .to(elements.purpleWrapper, { y: -50, x: -8, rotate: 2, duration: 0.5, ease: 'back.inOut' }, '<')
      .to(elements.orangeWrapper, { y: -30, x: 3, rotate: 8, duration: 0.5, ease: 'back.inOut' }, '<')
  });
}

// BOTTLE SCALE-UP
function handleIndividualBottleHover(e) {
  const bottle = e.currentTarget;
  const wrapper = bottle.closest('.bottle-wrapper');
  const desc = wrapper.querySelector('.description');
  const bottleType = wrapper.dataset.bottle;

  const isDesktop = window.matchMedia("(min-width: 769px)").matches;
  const animProps = isDesktop ? descriptionAnimations[bottleType].desktop : descriptionAnimations[bottleType].mobile;

  const scaleValue = isDesktop ? 1.2 : 1.1;

  wrapper.style.zIndex = 50;
  gsap.to(bottle, { scale: scaleValue, duration: 0.3, ease: 'back.inOut' });

  gsap.delayedCall( 0.2, () => {
    if (!wrapper.matches(':hover')) return;
    gsap.fromTo(desc, 
      { opacity: 0, duration: 0.4, ease: 'power2.out' },
      { opacity: 1, x: animProps.x, y: animProps.y, duration: 0.4, ease: 'power2.out' }    
    );
  });
}

// BOTTLE REVERSE
function handleIndividualBottleMouseOut(e) {
  const bottle = e.currentTarget;
  const wrapper = bottle.closest('.bottle-wrapper');
  const desc = wrapper.querySelector('.description');
  const bottleType = wrapper.dataset.bottle;
  const initialZIndex = defaultZIndex[bottleType] || 1;

  gsap.killTweensOf(desc);
  
  gsap.to(bottle, { scale: 1, duration: 0.4, ease: 'back.inOut'});
  gsap.to(desc, { opacity: 0, y: 0, x: 0, duration: 0.3, ease: 'power2.in' });
  wrapper.style.zIndex = initialZIndex;
}

// MOBILE: FAN-OUT CLICK
function playFanAnimation() {
  parentHoverTimeline.play();
}

// MOBILE: FAN-OUT CLICK OUTSIDE
function handleClickOutside(event) {
  if (elements.parent.contains(event.target)) {
    return;
  }
  parentHoverTimeline.reverse();
  gsap.set(elements.greenWrapper, { zIndex: defaultZIndex.green });
  gsap.set(elements.purpleWrapper, { zIndex: defaultZIndex.purple });
  gsap.set(elements.orangeWrapper, { zIndex: defaultZIndex.orange });
}

// CONTROL CENTER
function enableInteractions() {
  createParentHoverAnimation();
  // Mobile
  if (isTouchDevice) {
    elements.parent.addEventListener('click', playFanAnimation);
    document.addEventListener('click', handleClickOutside);
  // Desktop
  } else if (!isTouchDevice) {
    elements.parent.addEventListener('mouseenter', () => parentHoverTimeline.play());
    elements.parent.addEventListener('mouseleave', () => {
      parentHoverTimeline.reverse();

      gsap.killTweensOf(elements.allDescriptions);

      gsap.to(elements.allBottles, { scale: 1, duration: 0.3, overwrite: true });
      gsap.to(elements.allDescriptions, { opacity: 0, y: 0, x: 0, duration: 0.2, ease: 'power2.in' });
      gsap.set(elements.greenWrapper, { zIndex: defaultZIndex.green });
      gsap.set(elements.purpleWrapper, { zIndex: defaultZIndex.purple });
      gsap.set(elements.orangeWrapper, { zIndex: defaultZIndex.orange });
    });
    // Individual bottle hover effects
    elements.allBottles.forEach((bottle) => {
      bottle.addEventListener('mouseover', handleIndividualBottleHover);
      bottle.addEventListener('mouseout', handleIndividualBottleMouseOut);
    });
  }
}

// INTRO TIMELINE
const introTimeline = gsap.timeline({ onComplete: enableInteractions });

gsap.set([elements.heroTitle, elements.heroSub], { opacity: 0, y: 50 });
gsap.set(elements.allWrappers, { y: 200, opacity: 0 });

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
  gsap.set(elements.greenWrapper, { x: 10, zIndex: defaultZIndex.green });
  gsap.set(elements.purpleWrapper, { x: -15, zIndex: defaultZIndex.purple });
  gsap.set(elements.orangeWrapper, { x: -27, zIndex: defaultZIndex.orange });
});
mm.add("(max-width: 768px)", () => {
  gsap.set(elements.greenWrapper, { x: 10, zIndex: defaultZIndex.green });
  gsap.set(elements.purpleWrapper, { x: -13, zIndex: defaultZIndex.purple });
  gsap.set(elements.orangeWrapper, { x: -25, zIndex: defaultZIndex.orange });
});

introTimeline
  .to(elements.allWrappers, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power2.out' })
  .to([elements.heroTitle, elements.heroSub], { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power2.out' }, "-=0.7");