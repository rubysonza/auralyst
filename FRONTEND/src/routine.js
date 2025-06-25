import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {
    
    const routines = {
        am_routine: [
            {
                name: 'Cleanser',
                description: 'Gently purifies skin, removing overnight buildup and preparing it for the day.',
                types: [
                    { 'Gel Cleanser': 'Clear, often foaming, deeply cleanses pores and removes excess oil.' },
                    { 'Cream Cleanser': 'Rich, non-foaming, gently cleanses while hydrating, leaving skin soft.' },
                    { 'Foam Cleanser': 'Creates a rich lather for a thorough cleanse, removing impurities and makeup.' },
                    { 'Oil Cleanser': 'Oil-based, dissolves oil-based impurities like makeup and sunscreen.' },
                    { 'Cleansing Balm': 'Solid balm that melts into an oil to break down makeup and impurities' },
                    { 'Micellar Water': 'No-rinse, uses micelles to lift dirt, oil, and makeup.' },
                    { 'Clay Cleanser': 'Contains clay to absorb excess oil and draw out impurities from pores.' },
                    { 'Powder Cleanser': 'Water-activated powder that transforms into a lather, often with gentle exfoliation.' },
                    { 'Bar Cleanser': 'Solid bar, designed to cleanse the face, ranging from gentle to purifying.' },
                    
                ]
            },
            {
                name: 'Toner',
                description: 'Balances skin\'s pH, preps for better absorption of subsequent products, and removes any remaining impurities.',
                types: [
                    { 'Hydrating Toner/Mist': 'Contains humectants like hyaluronic acid to bind water to the skin. Suitable for all skin types.' },
                    { 'Calming Toner': 'Contains anti-inflammatories like cica or chamomile to reduce redness. Perfect for sensitive skin.' }
                ]
            },
            {
                name: 'Serum',
                description: 'Delivers concentrated active ingredients to address specific concerns like hydration or brightness.',
                types: [
                    { 'Vitamin C Serum': 'The gold standard. Brightens skin, boosts collagen, and enhances your sunscreen\'s protective power.' },
                    { 'Niacinamide Serum': 'Controls oil, reduces redness, minimizes pores, and provides antioxidant benefits.' },
                    { 'Other Antioxidant Serums': 'Formulas containing Vitamin E, Ferulic Acid, or Green Tea for broad protection.' }
                ]
            },
            {
                name: 'Eye Cream',
                description: 'Hydrates and targets delicate skin around the eyes, addressing concerns like fine lines or puffiness.',
                types: [
                    { 'Brightening Eye Cream (Vitamin C)': 'Helps to reduce the appearance of dark circles and provides antioxidant protection.' },
                    { 'Firming Eye Cream (Peptides)': 'Targets fine lines and loss of elasticity by signaling the skin to produce more collagen.' }
                ]
            },
            {
                name: 'Spot Treatment',
                description: 'Applies targeted treatment to specific blemishes or problem areas.',
                types: [
                    { 'Salicylic Acid Gel': 'An exfoliating BHA that gets into the pore to clear out oil and dead skin.' },
                    { 'Benzoyl Peroxide Cream': 'An anti-bacterial ingredient that kills acne-causing bacteria.' },
                    { 'Hydrocolloid Pimple Patch': 'A protective patch that absorbs fluid from a blemish and speeds up healing. Best applied to a clean, dry pimple.' }
                ]
            },
            {
                name: 'Moisturizer',
                description: 'Hydrates and strengthens the skin\'s barrier, sealing in moisture throughout the day.',
                types: [
                    { 'Gel Moisturizer': 'Lightweight and often oil-free, absorbs quickly without a heavy feel. Perfect for oily and acne-prone skin.' },
                    { 'Lotion': 'Lighter than a cream with a higher water content, great for normal or combination skin.' },
                    { 'Cream': 'A richer texture that provides more substantial hydration. Best for dry and mature skin.' }
                ]
            },
            {
                name: 'Face Oil',
                description: 'Provides an extra layer of nourishment and seals in moisture, leaving skin supple.',
                types: [
                    { 'Lighter Face Oil (e.g., Squalane)': 'Fast-absorbing and lightweight, mimics the skin\'s natural sebum.' },
                    { 'Heavier Face Oil (e.g., Rosehip)': 'Richer and more nourishing, offers regenerative and brightening benefits.' }
                ]
            },
            {
                name: 'Sunscreen',
                description: 'Protects skin from harmful UV rays, preventing sun damage and premature aging.',
                types: [
                    { 'Mineral Sunscreen': 'Sits on top of the skin to create a physical barrier. Best for sensitive skin. Contains Zinc Oxide or Titanium Dioxide.' },
                    { 'Chemical Sunscreen': 'Absorbs UV radiation and converts it into heat. Tends to be lighter and more transparent on the skin.' },
                    { 'Hybrid Sunscreen': 'Combines both mineral and chemical filters to offer broad protection with an elegant texture.' }
                ]
            }
        ],
        pm_routine: [
            {
                name: 'Oil Cleanser',
                description: 'First cleanse to dissolve makeup, sunscreen, and oil-based impurities from the day.',
                types: [
                    { 'Cleansing Oil': 'A liquid oil that is massaged onto dry skin and emulsifies into a milky liquid with water to rinse clean.' },
                    { 'Cleansing Balm': 'A solid balm that melts into an oil on contact with skin, providing a rich, effective cleanse.' }
                ]
            },
            {
                name: 'Water Cleanser',
                description: 'Second cleanse to remove water-based impurities and ensures a thorough clean, preparing skin for treatments.',
                types: [
                    { 'Gel Cleanser': 'For a deep clean, ideal for normal to oily skin.' },
                    { 'Cream Cleanser': 'For a gentle, hydrating wash, ideal for dry and sensitive skin.' },
                    { 'Foam Cleanser': 'Provides a rich lather for a thorough cleanse, good for combination skin.' }
                ]
            },
            {
                name: 'Exfoliate/Mask',
                description: 'Removes dead skin cells to improve texture or delivers concentrated ingredients for targeted concerns.',
                types: [
                    { 'Acid Exfoliant (AHA/BHA)': 'Chemically dissolves the bonds holding dead cells to the skin for a brighter, smoother surface.' },
                    { 'Clay Mask': 'Draws out impurities and absorbs excess oil from pores. Ideal for oily and congested skin.' },
                    { 'Hydrating Mask (Sheet/Rinse-off)': 'Delivers a potent, concentrated dose of hydrating and soothing ingredients.' }
                ]
            },
            {
                name: 'Toner/Essence',
                description: 'Restores skin\'s balance and provides an initial layer of hydration, aiding in product absorption.',
                types: [
                    { 'Hydrating Toner': 'A watery liquid that provides an initial layer of moisture and balances the skin.' },
                    { 'Essence': 'Slightly more viscous than a toner, packed with fermented ingredients to intensely hydrate and prep the skin.' }
                ]
            },
            {
                name: 'Treatment Serum',
                description: 'Delivers potent active ingredients to address specific overnight concerns like anti-aging or hyperpigmentation.',
                note: 'Use retinoids and strong exfoliating acids on alternate nights to avoid irritation.',
                types: [
                    { 'Retinoid Serum (Retinol/Retinal)': 'The gold standard for anti-aging. Accelerates cell turnover to treat wrinkles, texture, and acne.' },
                    { 'Peptide Serum': 'Helps with skin firmness and elasticity by signaling your skin to build more collagen.' },
                    { 'Hyaluronic Acid Serum': 'Plumps the skin with water to reduce the appearance of dehydration-induced fine lines.' }
                ]
            },
            {
                name: 'Eye Cream',
                description: 'Supports delicate undereye skin during its nightly repair process, targeting concerns like dark circles or fine lines.',
                types: [
                    { 'Retinol Eye Cream': 'Specifically formulated with a lower, gentle concentration of retinol for the delicate eye area to target fine lines.' },
                    { 'Peptide Eye Cream': 'A non-retinoid option for firming and strengthening the skin around the eyes.' }
                ]
            },
            {
                name: 'Moisturizer/Night Cream',
                description: 'Provides intense hydration and nourishment, supporting the skin\'s regeneration process overnight.',
                types: [
                    { 'Night Cream': 'A richer, more restorative cream than a daytime moisturizer, often with added repair ingredients.' },
                    { 'Standard Moisturizer (Lotion/Cream)': 'Your regular AM moisturizer can also be used, depending on your skin\'s needs.' }
                ]
            },
            {
                name: 'Face Oil/Mask',
                description: 'Locks in all previous layers of hydration and treatment, providing an occlusive barrier for enhanced absorption and repair.',
                types: [
                    { 'Face Oil': 'Apply a few drops over your moisturizer to act as a nourishing, comforting seal.' },
                    { 'Sleeping Mask': 'A cream or gel-cream specifically designed to be worn overnight as a breathable, final barrier.' },
                    { 'Ointment/Balm (Slugging)': 'For very dry skin, a thick balm provides the most powerful occlusive barrier to prevent water loss.' }
                ]
            }
        ]
    };

    const stepLevels = {
        'Cleanser': 'Essentials', 'Moisturize': 'Essentials', 'Sunscreen': 'Essentials',
        'Toner': 'Targeted', 'Serum': 'Targeted', 'Eye Cream': 'Targeted', 'Oil Cleanse': 'Enhanced', 'Water Cleanse': 'Enhanced',
        'Spot Treatment': 'Optional', 'Face Oil': 'Optional'
    };

    const levelColors = {
        'Essentials': 'bg-[#00973A] text-white',
        'Targeted': 'bg-[#24CEC5] text-white',
        'Optional': 'bg-[#D7B52E] text-white'
    };

    const elements = {
        page: document.getElementById('routine-page'),
        landingSection: document.getElementById('landing-section'),
        landingTitle: document.getElementById('landing-title'),
        landingBottle: document.getElementById('landing-bottle'),
        overlaySection: document.getElementById('overlay-section'),
        overlayWave: document.getElementById('overlay-wave'),
        overlayPrompt: document.getElementById('overlay-prompt'),
        stepsContainer: document.getElementById('steps-container'),
        menuButton: document.getElementById('menu-button'),
        sunButton: document.getElementById('sun-button'),
        moonButton: document.getElementById('moon-button'),
        body: document.body
    };

    const themeConfig = {
        am: {
            body: ['from-[#D5FFE8]', 'from-15%', 'to-[#58B989]'],
            landingTitle: ['text-transparent', 'bg-clip-text', 'bg-gradient-to-b', 'from-[#74CF97]', 'to-[#35714C]'],
            menuButton: ['text-gray-800'],
            sunButton: ['text-gray-800'],
            moonButton: ['text-gray-800'],
            overlayPrompt: ['text-[#28663D']
        },
        pm: {
            body: ['from-[#43BD8C]', 'from-15%', 'to-[#234638]'],
            landingTitle: ['text-transparent', 'bg-clip-text', 'bg-gradient-to-b', 'from-white', 'to-[#D0FFE0]'],
            menuButton: ['text-white'],
            sunButton: ['text-white'],
            moonButton: ['text-white'],
            overlayPrompt: ['text-white']
        }
    };


    // SINGLE STEP CONTAINER //
    function createStepElement(step, stepNumber, theme) {
        const div = document.createElement('div');
        
        const bgColor = theme === 'am' ? 'bg-white/50' : 'bg-gray-800/50';
        const numCircleColor = theme === 'am' ? 'bg-green-300 text-green-800' : 'bg-indigo-400 text-indigo-900';
        const titleColor = theme === 'am' ? 'text-gray-800' : 'text-gray-100';
        const descColor = theme === 'am' ? 'text-gray-600' : 'text-gray-400';
        
        // Box
        div.className = `relative max-md:px-4 max-md:py-6 max-md:mx-3 max-md:my-3 ${bgColor} rounded-2xl shadow-sm overflow-hidden lg:w-full lg:max-w-2xl`;

        const level = stepLevels[step.name] || 'Essentials';
        const colorClasses = levelColors[level] || 'bg-gray-400 text-white';
        const labelHTML = `<span class="absolute top-0 right-0 px-3 py-1 text-xs rounded-bl-xl ${colorClasses}">${level}</span>`; // Level

        const contentHTML = `
            <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-10 h-10 ${numCircleColor} rounded-full flex items-center justify-center font-bold">
                    ${stepNumber}
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-lg ${titleColor}">${step.name}</h3>
                    <p class="text-sm ${descColor}">${step.description}</p>
                </div>
                <div class="flex-shrink-0">
                    <svg class="w-6 h-6 ${descColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        `;
        
        div.innerHTML = labelHTML + contentHTML;
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


    // INTRO ANIMATION //
    function playIntroAnimation() {
        // Create a GSAP timeline to sequence the animations.
        const tl = gsap.timeline();
        
        const getFinalTitleY = () => {
            // The overlay's final height is 85vh, so its top is 15vh from the viewport top.
            const overlayFinalTop = window.innerHeight * 0.1;
            // We want the title to have some padding from the top of the overlay.
            const padding = 10; // 50px padding. Adjust this value as you like.
            // This is the absolute Y coordinate where we want the title's top edge to land.
            const finalYPosition = overlayFinalTop + padding;
            // Get the title's current position.
            const startYPosition = elements.landingTitle.getBoundingClientRect().top;
            // Calculate the distance it needs to travel.
            return finalYPosition - startYPosition;
        };
        const getFinalTitleScale = () => {
            return window.innerWidth < 768 ? 0.7 : 0.8;
        };

        tl.to(elements.overlaySection, {
        height: '78vh',
        duration: 1.2,
        ease: 'expo.inOut'
        }, 0);

        tl.to(elements.overlayWave, {
            attr: { d: "M0,100 C40,50 60,50 100,100 Z" },
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

        tl.to(elements.landingBottle, {
            y: '-380',
            opacity: 0,
            duration: 1.0,
            scale: 0.8,
            ease: 'power2.inOut'
        }, 0);

        tl.to(elements.landingTitle, {
            y: getFinalTitleY,
            scale: getFinalTitleScale,
            duration: 1.2,
            ease: 'expo.inOut'
        }, 0);

        tl.to(elements.overlayPrompt, {
            duration: 0.5,
            ease: 'power1.in'
        }, 0);

        tl.call(populateSteps, [], ">-0.2")
            .to(elements.stepsContainer, {
            opacity: 1,
            display: 'block',
            duration: 0.5
        });
        
    }


    // THEME TOGGLE //
    function applyTheme(theme) {
        const oldTheme = theme === 'am' ? 'pm' : 'am';

        if (theme === 'am') {
            elements.sunButton.classList.remove('hidden');
            elements.moonButton.classList.add('hidden');
        } else if (theme === 'pm') {
            elements.sunButton.classList.add('hidden');
            elements.moonButton.classList.remove('hidden');
        }

        // Loop through the config and apply classes
        for (const elName in themeConfig.am) {
            const element = elements[elName];
            if (element) {
                // Remove old theme's classes and add the new one's
                element.classList.remove(...themeConfig[oldTheme][elName]);
                element.classList.add(...themeConfig[theme][elName]);
            }
        }

        // Re-render the steps after changing theme
        populateSteps(theme);

    }


    // EVENT LISTENERS //
    // When the sun icon is clicked, switch to the 'pm' theme.
    elements.sunButton.addEventListener('click', () => applyTheme('pm'));
    // When the moon icon is clicked, switch back to the 'am' theme.
    elements.moonButton.addEventListener('click', () => applyTheme('am'));

    applyTheme('am'); 

    // The entire animation will play automatically when the page loads.
    gsap.delayedCall(0.5, playIntroAnimation);

});