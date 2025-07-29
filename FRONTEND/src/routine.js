import './style.css'
import gsap from "gsap";
import Flip from "gsap/Flip";

async function init() {
    gsap.registerPlugin(Flip);
    let routines;
    try {
        const response = await fetch('/routine.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        routines = await response.json();
    } catch (error) {
        console.error("Could not fetch routine data:", error);
        return;
    }

    const elements = {
        body: document.body,
        themePill: document.getElementById('theme-pill'),
        landingSection: document.getElementById('landing-section'),
        headerTitle: document.getElementById('header-title'),
        landingBottle: document.getElementById('landing-bottle'),
        stepsSection: document.getElementById('steps-section'),
        stepsContent: document.getElementById('steps-content'),
        stepsPrompt: document.getElementById('steps-prompt'),
        stepsWrapper: document.getElementById('steps-wrapper'),
        stepsContainer: document.getElementById('steps-container'),
        // BUTTONS
        buttons: document.querySelectorAll('group-buttons'),
        backButton: document.getElementById('back-button'),
        sunButton: document.getElementById('sun-button'),
        moonButton: document.getElementById('moon-button'),
        // MENU
        menuButton: document.getElementById('menu-button'),
        menuClose: document.getElementById('menu-close'),
        menuScreen: document.getElementById('menu-screen'),
        menuBackdrop: document.getElementById('menu-backdrop'),
        // MOBILE
        descriptionModal: document.getElementById('description-modal'),
        modalContent: document.getElementById('modal-content'),
        modalTitle: document.getElementById('modal-title'),
        modalDescription: document.getElementById('modal-description'),
        modalTypesContainer: document.getElementById('modal-types-container'),
        modalCloseButton: document.getElementById('modal-close-button'),
        // DESKTOP
        descriptionPanel: document.getElementById('description-panel'),
        panelContentWrapper: document.getElementById('panel-content-wrapper'),
        panelTitle: document.getElementById('panel-title'),
        panelDescription: document.getElementById('panel-description'),
        panelTypesContainer: document.getElementById('panel-types-container')
    };

    const levelColors = {
        'Essentials': 'bg-[#00F5A8] text-gray-800',
        'Targeted': 'bg-[#59DBFF] text-white',
        'Optional': 'bg-[#F6E140] text-white'
    };

    let currentRoutine = 'am';


    // INTRO ANIMATION
    function playIntroAnimation() {
        populateSteps(currentRoutine);

        const tl = gsap.timeline({ delay: 0.1 }); // Add a small delay to the timeline itself
        tl.to(elements.landingBottle, { y: -350, scale: 0.6, autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 0);
        tl.to(elements.stepsSection, { height: '84.5vh', duration: 1.2, ease: 'expo.inOut' }, 0);
        tl.fromTo(elements.stepsContainer.querySelectorAll('.step-item'), { opacity: 0 }, { opacity: 1, stagger: 0.06, duration: 1.0, ease: 'power2.out' }, '-=0.7');
    }

    gsap.set(elements.headerTitle, { autoAlpha: 1 });


    // ROUTINE TOGGLE
    // Set the initial position of the pill:
    gsap.set(elements.themePill, { left: '26%' });


    function routineTransition(newRoutine) {
        if (gsap.isTweening(elements.themePill)) return;

        currentRoutine = newRoutine;

        gsap.to(elements.themePill, {
            left: newRoutine === 'am' ? '26%' : '74%',
            duration: 0.3,
            ease: 'power2.inOut'
        });

        const tl = gsap.timeline();

        // Fade out the panel
        tl.to(elements.descriptionPanel, {
            opacity: 0,
            duration: 0.3
        });

        // Fade out old steps
        tl.to(elements.stepsContainer.children, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.05
        }, 0); // Start at the same time as panel fade

        // After fade-out, reset the layout and populate new steps
        tl.add(() => {
            // Record the "side-by-side" state
            const state = Flip.getState(elements.stepsWrapper);

            // Remove the class to snap back to the centered layout
            elements.stepsSection.classList.remove('is-panel-active');

            // Animate from the previous state to the new centered state
            Flip.from(state, {
                duration: 0.6,
                ease: 'power3.inOut'
            });

            // Populate and fade in the new steps
            populateSteps(newRoutine);
            gsap.fromTo(elements.stepsContainer.querySelectorAll('.step-item'),
                { opacity: 0 },
                { opacity: 1, stagger: 0.07, duration: 0.3, delay: 0.2 }
            );
        });
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
                onStart: () => elements.menuScreen.classList.remove('-translate-x-full')
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

    // STEP CONTAINER FUNCTIONS
    function createStepElement(step, stepNumber) {
        const mod = document.createElement('div');
        mod.className = 'step-item flex flex-none w-xs max-w-md mb-3 lg:mb-5 rounded-4xl shadow-lg overflow-hidden cursor-pointer bg-white/90';

        const level = step.level || 'Optional';
        const sidebarColor = levelColors[level] || 'bg-gray-400';
        const titleColor = 'text-gray-800';
        const descColor = 'text-gray-600';

        mod.innerHTML = `
            <div class="step-sidebar flex-shrink-0 w-24 p-4 flex flex-col items-center justify-center text-white cursor-pointer ${sidebarColor}">
                <div id="number" class="flex items-center justify-center w-10 h-10 border-3 border-white rounded-full font-extrabold text-lg mb-1">${stepNumber}</div>
                <div id="tag" class="text-sm font-semibold">${level}</div>
            </div>
            <div class="step-content flex-grow p-4 lg:p-5 flex items-center justify-between cursor-pointer">
                <div>
                    <h3 class="font-bold text-base lg:text-lg ${titleColor}">${step.name}</h3>
                    <p class="pt-1 text-xs ${descColor}">${step.short}</p>
                </div>
                <div id="arrow" class="flex-shrink-0 ml-3">
                    <svg class="w-6 h-6 ${descColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
        `;

        mod.addEventListener('click', (e) => {
            if (e.target.closest('.step-sidebar')) {
                const isDeselected = mod.classList.toggle('is-deselected');
                gsap.to(mod, { opacity: isDeselected ? 0.3 : 1, duration: 0.1 });
            } else if (e.target.closest('.step-content')) {
                if (window.innerWidth < 1024) {
                    openModalMobile(step);
                } else {
                    openModalDesktop(step);
                }
            }
        });
        return mod;
    }

    function populateSteps(routine) {
        if (!elements.stepsContainer) return;

        elements.stepsContainer.innerHTML = '';
        const routineData = routine === 'am' ? routines.am_routine : routines.pm_routine;
        routineData.forEach((step, index) => {
            const stepElement = createStepElement(step, index + 1);
            stepElement.style.opacity = '0';
            elements.stepsContainer.appendChild(stepElement);
        });
    }


    // MODAL CONTENT FUNCTIONS
    let modalTimeline = null;

    function openModalMobile(step) {
        if (!step) return;

        elements.descriptionModal.classList.remove('hidden');
        elements.modalTitle.textContent = step.name;
        elements.modalDescription.textContent = step.long;
        elements.modalTypesContainer.innerHTML = '';
        elements.modalTitle.innerHTML = `<span class="px-4 py-1 bg-[#00E2E2] text-white rounded-full">${step.name}</span>`;

        if (step.types && step.types.length > 0) {
            step.types.forEach(type => {
                const typeEl = document.createElement('div');
                typeEl.className = 'bg-gray-100 text-gray-800 mt-4 p-3 rounded-lg';
                typeEl.innerHTML = `<h4 class="font-semibold">${type.name}</h4>
                                    <p class="text-sm mt-1">${type.description}</p>
                                    <p class="text-xs text-[#00B2B2] mt-2"><strong>Best for:</strong> ${type.best_for}</p>`;
                elements.modalTypesContainer.appendChild(typeEl);
            });
        }

        modalTimeline = gsap.timeline();
        modalTimeline.fromTo(elements.modalContent, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
    }

    function closeModal() {
        if (modalTimeline) {
            modalTimeline.reverse();
            modalTimeline.eventCallback('onReverseComplete', () => {
                elements.descriptionModal.classList.add('hidden');
            });
        } else {
            elements.descriptionModal.classList.add('hidden');
        }
    }

    function openModalDesktop(step) {
        if (!step) return;

        // 1. Update the panel's content with data from the clicked step.
        elements.panelTitle.textContent = step.name;
        elements.panelDescription.textContent = step.long;
        elements.panelTypesContainer.innerHTML = ''; // Clear out old content first
        elements.panelTitle.innerHTML = `<span class="px-4 py-1 bg-[#00E2E2] text-white rounded-full">${step.name}</span>`;

        if (step.types && step.types.length > 0) {
            step.types.forEach(type => {
                const typeEl = document.createElement('div');
                typeEl.className = 'bg-gray-100 text-gray-800 mt-4 p-3 rounded-lg';
                typeEl.innerHTML = `
                    <h4 class="font-semibold">${type.name}</h4>
                    <p class="text-sm mt-1">${type.description}</p>
                    <p class="text-xs text-[#00B2B2] mt-2"><strong>Best for:</strong> ${type.best_for}</p>
                `;
                elements.panelTypesContainer.appendChild(typeEl);
            });
        }

        // 1. Get the current state of the container
        const state = Flip.getState(elements.stepsWrapper);

        // 2. Add the class, which makes the layout instantly "snap" to the final state in the DOM
        elements.stepsSection.classList.add('is-panel-active');

        // 3. Use Flip.from() to animate from the old state to the new one
        Flip.from(state, {
            duration: 0.6,
            ease: 'power3.inOut'
        });

        // We can also fade in the panel for a smoother effect
        gsap.fromTo(elements.descriptionPanel, 
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.1 }
        );
    }

    // EVENT LISTENERS //
    elements.sunButton.addEventListener('click', () => {
        if (currentRoutine !== 'am') {
            routineTransition('am');
        }
    });
    elements.moonButton.addEventListener('click', () => {
        if (currentRoutine !== 'pm') {
            routineTransition('pm');
        }
    });

    elements.modalCloseButton.addEventListener('click', closeModal);
    elements.descriptionModal.addEventListener('click', (e) => {
        if (e.target === elements.descriptionModal) {
            closeModal();
        }
    });

    elements.menuButton.addEventListener('click', openMenu);
    elements.menuClose.addEventListener('click', closeMenu);
    elements.menuBackdrop.addEventListener('click', (e) => {
        if (e.target === elements.menuBackdrop) {
            closeMenu();
        }
    });

    gsap.delayedCall(0.5, playIntroAnimation);
}

document.addEventListener('DOMContentLoaded', init);