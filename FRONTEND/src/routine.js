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
            gradientOverlay: document.getElementById('gradient-overlay'),
            mask: document.getElementById('mask-blur'),
            themePill: document.getElementById('theme-pill'), 
            sunButton: document.getElementById('sun-button'),
            moonButton: document.getElementById('moon-button'),
            page: document.getElementById('routine-page'),
            landingSection: document.getElementById('landing-section'),
            landingTitle: document.getElementById('landing-title'),
            landingBottle: document.getElementById('landing-bottle'),
            stepsSection: document.getElementById('steps-section'),
            stepsPrompt: document.getElementById('steps-prompt'),
            stepsContainer: document.getElementById('steps-container'),
            menuButton: document.getElementById('menu-button'),
            modalCloseButton: document.getElementById('modal-close-button'),
            // MOBILE
            descriptionModal: document.getElementById('description-modal'),
            modalContent: document.getElementById('modal-content'),
            modalTitle: document.getElementById('modal-title'),
            modalDescription: document.getElementById('modal-description'),
            modalTypesContainer: document.getElementById('modal-types-container'),
            // DESKTOP
            descriptionPanel: document.getElementById('description-panel'),
            panelContentWrapper: document.getElementById('panel-content-wrapper'),
            panelTitle: document.getElementById('panel-title'),
            panelDescription: document.getElementById('panel-description'),
            panelTypesContainer: document.getElementById('panel-types-container')
        };

        const levelColors = {
            'Essentials': 'bg-[#00973A] text-white',
            'Targeted': 'bg-[#24CEC5] text-white',
            'Optional': 'bg-[#D7B52E] text-white'
        };

        const themeConfig = {
            am: {
                body: ['from-[#D5FFE8]', 'from-15%', 'to-[#58B989]'],
                landingTitle: ['text-[#28663D]'],
                menuButton: ['text-gray-800'],
                sunButton: ['text-gray-800'],
                moonButton: ['text-gray-800'],
                stepsPrompt: ['text-[#28663D'],
                mask: ['bg-[#D5FFE8]']
            },
            pm: {
                body: ['from-[#6CBE9D]', 'from-15%', 'to-[#3B6353]'],
                landingTitle: ['text-white'],
                menuButton: ['text-white'],
                sunButton: ['text-white'],
                moonButton: ['text-white'],
                stepsPrompt: ['text-white'],
                mask: ['bg-[#6CBE9D]']
            }
        };

        let currentTheme = 'am';


// ** STEP CONTAINER FUNCTIONS ** //
    // STEPS-CONTENT
        function createStepElement(step, stepNumber, theme) {
            const mod = document.createElement('div');
            const mainBgColor = theme === 'am' ? 'bg-white/90' : 'bg-gray-900/50';
            mod.className = `step-item flex z-0 overflow-hidden rounded-4xl shadow-lg w-full lg:w-[35%] xl:w-[25%] ${mainBgColor} cursor-pointer flex-shrink-0 mx-auto mb-5`;

            const level = step.level || 'Optional';
            const sidebarColor = levelColors[level] || 'bg-gray-400';
            const titleColor = theme === 'am' ? 'text-gray-800' : 'text-gray-100';
            const descColor = theme === 'am' ? 'text-gray-600' : 'text-gray-400';

            // .steps-container
            mod.innerHTML = `
                <div class="step-sidebar flex-shrink-0 w-24 p-4 flex flex-col items-center justify-center text-white cursor-pointer ${sidebarColor}">
                    <div id="number" class="w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center font-bold text-lg mb-1">${stepNumber}</div>
                    <div id="tag" class="text-xs lg:text-md font-semibold">${level}</div>
                </div>
                <div class="step-content flex-grow p-3 lg:p-5 flex items-center justify-between cursor-pointer">
                    <div>
                        <h3 class="font-bold text-lg lg:text-xl ${titleColor}">${step.name}</h3>
                        <p class="text-sm lg:text-md ${descColor}">${step.short}</p>
                    </div>
                    <div id="arrow" class="flex-shrink-0 ml-4">
                        <svg class="w-6 h-6 ${descColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            `;

            

            mod.addEventListener('click', (e) => {
                // Click on sidebar vs. content area
                if (e.target.closest('.step-sidebar')) {
                    const isDeselected = mod.classList.toggle('is-deselected');
                    gsap.to(mod, { opacity: isDeselected ? 0.5 : 1, duration: 0.1 });
                    // updateCtaButton();
                } else if (e.target.closest('.step-content')) {
                    if ( window.innerWidth < 1024 ) {
                        openModalMobile(step);
                    } else {
                        openModalDesktop(step);
                        document.querySelectorAll('.step-item').forEach(item => {
                            if ( window.innerWidth < 1366 ) {
                                gsap.to(item, { marginLeft: item === mod ? '20%' : 'auto', marginRight: 'auto', duration: 0.6, ease: 'power2.out' });
                            } else {
                                gsap.to(item, { marginLeft: item === mod ? '40%' : 'auto', marginRight: 'auto', duration: 0.6, ease: 'power2.out' });
                            };
                        });
                    }
                }
            });

            
            return mod;
        }

    // POPULATE STEP CONTAINER
        function populateSteps(theme) {
            if (!elements.stepsContainer) return;

            elements.stepsContainer.innerHTML = '';
            const routineData = theme === 'am' ? routines.am_routine : routines.pm_routine;
            routineData.forEach((step, index) => {
                const stepElement = createStepElement(step, index + 1, theme);
                elements.stepsContainer.appendChild(stepElement);
            });
        }


        // function updateCtaButton() {
        //     if (!elements.ctaButton) return;
        //     const selectedCount = elements.stepsContainer.querySelectorAll('.step-item:not(.is-deselected)').length;
        //     elements.ctaButton.textContent = `Find Products for ${selectedCount} Step${selectedCount !== 1 ? 's' : ''}`;
        // }


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
                tl.to(elements.gradientOverlay, { y: -100, autoAlpha: 0, duration: 1.0, ease: 'power4.inOut' }, 0);
                tl.to(elements.landingBottle, { y: -350, scale: 0.6, autoAlpha: 0, duration: 1.0,  ease: 'power2.inOut' }, 0);
                tl.to(elements.landingTitle, { y: getFinalTitleY, scale: getFinalTitleScale, duration: 1.2, ease: 'expo.inOut' }, 0);
                tl.to(elements.stepsSection, { height: '84.5vh', duration: 1.2, ease: 'expo.inOut' }, 0);
                tl.to(elements.stepsPrompt, { duration: 0.5, ease: 'power1.in' }, 0);
                tl.fromTo(elements.stepsContainer, { opacity: 0, delay: 1.0 }, { opacity: 1, duration: 1.5 }, 0);
        }


