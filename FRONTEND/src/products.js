import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations or any other scripts here
    gsap.registerPlugin();
    
    // ELEMENTS
    const menuButton = document.getElementById('menu-button')
    const landingBottle = document.getElementById('landing-bottle')
    const landingTitle = document.getElementById('landing-title')
    const topGuide = document.getElementById('top-guide')

    // gsap.set(landingTitle, { y: '45vh'});

    // function introAnimation () {
    //     const tl = gsap.timeline();

    //     tl.to(landingBottle, { y: '-70vh', autoAlpha: 0, scale: 0.5, duration: 1.0, ease: 'power2.inOut' })
    //       .to(landingTitle, { y: '0vh', duration: 0.8, ease: 'power2.inOut'}, '<0.15>')
    //       .to(topGuide, { opacity: 1, duration: 0.5, ease: 'power2.out'}, '>0.3')
    // }


    // gsap.delayedCall(0.5, introAnimation);

});

