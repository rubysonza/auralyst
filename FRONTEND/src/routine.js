import './style.css'
import gsap from "gsap";
import Flip from "gsap/Flip";

document.addEventListener('DOMContentLoaded', async () => {

    gsap.registerPlugin(Flip);
    
    const elements = {
        body: document.body,
        themePill: document.getElementById('theme-pill'),
        landingSection: document.getElementById('landing-section'),
        headerTitle: document.getElementById('header-title'),
        landingBottle: document.getElementById('landing-bottle'),
        stepsSection: document.getElementById('steps-section'),
        stepsContent: document.getElementById('steps-content'),
        stepsPrompt: document.getElementById('steps-prompt'),
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
        panelTypesContainer: document.getElementById('panel-types-container'),
        // SAVE BUTTON DIALOG BOX
        saveButton: document.getElementById('save-button'),
        confirmDialog: document.getElementById('confirm-dialog'),
        confirmCard: document.getElementById('confirm-card'),
        amConfirmList: document.getElementById('am-confirm-list'),
        pmConfirmList: document.getElementById('pm-confirm-list'),
        dialogCloseButton: document.getElementById('dialog-close-button'),
        nextButton: document.getElementById('next-button')
    };

    const levelColors = {
        'Essentials': 'bg-[#00F5A8] text-gray-800',
        'Targeted': 'bg-[#59DBFF] text-white',
        'Optional': 'bg-[#F6E140] text-white'
    };

    let currentRoutine = 'am';
    const routineStorageKey = 'mySkincareRoutine'; // A key for Local Storage
    let userRoutine = { am: [], pm: [] };


    function initializeRoutineState() {
        const savedData = localStorage.getItem(routineStorageKey);
        if (savedData) {
            // If we found saved data, load it into our state object
            userRoutine = JSON.parse(savedData);
        } else {
            // Otherwise, populate our state with all default steps
            userRoutine.am = routines.am_routine.map(step => step.name);
            userRoutine.pm = routines.pm_routine.map(step => step.name);
        }
    }

    let routines;
    try {
        const response = await fetch('/routine.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        routines = await response.json();
        initializeRoutineState();
    } catch (error) {
        console.error("Could not fetch routine data:", error);
        return;
    }

    populateSteps(currentRoutine);
    gsap.fromTo(elements.stepsContainer.querySelectorAll('.step-item'),
    {
        opacity: 0,
        y: 20
    },
    {
        opacity: (index, target) => {
            return target.classList.contains('is-deselected') ? 0.3 : 1;
        },
        y: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: 'power2.out'
    }
);


    // STEP CONTAINER FUNCTIONS
    function routineTransition(newRoutine) {
        if (gsap.isTweening(elements.stepsWrapper) || gsap.isTweening(elements.themePill)) return;

        currentRoutine = newRoutine;

        gsap.to(elements.themePill, {
            left: newRoutine === 'am' ? '26%' : '74%',
            duration: 0.3,
            ease: 'power2.inOut'
        });

        const tl = gsap.timeline();

        const oldSteps = elements.stepsContainer.querySelectorAll('.step-item');

        tl.to([elements.descriptionPanel, ...oldSteps], {
            opacity: 0,
            duration: 0.3,
            stagger: 0.05
        });

        tl.add(() => {
            const state = Flip.getState(elements.stepsWrapper);

            elements.stepsSection.classList.remove('is-panel-active');

            Flip.from(state, {
                duration: 0.5,
                ease: 'power3.inOut',
                onComplete: () => {
                    populateSteps(newRoutine);
                    gsap.fromTo(elements.stepsContainer.querySelectorAll('.step-item'),
                        { opacity: 0, y: 10 },
                        {
                            opacity: (index, target) => target.classList.contains('is-deselected') ? 0.3 : 1,
                            y: 0,
                            stagger: 0.07,
                            duration: 0.3
                        }
                    );
                }
            });
        });
    }


    function createStepElement(step, stepNumber) {
        const mod = document.createElement('div');
        mod.className = 'step-item flex flex-none w-xs min-w-xs mb-3 lg:mb-5 rounded-4xl shadow-lg overflow-hidden cursor-pointer bg-white/90';

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

                // --- ADD THIS LOGIC ---
                // Update our state object when the user toggles a step
                if (isDeselected) {
                    // Remove the step from the array
                    userRoutine[currentRoutine] = userRoutine[currentRoutine].filter(name => name !== step.name);
                } else {
                    // Add the step back to the array
                    userRoutine[currentRoutine].push(step.name);
                }
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

            if (!userRoutine[routine].includes(step.name)) {
                stepElement.classList.add('is-deselected');
            }

            elements.stepsContainer.appendChild(stepElement);
        });

        elements.stepsContainer.scrollTop = 0;
    }


    // MODAL/PANEL FUNCTIONS
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

        elements.panelTitle.textContent = step.name;
        elements.panelDescription.textContent = step.long;
        elements.panelTypesContainer.innerHTML = '';
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

        const state = Flip.getState(elements.stepsWrapper);

        elements.stepsSection.classList.add('is-panel-active');

        Flip.from(state, {
            duration: 0.6,
            ease: 'power3.inOut'
        });

        gsap.fromTo(elements.descriptionPanel, 
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.1 }
        );
    }


    // DIALOG BOX
    function openConfirmDialog() {
        console.log("openConfirmDialog function started.");
        document.body.classList.add('modal-open');

        // --- Populate Morning List ---
        elements.amConfirmList.innerHTML = '';
        if (userRoutine.am.length > 0) {
            userRoutine.am.forEach(stepName => {
                const li = document.createElement('li');
                li.textContent = stepName;
                elements.amConfirmList.appendChild(li);
            });
        } else {
            elements.amConfirmList.innerHTML = `<li class="italic text-gray-400">No steps selected for this routine</li>`;
        }

        // --- Populate Night List ---
        elements.pmConfirmList.innerHTML = '';
        if (userRoutine.pm.length > 0) {
            userRoutine.pm.forEach(stepName => {
                const li = document.createElement('li');
                li.textContent = stepName;
                elements.pmConfirmList.appendChild(li);
            });
        } else {
            elements.pmConfirmList.innerHTML = `<li class="italic text-gray-400">No steps selected for this routine</li>`;
        }

        console.log("Attempting to show dialog:", elements.confirmDialog);

        elements.confirmDialog.classList.remove('hidden');
        gsap.from(elements.confirmCard, { 
            opacity: 0, 
            y: 20, 
            duration: 0.3, 
            ease: 'power2.out' 
        });

        console.log("openConfirmDialog function finished.");
    }

    function closeConfirmDialog() {
        document.body.classList.remove('modal-open');
        
        gsap.to(elements.confirmCard, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                elements.confirmDialog.classList.add('hidden');
                gsap.set(elements.confirmCard, { clearProps: 'all' });
            }
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


    // EVENT LISTENERS
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

    elements.saveButton.addEventListener('click', openConfirmDialog);

    elements.dialogCloseButton.addEventListener('click', closeConfirmDialog);
    elements.nextButton.addEventListener('click', () => {
        localStorage.setItem(routineStorageKey, JSON.stringify(userRoutine));

        elements.nextButton.textContent = 'Saved!';
        elements.nextButton.disabled = true;

        gsap.delayedCall(1, () => {
            window.location.href = '/products.html'; 

            elements.nextButton.textContent = originalText;
            elements.nextButton.disabled = false;
            closeConfirmDialog();
        });
    });

    elements.confirmDialog.addEventListener('click', (e) => {
        if (e.target === elements.confirmDialog) {
            closeConfirmDialog();
        }
    });

});