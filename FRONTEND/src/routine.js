import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {

    async function init() {

        // FETCH DATA FROM 'ROUTINE.JSON' //
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
            themePill: document.getElementById('theme-pill'), 
            sunButton: document.getElementById('sun-button'),
            moonButton: document.getElementById('moon-button'),
            page: document.getElementById('routine-page'),
            landingSection: document.getElementById('landing-section'),
            landingTitle: document.getElementById('landing-title'),
            landingBottle: document.getElementById('landing-bottle'),
            stepsSection: document.getElementById('steps-section'),
            stepsContent: document.getElementById('steps-content'),
            stepsPrompt: document.getElementById('steps-prompt'),
            stepsContainer: document.getElementById('steps-container'),
            body: document.body,
            menuButton: document.getElementById('menu-button'),
            descriptionModal: document.getElementById('description-modal'),
            modalContent: document.getElementById('modal-content'),
            modalTitle: document.getElementById('modal-title'),
            modalDescription: document.getElementById('modal-description'),
            modalTypesContainer: document.getElementById('modal-types-container'),
            modalCloseButton: document.getElementById('modal-close-button'),
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
                stepsPrompt: ['text-[#28663D']
            },
            pm: {
                body: ['from-[#6CBE9D]', 'from-15%', 'to-[#3B6353]'],
                landingTitle: ['text-white'],
                menuButton: ['text-white'],
                sunButton: ['text-white'],
                moonButton: ['text-white'],
                stepsPrompt: ['text-white']
            }
        };

        let currentTheme = 'am';
        let isDesktopPanelVisible = false;


        // SINGLE STEP CONTAINER //
        function createStepElement(step, stepNumber, theme) {
            const div = document.createElement('div');
            const mainBgColor = theme === 'am' ? 'bg-white/90' : 'bg-gray-900/50';
            div.className = `step-item flex overflow-hidden rounded-4xl shadow-lg w-full lg:max-w-sm ${mainBgColor} cursor-pointer flex-shrink-0 mx-auto mb-5`;

            const level = step.level || 'Optional';
            const sidebarColor = levelColors[level] || 'bg-gray-400';
            const titleColor = theme === 'am' ? 'text-gray-800' : 'text-gray-100';
            const descColor = theme === 'am' ? 'text-gray-600' : 'text-gray-400';

            div.innerHTML = `
                <div class="step-sidebar flex-shrink-0 w-24 p-4 flex flex-col items-center justify-center text-white cursor-pointer ${sidebarColor}">
                    <div class="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center font-bold text-lg mb-1">${stepNumber}</div>
                    <div class="text-xs font-semibold">${level}</div>
                </div>
                <div class="step-content flex-grow p-4 flex items-center justify-between cursor-pointer">
                    <div>
                        <h3 class="font-bold text-lg ${titleColor}">${step.name}</h3>
                        <p class="text-sm ${descColor}">${step.short}</p>
                    </div>
                    <div class="flex-shrink-0 ml-4">
                        <svg class="w-6 h-6 ${descColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            `;

            const sidebar = div.querySelector('.step-sidebar');
            const content = div.querySelector('.step-content');

            if (sidebar) {
                sidebar.addEventListener('click', () => {
                    const isDeselected = div.classList.toggle('is-deselected');
                    
                    // Animate the background color of the sidebar
                    gsap.to(sidebar, content, {
                        opacity: isDeselected ? 0.5 : 1,
                        duration: 0.4,
                        ease: 'power4.out'
                    });

                    updateCtaButton();
                });
            }
            if (content) {
                content.addEventListener('click', () => openDescriptionModal(step));
            }

            let mm = gsap.matchMedia();
            
            // Desktop click handler
            mm.add("(min-width: 1024px)", () => {
                div.addEventListener('click', () => handleDesktopStepClick(step));
            });

            // Mobile click handler
            mm.add("(max-width: 1023px)", () => {
                div.addEventListener('click', () => openDescriptionModal(step));
            });


            return div;
        }


        // POPULATE STEP CONTAINER WITH ROUTINE STEPS //
        function populateSteps(theme) {
            if (!elements.stepsContainer) return;
            elements.stepsContainer.innerHTML = '';
            const routineData = theme === 'am' ? routines.am_routine : routines.pm_routine;
            routineData.forEach((step, index) => {
                const stepElement = createStepElement(step, index + 1, theme);
                elements.stepsContainer.appendChild(stepElement);
            });
        }


        function updateCtaButton() {
            if (!elements.ctaButton) return;
            const selectedCount = elements.stepsContainer.querySelectorAll('.step-item:not(.is-deselected)').length;
            elements.ctaButton.textContent = `Find Products for ${selectedCount} Step${selectedCount !== 1 ? 's' : ''}`;
        }


        // INTRO ANIMATION //
        function playIntroAnimation() {
            populateSteps(currentTheme);
            const tl = gsap.timeline();
            
            const getFinalTitleY = () => {
                const stepsFinalTop = window.innerHeight * 0.1;
                const padding = window.innerWidth < 1024 ? -10 : -20;
                const finalYPosition = stepsFinalTop + padding;
                const startYPosition = elements.landingTitle.getBoundingClientRect().top;
                return finalYPosition - startYPosition;
            };

            const getFinalTitleScale = () => {
                return window.innerWidth < 1024 ? 0.8 : 0.7;
            };

            tl.to(elements.stepsSection, { height: '85vh', duration: 1.2, ease: 'expo.inOut' }, 0);
            tl.to(elements.landingBottle, { y: '0', opacity: 0, duration: 1.0, scale: 0.8, ease: 'power2.inOut' }, 0);
            tl.to(elements.landingTitle, { y: getFinalTitleY, scale: getFinalTitleScale, duration: 1.2, ease: 'expo.inOut' }, 0);
            tl.to(elements.stepsPrompt, { duration: 0.5, ease: 'power1.in' }, 0);
            tl.to(elements.stepsContainer, { opacity: 1, display: 'block', duration: 0.5 }, 0);
        }

        
        // MODAL FUNCTIONS //
        function openDescriptionModal(step) {
            if (!step || !step.name) {
                console.error("Invalid step data provided to modal.");
                return;
            }
            
            elements.modalTitle.textContent = step.name;
            elements.modalDescription.textContent = step.long;
            
            elements.modalTypesContainer.innerHTML = '';
            if (step.types && step.types.length > 0) {
                step.types.forEach(type => {
                    const typeEl = document.createElement('div');
                    typeEl.className = 'mt-4 p-3 bg-gray-100 rounded-lg';
                    typeEl.innerHTML = `
                        <h4 class="font-semibold text-gray-800">${type.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${type.description}</p>
                        <p class="text-xs text-green-700 mt-2"><strong>Best for:</strong> ${type.best_for}</p>
                    `;
                    elements.modalTypesContainer.appendChild(typeEl);
                });
            }
            elements.descriptionModal.classList.remove('hidden');
            gsap.fromTo(elements.modalContent, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
        }

        function closeDescriptionModal() {
            gsap.to(elements.modalContent, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                elements.descriptionModal.classList.add('hidden');
            }});
        }

        // MODAL DESKTOP
        function handleDesktopStepClick(step) {
            if (!isDesktopPanelVisible) {
                animateInDesktopPanel(step);
            } else {
                updateDesktopPanel(step);
            }
        }

        // SHOW MODAL ON DESKTOP
        function animateInDesktopPanel(step) {
            isDesktopPanelVisible = true;
            elements.descriptionModal.classList.remove('hidden');

            const tl = gsap.timeline();
            tl.to(elements.stepsSection, { width: '50%', maxWidth: 'none', duration: 0.8, ease: 'power3.inOut' })
              .to(elements.descriptionModal, { width: '50%', x: '0%', duration: 0.8, ease: 'power3.inOut' }, "<")
              .call(() => updateDesktopPanel(step));
        }

        // UPDATE MODAL CONTENT
        function updateDesktopPanel(step) {
            gsap.to(elements.modalContent, {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
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
                    gsap.to(elements.modalContent, { opacity: 1, duration: 0.3, ease: 'power1.out' });
                }
            });
        }


        // THEME TOGGLE //
        function applyThemeStyles(theme) {
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


        // EVENT LISTENERS //
        elements.sunButton.addEventListener('click', () => {
            if (currentTheme !== 'am') {
                currentTheme = 'am';
                applyThemeStyles(currentTheme);
                populateSteps(currentTheme); // Re-populate with new theme after styling
            }
        });
        elements.moonButton.addEventListener('click', () => {
            if (currentTheme !== 'pm') {
                currentTheme = 'pm';
                applyThemeStyles(currentTheme);
                populateSteps(currentTheme); // Re-populate with new theme after styling
            }
        });

        elements.modalCloseButton.addEventListener('click', closeDescriptionModal);
        elements.descriptionModal.addEventListener('click', (e) => {
            if (e.target === elements.descriptionModal) {
                closeDescriptionModal();
            }
        });

        applyThemeStyles('am');

        // The entire animation will play automatically when the page loads.
        gsap.delayedCall(0.5, playIntroAnimation);
    }

    init();

});