import './style.css'
import gsap from "gsap";


const routines = {
    // --- BASIC LEVEL ---
    basic_am: [
        {
            name: 'Cleanse',
            description: 'A gentle wash to remove overnight oils and prepare a fresh canvas for the day.',
            types: [
                { 'Cream Cleanser': 'A gentle, hydrating wash that cleanses without stripping lipids. Ideal for dry and sensitive skin.' },
                { 'Foam Cleanser': 'Provides a rich lather for a thorough cleanse, good for combination skin and those who prefer a "clean" feel.' },
                { 'Micellar Water': 'A very gentle, no-rinse option using a cotton pad for a quick refresh or for very sensitive skin.' }
            ]
        },
        {
            name: 'Moisturize',
            description: 'Hydrates the skin and reinforces its natural protective barrier for all-day resilience.',
            types: [
                { 'Gel Moisturizer': 'Lightweight and often oil-free, absorbs quickly without a heavy feel. Perfect for oily and acne-prone skin.' },
                { 'Lotion': 'Lighter than a cream with a higher water content, great for normal or combination skin.' },
                { 'Cream': 'A richer texture that provides more substantial hydration. Best for dry and mature skin.' }
            ]
        },
        {
            name: 'Protect (Sunscreen)',
            description: 'The most critical step to shield skin from UV damage, preventing premature aging and reducing skin cancer risk.',
            types: [
                { 'Mineral Sunscreen': 'Sits on top of the skin to create a physical barrier. Best for sensitive skin. Contains Zinc Oxide or Titanium Dioxide.' },
                { 'Chemical Sunscreen': 'Absorbs UV radiation and converts it into heat. Tends to be lighter and more transparent on the skin.' },
                { 'Hybrid Sunscreen': 'Combines both mineral and chemical filters to offer broad protection with an elegant texture.' }
            ]
        }
    ],
    basic_pm: [
        {
            name: 'Cleanse',
            description: 'Removes the day\'s accumulation of sunscreen, makeup, dirt, and oil, ensuring skin is clean before its overnight repair cycle.',
            types: [
                { 'Gel Cleanser': 'Has a clear, gel-like consistency for deep cleaning. Best suited for normal, oily, and acne-prone skin.' },
                { 'Cream Cleanser': 'A gentle, hydrating wash that cleanses without stripping lipids. Ideal for dry and sensitive skin.' },
                { 'Oil Cleanser': 'Use on dry skin to dissolve makeup and sunscreen before washing. Excellent for a first cleanse step.' }
            ]
        },
        {
            name: 'Moisturize',
            description: 'Delivers essential hydration and supports the skin\'s natural regeneration process while you sleep.',
            types: [
                { 'Lotion': 'A good option for normal or combination skin that doesn\'t need heavy hydration overnight.' },
                { 'Cream / Night Cream': 'A richer texture that provides more substantial hydration and repair. Best for dry and mature skin, or anyone looking for extra nourishment.' }
            ]
        }
    ],
    // --- MEDIUM LEVEL ---
    medium_am: [
        {
            name: 'Cleanse',
            description: 'Removes impurities to prepare the skin for the products that follow, ensuring they can be absorbed effectively.',
            types: [
                { 'Cream Cleanser': 'A gentle, hydrating wash that cleanses without stripping lipids. Ideal for dry and sensitive skin.' },
                { 'Foam Cleanser': 'Provides a rich lather for a thorough cleanse, good for combination skin and those who prefer a "clean" feel.' },
                { 'Gel Cleanser': 'Has a clear, gel-like consistency for deep cleaning. Best suited for normal, oily, and acne-prone skin.' }
            ]
        },
        {
            name: 'Tone',
            description: 'Rebalances the skin’s pH, provides an initial layer of hydration, and preps the skin for better serum absorption.',
            types: [
                { 'Hydrating Toner/Mist': 'Contains humectants like hyaluronic acid to bind water to the skin. Suitable for all skin types.' },
                { 'Calming Toner': 'Contains anti-inflammatories like cica or chamomile to reduce redness. Perfect for sensitive skin.' }
            ]
        },
        {
            name: 'Treat (Antioxidant Serum)',
            description: 'Protects skin from daytime environmental damage with antioxidants like Vitamin C, which neutralize free radicals.',
            types: [
                { 'Vitamin C Serum': 'The gold standard. Brightens skin, boosts collagen, and enhances your sunscreen\'s protective power.' },
                { 'Niacinamide Serum': 'Controls oil, reduces redness, minimizes pores, and provides antioxidant benefits.' }
            ]
        },
        {
            name: 'Moisturize',
            description: 'Hydrates and reinforces the skin barrier, locking in the serum and maintaining overall skin health.',
            types: [
                { 'Gel Moisturizer': 'Lightweight and often oil-free, absorbs quickly without a heavy feel. Perfect for oily and acne-prone skin.' },
                { 'Lotion': 'Lighter than a cream with a higher water content, great for normal or combination skin.' },
                { 'Cream': 'A richer texture that provides more substantial hydration. Best for dry and mature skin.' }
            ]
        },
        {
            name: 'Protect (Sunscreen)',
            description: 'A non-negotiable final step in the morning to protect against UV damage, the primary cause of skin aging.',
            types: [
                { 'Mineral Sunscreen': 'Sits on top of the skin to create a physical barrier. Best for sensitive skin.' },
                { 'Chemical Sunscreen': 'Absorbs UV radiation and converts it into heat. Tends to be lighter and more transparent.' }
            ]
        }
    ],
    medium_pm: [
        {
            name: 'Cleanse',
            description: 'Thoroughly removes impurities, makeup, and sunscreen, creating a clean slate for nighttime treatment products to work effectively.',
            types: [
                { 'Oil Cleanser / Balm': 'The ideal first step to melt away makeup and sunscreen.' },
                { 'Gel Cleanser': 'A great second step after an oil cleanse for a deep clean, especially for oily skin.' },
                { 'Cream Cleanser': 'A gentle second step that cleanses without stripping, perfect for dry or sensitive skin.' }
            ]
        },
        {
            name: 'Tone',
            description: 'Restores skin\'s balance after cleansing and preps it to receive the active ingredients from your treatment serum.',
            types: [
                { 'Hydrating Toner': 'A watery liquid that provides an initial layer of moisture and balances the skin.' },
                { 'Exfoliating Toner': 'Contains gentle acids (AHA/BHA). Use only if this is your main exfoliating step for the night.' }
            ]
        },
        {
            name: 'Treat (Repair Serum)',
            description: 'Focuses on repair and renewal. Use serums with actives like retinoids for anti-aging or exfoliating acids for texture, allowing them to work undisturbed overnight.',
            note: 'Do not use a retinoid and an exfoliating acid in the same routine. Alternate nights to avoid irritation.',
            types: [
                { 'Retinoid Serum (Retinol/Retinal)': 'The gold standard for anti-aging. Accelerates cell turnover to treat wrinkles, texture, and acne.' },
                { 'Exfoliating Acid Serum (AHA/BHA)': 'A leave-on treatment to dissolve dead skin cells and improve skin clarity.' },
                { 'Peptide Serum': 'Helps with skin firmness and elasticity by signaling your skin to build more collagen.' },
                { 'Niacinamide Serum': 'A versatile choice that supports the skin barrier, calms inflammation, and helps with pores.' }
            ]
        },
        {
            name: 'Moisturize',
            description: 'Locks in the treatment serum and provides lasting hydration to support the skin barrier throughout the night.',
            types: [
                { 'Lotion': 'A good option for normal or combination skin that doesn\'t need heavy hydration overnight.' },
                { 'Night Cream': 'A richer, more restorative cream than a daytime moisturizer, often with added repair ingredients.' }
            ]
        }
    ],
    // --- FULL / ADVANCED LEVEL ---
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
    let currentLevel = 'full'; // Default level
    let currentTime = 'am'; // Default time

    const themeToggle = document.getElementById('theme-toggle');
    const levelToggle = document.getElementById('routine-level-toggle');
    const stepsContainer = document.getElementById('routine-steps');

    function updateDisplay() {
        const routine = routines[`${currentLevel}_${currentTime}`];
        const steps = routine[routineKey] || [];

        gsap.to(stepsContainer.children, {
            opacity: 0,
            x: -20,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                stepsContainer.innerHTML = ''; // Clear previous content
                steps.forEach((step, index) => {
                    const stepElement = createStepElement(step, index + 1);
                    stepsContainer.appendChild(stepElement);
                });
                gsap.from(stepsContainer.children, {
                    opacity: 0,
                    x: 20,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    }

    function createStepElement(step, stepNumber) {
        const button = document.createElement('button');
        button.className = 'step-item w-full text-left flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500';
        button.dataset.img = step.img;

        button.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-lg flex items-center justify-center font-bold text-md mr-4">
                ${stepNumber}
            </div>
            <span class="font-semibold text-gray-700 dark:text-gray-200">${step.name}</span>
        `;

        button.addEventListener('click', () => {
                    gsap.to(productImage, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                        productImage.src = button.dataset.img;
                        gsap.fromTo(productImage, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
                    }});
                });

                return button;
            }

            function updateActiveLevelButton() {
                levelToggle.querySelectorAll('button').forEach(button => {
                    if (button.dataset.level === currentLevel) {
                        button.classList.add('bg-purple-600', 'dark:bg-purple-500', 'text-white', 'shadow-md');
                    } else {
                        button.classList.remove('bg-purple-600', 'dark:bg-purple-500', 'text-white', 'shadow-md');
                    }
                });
            }
            
            // --- EVENT LISTENERS ---
            levelToggle.addEventListener('click', (e) => {
                const targetButton = e.target.closest('button');
                if (targetButton && targetButton.dataset.level) {
                    currentLevel = targetButton.dataset.level;
                    updateActiveLevelButton();
                    updateDisplay();
                }
            });

            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                currentTime = document.documentElement.classList.contains('dark') ? 'pm' : 'am';
                updateDisplay();
            });

            // --- INITIALIZATION ---
            updateActiveLevelButton();
            updateDisplay();
});