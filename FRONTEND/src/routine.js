import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {

    async function init() {

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

        gsap.registerPlugin(ScrollTrigger);

        const elements = {
            body: document.body,
            bgSlide: document.getElementById('bg-slide'),
            mask: document.getElementById('mask-blur'),
            themePill: document.getElementById('theme-pill'), 
            sunButton: document.getElementById('sun-button'),
            moonButton: document.getElementById('moon-button'),
            landingSection: document.getElementById('landing-section'),
            landingTitle: document.getElementById('landing-title'),
            landingBottle: document.getElementById('landing-bottle'),
            stepsSection: document.getElementById('steps-section'),
            stepsPrompt: document.getElementById('steps-prompt'),
            stepsContainer: document.getElementById('steps-container'),
            buttons: document.getElementById('sun-button', 'moon-button', 'menu-button'),
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
            'Essentials': 'bg-[#27A74E] text-white',
            'Targeted': 'bg-[#35BFB4] text-white',
            'Optional': 'bg-[#DBC440] text-white'
        };

        const themeConfig = {
            am: {
                landingTitle: ['text-[#28663D]'],
                menuButton: ['text-gray-800'],
                sunButton: ['text-gray-800'],
                moonButton: ['text-gray-800'],
                stepsPrompt: ['text-[#28663D'],
                mask: ['bg-[#D5FFE8]'],
                menuScreen: ['bg-green-100/90'],
                modalContent: ['bg-white', 'text-gray-800'],
                panelContentWrapper: ['bg-white', 'text-gray-800'],
                typeEl: ['bg-gray-100', 'text-gray-800'],
            },
            pm: {
                landingTitle: ['text-white'],
                menuButton: ['text-white'],
                sunButton: ['text-white'],
                moonButton: ['text-white'],
                stepsPrompt: ['text-white'],
                mask: ['bg-[#6DA68A]'],
                menuScreen: ['bg-green-200/90'],
                modalContent: ['bg-[#79AF99]', 'text-white'],
                panelContentWrapper: ['bg-[#415951]', 'text-white'],
                typeEl: ['bg-[#62937F60]', 'text-white'],
            }
        };

        let currentTheme = 'am';



// ** MENU ** //
        let menuTimeline = null;
    
    // OPEN
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
                    onStart: () => {
                        elements.menuBackdrop.classList.remove('hidden');
                    }
                }, 0)
                .to(elements.menuScreen, { 
                    x: 0, 
                    duration: 0.2, 
                    ease: 'power2.inOut',
                    onStart: () => {
                        elements.menuScreen.classList.remove('-translate-x-full');
                    }
                }, 0);
            menuTimeline.play();
        }

    // CLOSE
        function closeMenu() {
            if (menuTimeline) {
                menuTimeline.reverse();
                menuTimeline.eventCallback('onReverseComplete', () => {
                    elements.menuBackdrop.classList.add('hidden');
                    elements.menuScreen.classList.add('-translate-x-full');
                });
            }
        }

// ** STEP CONTAINER FUNCTIONS ** //
    // STEPS-CONTENT
        function createStepElement(step, stepNumber, theme) {
            const mod = document.createElement('div');
            const mainBgColor = theme === 'am' ? 'bg-white/90' : 'bg-gray-900/20';
            mod.className = `step-item flex flex-none rounded-4xl shadow-lg overflow-hidden cursor-pointer ${mainBgColor}`;

            const level = step.level || 'Optional';
            const sidebarColor = levelColors[level] || 'bg-gray-400';
            const titleColor = theme === 'am' ? 'text-gray-800' : 'text-gray-100';
            const descColor = theme === 'am' ? 'text-gray-600' : 'text-gray-200';

            // .steps-container
            mod.innerHTML = `
                <div class="step-sidebar flex-shrink-0 w-24 p-4 flex flex-col items-center justify-center text-white cursor-pointer ${sidebarColor}">
                    <div id="number" class="w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center font-semibold text-xl mb-1">${stepNumber}</div>
                    <div id="tag" class="text-xs lg:text-md font-semibold">${level}</div>
                </div>
                <div class="step-content flex-grow p-4 lg:p-5 flex items-center justify-between cursor-pointer">
                    <div>
                        <h3 class="font-bold text-xl ${titleColor}">${step.name}</h3>
                        <p class="pt-1 text-sm lg:text-md ${descColor}">${step.short}</p>
                    </div>
                    <div id="arrow" class="flex-shrink-0 ml-3">
                        <svg class="w-6 h-6 ${descColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            `;

            mod.addEventListener('click', (e) => {
                // Click on sidebar vs. content area
                if (e.target.closest('.step-sidebar')) {
                    const isDeselected = mod.classList.toggle('is-deselected');
                    gsap.to(mod, { opacity: isDeselected ? 0.3 : 1, duration: 0.1 });
                    // updateCtaButton();
                } else if (e.target.closest('.step-content')) {
                    if ( window.innerWidth < 1024 ) {
                        openModalMobile(step);
                    } else {
                        openModalDesktop(step);
                    }
                }
            });
            return mod;
        }

    // POPULATE STEPS CONTAINER
        function populateSteps(theme) {
            if (!elements.stepsContainer) return;

            elements.stepsContainer.innerHTML = '';
            const routineData = theme === 'am' ? routines.am_routine : routines.pm_routine;
            routineData.forEach((step, index) => {
                const stepElement = createStepElement(step, index + 1, theme);
                stepElement.style.opacity = '0';
                elements.stepsContainer.appendChild(stepElement);
            });
        }