// ** MODAL CONTENT FUNCTIONS ** //
    // MOBILE
        function openModalMobile(step) {
            if (!step) return;
            
            elements.descriptionModal.classList.remove('hidden');
            elements.modalTitle.textContent = step.name;
            elements.modalDescription.textContent = step.long;
            elements.modalTypesContainer.innerHTML = '';
            if (step.types && step.types.length > 0) {
                step.types.forEach(type => {
                    const typeEl = document.createElement('div');
                    typeEl.className = 'mt-4 p-3 bg-gray-100 rounded-lg';
                    typeEl.innerHTML = `<h4 class="font-semibold text-gray-800">${type.name}</h4><p class="text-sm text-gray-600 mt-1">${type.description}</p><p class="text-xs text-green-700 mt-2"><strong>Best for:</strong> ${type.best_for}</p>`;
                    elements.modalTypesContainer.appendChild(typeEl);
                });
            }
            gsap.fromTo(elements.modalContent, { y: 20 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
        }
    
    // DESKTOP
        function openModalDesktop(step) {
            if (!step) return;

            // Show and animate the panel if hidden
            if (elements.descriptionPanel.classList.contains('hidden')) {
                elements.descriptionPanel.classList.remove('hidden');
                const tl = gsap.timeline();

                gsap.getProperty

                if ( window.innerWidth > 1024 ) {
                    tl.to(elements.stepsContainer, { xPercent: -25, duration: 0.7, ease: 'power3.inOut' })
                    tl.fromTo(elements.descriptionPanel, { opacity: 0, x: 0 }, { opacity: 1, xPercent: -15, width: '50%', height: '100%', duration: 0.7, ease: 'power3.inOut' }, '-=0.6')
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
                    typeEl.className = 'mt-4 p-3 bg-gray-100 rounded-lg';
                    typeEl.innerHTML = `<h4 class="font-semibold text-gray-800">${type.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${type.description}</p>
                        <p class="text-xs text-green-700 mt-2"><strong>Best for:</strong> ${type.best_for}</p>`;
                    elements.panelTypesContainer.appendChild(typeEl);
                });
            }
        }

    // CLOSE
        function closeModal() {
            elements.descriptionModal.classList.add('hidden');
            openModal.reverse();
        }


// ** THEME TOGGLE ** //
        function applyTheme(theme) {
            const oldTheme = theme === 'am' ? 'pm' : 'am';
            
            gsap.to(elements.themePill, { x: theme === 'am' ? 0 : 39, duration: 0.3, ease: 'power2.inOut' });

            if (theme === 'am') {
                elements.sunButton.classList.remove('text-gray-400');
                elements.moonButton.classList.add('text-gray-400');
            } else {
                elements.sunButton.classList.add('text-gray-400');
                elements.moonButton.classList.remove('text-gray-400');
            }

            for (const elName in themeConfig.am) {
                const element = elements[elName];
                if (element) {
                    element.classList.remove(...themeConfig[oldTheme][elName]);
                    element.classList.add(...themeConfig[theme][elName]);
                }
            }
        }


// ** EVENT LISTENERS ** //
        elements.sunButton.addEventListener('click', () => {
            if (currentTheme !== 'am') {
                currentTheme = 'am';
                applyTheme(currentTheme);
                populateSteps(currentTheme);
            }
        });
        elements.moonButton.addEventListener('click', () => {
            if (currentTheme !== 'pm') {
                currentTheme = 'pm';
                applyTheme(currentTheme);
                populateSteps(currentTheme);
            }
        });

        elements.modalCloseButton.addEventListener('click', closeModal);
        elements.descriptionModal.addEventListener('click', (e) => {
            if (e.target === elements.descriptionModal) {
                closeModal();
            }
        });

        applyTheme('am');

        gsap.delayedCall(0.5, playIntroAnimation);
    }

    init();

});