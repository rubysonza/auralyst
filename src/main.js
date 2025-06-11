import './style.css'
import gsap from "gsap";

const elements = {
  parent: document.querySelector('.bottle-all'),
  green: document.querySelector('.bottle-green'),
  purple: document.querySelector('.bottle-purple'),
  orange: document.querySelector('.bottle-orange'),
  allBottles: document.querySelectorAll('.bottle'),
  heroTitle: document.querySelector('.hero-title'),
  heroSub: document.querySelector('.hero-sub')
}

const defaultZIndex = {
  green: 2,
  purple: 1,
  orange: 3
};

let parentHoverTimeline;
function parentHoverAnimation() {
  parentHoverTimeline = gsap.timeline({ paused: true });
  parentHoverTimeline
    .to(elements.green, { y: -30, x: -35, rotate: -14, duration: 0.5, ease: 'back.inOut' })
    .to(elements.purple, { y: -50, x: -20, rotate: 2, duration: 0.5, ease: 'back.inOut' }, '<')
    .to(elements.orange, { y: -35, x: 0, rotate: 15, duration: 0.5, ease: 'back.inOut' }, '<');
}

function handleBottleHover(e) {
  const bottle = e.currentTarget;
  parentHoverTimeline.play();

  gsap.delayedCall(0.1, () => {
    if (!bottle.matches(':hover')) return;

    bottle.style.zIndex = 10; // Bring hovered bottle to the front
    gsap.to(bottle, { scale: 1.2, duration: 0.4, ease: 'back.inOut', });
  });
  
}

function handleBottleHoverOut(e) {
  const bottle = e.currentTarget;
  let initialZIndex = 1;

  if (bottle.classList.contains('bottle-green')) { initialZIndex = defaultZIndex.green; }
  if (bottle.classList.contains('bottle-purple')) { initialZIndex = defaultZIndex.purple; }
  if (bottle.classList.contains('bottle-orange')) { initialZIndex = defaultZIndex.orange; }

  gsap.to(bottle, {
    scale: 1,
    duration: 0.4,
    ease: 'back.inOut',
    onComplete: () => {
      bottle.style.zIndex = initialZIndex;
    }
  });
}

function enableInteractions() {
  parentHoverAnimation();

  elements.parent.addEventListener('mouseenter', () => parentHoverTimeline.play());
  elements.parent.addEventListener('mouseleave', () => parentHoverTimeline.reverse());

  elements.allBottles.forEach(bottle => {
    bottle.addEventListener('mouseover', handleBottleHover);
    bottle.addEventListener('mouseout', handleBottleHoverOut);
  });
}

gsap.set([elements.heroTitle, elements.heroSub, ...elements.allBottles], { opacity: 0 });
gsap.set(elements.purple, { x: -20 , y: 0 , zIndex: defaultZIndex.purple });
gsap.set(elements.green, { x: 50, y: 15 , zIndex: defaultZIndex.green });
gsap.set(elements.orange, { x: -50, y: 10, zIndex: defaultZIndex.orange });

const introTimeline = gsap.timeline({ defaults: { y: 100, opacity: 0 } });
introTimeline
  .fromTo(elements.purple, { x: -20 }, { y: 0, x: -25, opacity: 1 }, 0.3)
  .fromTo(elements.green, { x: 50 }, { y: 4, x: 20, opacity: 1 }, 0.4)
  .fromTo(elements.orange, { x: -50 }, { y: 3, x: -40, opacity: 1 }, 0.5)
  .fromTo(elements.heroTitle, {}, { y: 0, opacity: 1 }, 0.7)
  .fromTo(elements.heroSub, {}, { y: 0, opacity: 1 }, '<0.3');
introTimeline.eventCallback('onComplete', () => {
  enableInteractions();
});