import './style.css'
import gsap from "gsap";

const routines = {
    full_am: [
        {
            name: 'Cleanse',
            description: 'Gently removes sweat, oil, and residual products from the night before, creating a clean canvas without stripping the skin.',
            types: [
                { 'Water-Based Cleanser (Gel)': 'Has a clear, gel-like consistency for deep cleaning. Best suited for normal, oily, and acne-prone skin.' },
                { 'Water-Based Cleanser (Cream)': 'A gentle, hydrating wash that cleanses without stripping lipids. Ideal for dry and sensitive skin.' },
                { 'Micellar Water': 'A very gentle, no-rinse option using a cotton pad for a quick refresh or for very sensitive skin.' }
            ]
        },
        {
            name: 'Tone',
            description: 'Dampens the skin, balances its natural pH, and primes it to better absorb the serums that follow.',
            types: [
                { 'Hydrating Toner/Mist': 'Contains humectants like hyaluronic acid to bind water to the skin. Suitable for all skin types.' },
                { 'Calming Toner': 'Contains anti-inflammatories like cica or chamomile to reduce redness. Perfect for sensitive skin.' }
            ]
        },
        {
            name: 'Antioxidant Serum',
            description: 'Neutralizes free radicals from UV rays and pollution that cause premature aging. This is your essential shield.',
            types: [
                { 'Vitamin C Serum': 'The gold standard. Brightens skin, boosts collagen, and enhances your sunscreen\'s protective power.' },
                { 'Niacinamide Serum': 'Controls oil, reduces redness, minimizes pores, and provides antioxidant benefits.' },
                { 'Other Antioxidant Serums': 'Formulas containing Vitamin E, Ferulic Acid, or Green Tea for broad protection.' }
            ]
        },
        {
            name: 'Eye Cream',
            description: 'Hydrates and protects the delicate skin around the eyes, which is thinner and more prone to showing signs of aging.',
            types: [
                { 'Brightening Eye Cream (Vitamin C)': 'Helps to reduce the appearance of dark circles and provides antioxidant protection.' },
                { 'Firming Eye Cream (Peptides)': 'Targets fine lines and loss of elasticity by signaling the skin to produce more collagen.' }
            ]
        },
        {
            name: 'Spot Treatment',
            note: 'Optional step, only use when needed.',
            description: 'Targets active blemishes with potent ingredients, allowing the treatment to work directly on the skin before being sealed in.',
            types: [
                { 'Salicylic Acid Gel': 'An exfoliating BHA that gets into the pore to clear out oil and dead skin.' },
                { 'Benzoyl Peroxide Cream': 'An anti-bacterial ingredient that kills acne-causing bacteria.' },
                { 'Hydrocolloid Pimple Patch': 'A protective patch that absorbs fluid from a blemish and speeds up healing. Best applied to a clean, dry pimple.' }
            ]
        },
        {
            name: 'Moisturize',
            description: 'Hydrates the skin and locks in the serums you\'ve applied. A moisturizer supports your skin barrier, keeping it healthy and resilient.',
            types: [
                { 'Gel Moisturizer': 'Lightweight and often oil-free, absorbs quickly without a heavy feel. Perfect for oily and acne-prone skin.' },
                { 'Lotion': 'Lighter than a cream with a higher water content, great for normal or combination skin.' },
                { 'Cream': 'A richer texture that provides more substantial hydration. Best for dry and mature skin.' }
            ]
        },
        {
            name: 'Face Oil',
            note: 'Optional step, for those needing extra nourishment.',
            description: 'Provides an extra layer of nourishment and creates a soft seal over your moisturizer for a healthy glow. Always apply after moisturizer.',
            types: [
                { 'Lighter Face Oil (e.g., Squalane)': 'Fast-absorbing and lightweight, mimics the skin\'s natural sebum.' },
                { 'Heavier Face Oil (e.g., Rosehip)': 'Richer and more nourishing, offers regenerative and brightening benefits.' }
            ]
        },
        {
            name: 'Sunscreen',
            description: 'The most critical step for skin health. It protects your skin from UV damage, the primary cause of premature aging and skin cancer.',
            types: [
                { 'Mineral Sunscreen': 'Sits on top of the skin to create a physical barrier. Best for sensitive skin. Contains Zinc Oxide or Titanium Dioxide.' },
                { 'Chemical Sunscreen': 'Absorbs UV radiation and converts it into heat. Tends to be lighter and more transparent on the skin.' },
                { 'Hybrid Sunscreen': 'Combines both mineral and chemical filters to offer broad protection with an elegant texture.' }
            ]
        }
    ],
    full_pm: [
        {
            name: 'First Cleanse (Oil-Based)',
            description: 'Dissolves and lifts oil-based impurities like stubborn makeup, sunscreen, and excess sebum based on the ‘like dissolves like’ principle.',
            types: [
                { 'Cleansing Oil': 'A liquid oil that is massaged onto dry skin and emulsifies into a milky liquid with water to rinse clean.' },
                { 'Cleansing Balm': 'A solid balm that melts into an oil on contact with skin, providing a rich, effective cleanse.' }
            ]
        },
        {
            name: 'Second Cleanse (Water-Based)',
            description: 'Washes the skin itself, removing any remaining residue and ensuring pores are completely clean for nighttime treatments.',
            types: [
                { 'Gel Cleanser': 'For a deep clean, ideal for normal to oily skin.' },
                { 'Cream Cleanser': 'For a gentle, hydrating wash, ideal for dry and sensitive skin.' },
                { 'Foam Cleanser': 'Provides a rich lather for a thorough cleanse, good for combination skin.' }
            ]
        },
        {
            name: 'Exfoliate or Mask',
            note: 'Use only 2-3 times per week, not nightly.',
            description: 'A targeted treatment step to promote cell turnover or address specific issues like congestion or dehydration.',
            types: [
                { 'Acid Exfoliant (AHA/BHA)': 'Chemically dissolves the bonds holding dead cells to the skin for a brighter, smoother surface.' },
                { 'Clay Mask': 'Draws out impurities and absorbs excess oil from pores. Ideal for oily and congested skin.' },
                { 'Hydrating Mask (Sheet/Rinse-off)': 'Delivers a potent, concentrated dose of hydrating and soothing ingredients.' }
            ]
        },
        {
            name: 'Tone / Essence',
            description: 'Immediately replenishes hydration after cleansing. An essence is typically more concentrated and aids in product absorption.',
            types: [
                { 'Hydrating Toner': 'A watery liquid that provides an initial layer of moisture and balances the skin.' },
                { 'Essence': 'Slightly more viscous than a toner, packed with fermented ingredients to intensely hydrate and prep the skin.' }
            ]
        },
        {
            name: 'Treatment Serum (Actives)',
            description: 'The primary repair step of your routine, where potent active ingredients work overnight to target specific skin concerns.',
            note: 'Use retinoids and strong exfoliating acids on alternate nights to avoid irritation.',
            types: [
                { 'Retinoid Serum (Retinol/Retinal)': 'The gold standard for anti-aging. Accelerates cell turnover to treat wrinkles, texture, and acne.' },
                { 'Peptide Serum': 'Helps with skin firmness and elasticity by signaling your skin to build more collagen.' },
                { 'Hyaluronic Acid Serum': 'Plumps the skin with water to reduce the appearance of dehydration-induced fine lines.' }
            ]
        },
        {
            name: 'Eye Cream',
            description: 'Nourishes the delicate eye area and acts as a buffer, protecting it from potent actives used on the rest of the face.',
            types: [
                { 'Retinol Eye Cream': 'Specifically formulated with a lower, gentle concentration of retinol for the delicate eye area to target fine lines.' },
                { 'Peptide Eye Cream': 'A non-retinoid option for firming and strengthening the skin around the eyes.' }
            ]
        },
        {
            name: 'Moisturize / Night Cream',
            description: 'Delivers sustained hydration and helps repair the skin barrier. Night creams are typically richer to support regeneration.',
            types: [
                { 'Night Cream': 'A richer, more restorative cream than a daytime moisturizer, often with added repair ingredients.' },
                { 'Standard Moisturizer (Lotion/Cream)': 'Your regular AM moisturizer can also be used, depending on your skin\'s needs.' }
            ]
        },
        {
            name: 'Final Seal (Oil or Sleeping Mask)',
            description: 'Creates a final occlusive barrier that locks in your entire routine, preventing moisture loss while you sleep.',
            types: [
                { 'Face Oil': 'Apply a few drops over your moisturizer to act as a nourishing, comforting seal.' },
                { 'Sleeping Mask': 'A cream or gel-cream specifically designed to be worn overnight as a breathable, final barrier.' },
                { 'Ointment/Balm (Slugging)': 'For very dry skin, a thick balm provides the most powerful occlusive barrier to prevent water loss.' }
            ]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    let currentTime = 'am';
    const stepLevels = {
        'Cleanse':'Essentials','Moisturize':'Essentials','Sunscreen':'Essentials','First Cleanse (Oil-Based)':'Essentials','Second Cleanse (Water-Based)':'Essentials','Moisturize / Night Cream':'Essentials',
        'Tone':'Enhanced','Antioxidant Serum':'Enhanced','Treat (Repair Serum)':'Enhanced','Antioxidant Serum':'Enhanced',
        'Exfoliate or Mask':'Advanced','Eye Cream':'Advanced','Spot Treatment':'Advanced','Face Oil':'Advanced','Tone / Essence':'Advanced','Treatment Serum (Actives)':'Advanced','Final Seal (Oil or Sleeping Mask)':'Advanced'};
    const levelColors = {'Essentials':'bg-green-700 text-white','Enhanced':'bg-green-500 text-white','Advanced':'bg-green-300 text-green-800'};
    
    const themeToggle = document.getElementById('theme-toggle');
    const stepsContainer = document.getElementById('routine-steps-container');
    const ctaButton = document.getElementById('cta-button');
    const body = document.body;
    const headerBg = document.getElementById('header-bg');
    const waveSvg = document.getElementById('wave-svg');
    const mainContent = document.getElementById('main-content');
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    const footer = document.getElementById('footer');

// AM/PM THEME
    const themeClasses = {
        am: {
            body: ['bg-white', 'text-gray-800'],
            headerBg: ['from-gray-100', 'to-gray-200'],
            waveSvg: ['text-white'],
            mainContent: ['bg-white'],
            mainTitle: ['text-gray-800'],
            mainSubtitle: ['text-gray-600'],
            footer: ['bg-white/70', 'border-gray-200']
        },
        pm: {
            body: ['bg-gray-900', 'text-gray-200', 'is-pm'],
            headerBg: ['from-gray-800', 'to-gray-900'],
            waveSvg: ['text-gray-900'],
            mainContent: ['bg-gray-900'],
            mainTitle: ['text-white'],
            mainSubtitle: ['text-gray-400'],
            footer: ['bg-gray-900/70', 'border-gray-700']
        }
    };
    
// THEME SWITCH
    function applyTheme(theme) {
        const currentTheme = theme === 'pm' ? 'am' : 'pm';
        Object.keys(themeClasses[theme]).forEach(elementKey => {
            const el = eval(elementKey);
            if (el) {
                el.classList.remove(...themeClasses[currentTheme][elementKey]);
                el.classList.add(...themeClasses[theme][elementKey]);
            }
        });
    }

// RENDERS STEPS
    function updateDisplay() {
        const routineKey = `full_${currentTime}`;
        const steps = routines[routineKey] || [];
        
        if (!stepsContainer) return;

        // ANIMATES STEPS
        const renderNewSteps = () => {
            stepsContainer.innerHTML = '';
            steps.forEach((step, index) => {
                const stepElement = createStepElement(step, index + 1);
                stepsContainer.appendChild(stepElement);
            });
            gsap.from(stepsContainer.children, { opacity: 0, x: 20, stagger: 0.1, duration: 0.4, ease: 'power2.out' });
            updateCtaButton();
        };

        if (stepsContainer.children.length > 0) {
            gsap.to(stepsContainer.children, { opacity: 0, x: -20, stagger: 0.05, duration: 0.3, onComplete: renderNewSteps });
        } else {
            renderNewSteps();
        }
    }

// CREATES STEP CARD
    function createStepElement(step, stepNumber) {
        const div = document.createElement('div');
        div.className = `step-item relative w-full text-left p-4 bg-gray-50 rounded-lg shadow-sm overflow-hidden ${currentTime === 'pm' ? 'dark-step' : ''}`;
        
        if (currentTime === 'pm') {
            div.classList.add('bg-gray-800');
        }
        
        const level = stepLevels[step.name] || 'Advanced';
        const colorClasses = levelColors[level] || 'bg-gray-400 text-white';
        const labelHTML = `<span class="absolute top-0 right-0 px-2 py-1 text-xs font-bold rounded-bl-lg ${colorClasses}">${level}</span>`;
        const noteHTML = step.note ? `<p class="text-xs text-yellow-500 mt-1 ${currentTime === 'pm' ? 'text-yellow-300' : ''}">${step.note}</p>` : '';
        const typesHTML = Array.isArray(step.types) ? step.types.map(typeObj => {
            const [typeName, typeDesc] = Object.entries(typeObj)[0];
            return `<li class="mt-2"><strong class="font-semibold ${currentTime === 'pm' ? 'text-green-400' : 'text-green-700'}">${typeName}:</strong> <span class="${currentTime === 'pm' ? 'text-gray-400' : 'text-gray-600'}">${typeDesc}</span></li>`;
        }).join('') : '';

        div.innerHTML = `
            ${labelHTML}
            <div class="flex items-start">
                <input type="checkbox" checked class="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300 mt-1 mr-4 flex-shrink-0">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-md mr-4 ${currentTime === 'pm' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600'}">
                    ${stepNumber}
                </div>
                <div class="flex-grow">
                    <h3 class="font-semibold text-lg ${currentTime === 'pm' ? 'text-gray-200' : 'text-gray-800'}">${step.name}</h3>
                    <p class="text-sm mt-1 ${currentTime === 'pm' ? 'text-gray-400' : 'text-gray-600'}">${step.description}</p>
                    ${noteHTML}
                </div>
            </div>
            ${typesHTML ? `
            <details class="mt-3 ml-20">
                <summary class="text-sm font-semibold cursor-pointer focus:outline-none ${currentTime === 'pm' ? 'text-green-400' : 'text-green-600'}">View Product Types</summary>
                <ul class="list-disc pl-5 mt-2 text-sm">
                    ${typesHTML}
                </ul>
            </details>` : ''}
        `;
        
        const checkbox = div.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            div.classList.toggle('is-unchecked', !checkbox.checked);
            updateCtaButton();
        });

        return div;
    }

// STEP COUNTER
    function updateCtaButton() {
        if (!ctaButton) return;
        const checkedCount = stepsContainer.querySelectorAll('input[type="checkbox"]:checked').length;
        ctaButton.textContent = `Find Products for ${checkedCount} Step${checkedCount !== 1 ? 's' : ''}`;
    }
    
    // TOGGLES THEME
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTime = (currentTime === 'am') ? 'pm' : 'am';
            applyTheme(currentTime);
            updateDisplay();
        });
    }
    
    // GOES TO 'PRODUCT' PAGE
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const selectedSteps = Array.from(stepsContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.closest('.step-item').querySelector('h3').textContent);
            console.log("Selected steps:", selectedSteps);
            alert(`Proceeding to product page with ${selectedSteps.length} steps!`);
        });
    }

    function scrollAnimation() {
        gsap.to("#header-bottle", {
            y:"-50%",
            ease: "none",
            delay: "none",
            scrollTrigger: {
                trigger: "#page-container",
                start: "top top",
                end: "20% top",
                scrub: true,
            }
        });
        gsap.to(["#header-bg", "#header-wave"], {
            y: "-100%",
            scrollTrigger: {
                trigger: "#page-container",
                start: "50% top",
                end: "50% top",
                scrub: true,
            }
        });
        ScrollTrigger.create({
            trigger: "#main-subtitle",
            markers: true,
            start: "top top+=20px",
            endTrigger: "#routine-steps-container",
            end: "bottom top+=300px",
            pin: true,
            pinSpacing: false,
        });
    }

    updateDisplay();
    scrollAnimation();
});