// ** INTRO ANIMATION ** //
        function playIntroAnimation() {
            populateSteps(currentTheme);
            
            const getFinalTitleY = () => {
                const stepsFinalTop = window.innerHeight * 0.1;
                const padding = window.innerWidth < 1024 ? -10 : -20;
                const finalYPosition = stepsFinalTop + padding;
                const startYPosition = elements.landingTitle.getBoundingClientRect().top;
                return finalYPosition - startYPosition;
            };

            const getFinalTitleScale = () => {
                return window.innerWidth < 912 ? 0.8 : 0.7;
            };

            const tl = gsap.timeline();
                tl.to(elements.mask, { opacity: 2.0, delay: 1.0 }),
                tl.to(elements.bgSlide, { y: '-30vh', duration: 1.0, ease: 'power4.inOut' }, 0);
                tl.to(elements.landingBottle, { y: -350, scale: 0.6, autoAlpha: 0, duration: 1.0,  ease: 'power2.inOut' }, 0);
                tl.to(elements.landingTitle, { y: getFinalTitleY, scale: getFinalTitleScale, duration: 1.2, ease: 'expo.inOut' }, 0);
                tl.to(elements.stepsSection, { height: '84.5vh', duration: 1.2, ease: 'expo.inOut' }, 0);
                // tl.to(elements.stepsPrompt, { duration: 0.5, ease: 'power1.in' }, 0.1);
                tl.fromTo(elements.stepsContainer.querySelectorAll('.step-item'), { opacity: 0 }, { opacity: 1, stagger: 0.06, duration: 1.0, ease: 'power2.out' }, '-=0.7');
        }



// ** MODAL CONTENT FUNCTIONS ** //
    // MOBILE
        let modalTimeline = null;

        function openModalMobile(step) {
            if (!step) return;

            elements.descriptionModal.classList.remove('hidden');
            elements.modalTitle.textContent = step.name;
            elements.modalDescription.textContent = step.long;
            elements.modalTypesContainer.innerHTML = '';
            if (step.types && step.types.length > 0) {
                step.types.forEach(type => {
                    const typeEl = document.createElement('div');
                    typeEl.className = [
                        ...themeConfig[currentTheme].typeEl,
                        'mt-4', 'p-3', 'rounded-lg'
                    ].join(' ');
                    typeEl.innerHTML = `<h4 class="font-semibold">${type.name}</h4>
                        <p class="text-sm mt-1">${type.description}</p>
                        <p class="text-xs text-green-700 mt-2"><strong>Best for:</strong> ${type.best_for}</p>`;
                    elements.modalTypesContainer.appendChild(typeEl);
                });
            }

            modalTimeline = gsap.timeline();
            modalTimeline.fromTo(
                elements.modalContent,
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
            );

            
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
    
    // DESKTOP
        function openModalDesktop(step) {
            if (!step) return;

            if (elements.descriptionPanel.classList.contains('hidden')) {
                elements.descriptionPanel.classList.remove('hidden');
                const tl = gsap.timeline();

                if ( window.innerWidth > 1024 ) {
                    tl.to(elements.stepsContainer, { xPercent: -80, duration: 0.7, ease: 'power3.inOut' })
                    tl.fromTo(elements.descriptionPanel, { opacity: 0, x: 0 }, { opacity: 1, xPercent: -15, width: '45%', height: '100%', duration: 0.7, ease: 'power3.inOut' }, '-=0.6')
                } else {
                    tl.to(elements.stepsContainer, { xPercent: -20, duration: 0.7, ease: 'power3.inOut' })
                    tl.fromTo(elements.descriptionPanel, { scaleX: 0.8, opacity: 0, x: 0 }, { scaleX: 1, opacity: 1, x: -5, paddingLeft: 5, width: '45%', duration: 0.7, ease: 'power3.inOut' }, '-=0.6');
                }
            }

            // Always update the panel content
            elements.panelTitle.textContent = step.name;
            elements.panelDescription.textContent = step.long;
            elements.panelTypesContainer.innerHTML = '';
            if (step.types && step.types.length > 0) {
                step.types.forEach(type => {
                    const typeEl = document.createElement('div');
                    typeEl.className = [
                        ...themeConfig[currentTheme].typeEl,
                        'mt-4', 'p-3', 'rounded-lg'
                    ].join(' ');
                    typeEl.innerHTML = `<h4 class="font-semibold">${type.name}</h4>
                        <p class="text-sm mt-1">${type.description}</p>
                        <p class="text-xs text-green-700 mt-2"><strong>Best for:</strong> ${type.best_for}</p>`;
                    elements.panelTypesContainer.appendChild(typeEl);
                });
            }
        }

    
// ** THEME TOGGLE ** //
        function applyTheme(theme) {

            const oldTheme = theme === 'am' ? 'pm' : 'am';

            for (const elName in themeConfig.am) {
                const element = elements[elName];
                if (element) {
                    element.classList.remove(...themeConfig[oldTheme][elName]);
                    element.classList.add(...themeConfig[theme][elName]);
                }
            }

        }

        function themeTransition(newTheme) {
            if (gsap.isTweening([elements.landingTitle, elements.stepsContainer])) return;
            
            currentTheme = newTheme;

            let tl = gsap.timeline();

            //  Transition out
            tl.to(elements.themePill, { x: newTheme === 'am' ? 0 : 39, duration: 0.3, ease: 'power2.inOut' })
            .to(elements.landingTitle, { opacity: 0, duration: 0.2, ease: 'power4.out' }, '-=0.25')
            .to(elements.stepsPrompt, { opacity: 0, duration: 0.5, ease: 'power4.out' }, '-=0.4')
            .to(elements.stepsContainer.children, { opacity: 0, stagger: 0.07, duration: 0.3, ease: 'power2.out' }, '>')

            .to(elements.bgSlide, { 
                y: newTheme === 'am' ? '-30vh' : '-100vh', 
                duration: 1.5, 
                ease: 'power3.inOut' 
            }, 0)

            .to([elements.menuButton, elements.sunButton, elements.moonButton], { opacity: 0.05, duration: 1.0, ease: 'power4.out' }, 0);
            

            tl.add(() => {
                applyTheme(newTheme); // Update theme classes/colors

                gsap.to([elements.menuButton, elements.sunButton, elements.moonButton], { opacity: 1, duration: 0.5, ease: 'power4.in' }, '>');

                populateSteps(newTheme);

                // Wait for DOM update before animating in
                requestAnimationFrame(() => {
                    gsap.fromTo(elements.landingTitle,
                        { opacity: 0 },
                        { opacity: 1, color: themeConfig[newTheme].landingTitle, duration: 0.3, ease: 'power4.in' }
                    );
                    gsap.fromTo(elements.stepsPrompt,
                        { opacity: 0 },
                        { opacity: 1, color: themeConfig[newTheme].stepsPrompt, duration: 0.5, ease: 'power2.inOut' }
                    );
                    gsap.fromTo(elements.stepsContainer.querySelectorAll('.step-item'), 
                        { opacity: 0 }, 
                        { opacity: 1, stagger: 0.07, duration: 0.3, ease: 'power2.out' }, '>'
                    );
                });
            });
        }



// ** EVENT LISTENERS ** //
        elements.sunButton.addEventListener('click', () => {
            if (currentTheme !== 'am') {
                themeTransition('am');
            }
        });
        elements.moonButton.addEventListener('click', () => {
            if (currentTheme !== 'pm') {
                themeTransition('pm');
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

        applyTheme('am');

        gsap.delayedCall(0.5, playIntroAnimation);
        
    }

    init();

});