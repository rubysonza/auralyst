import './style.css'
import gsap from "gsap";

const routines = {
    full_am: [
        {
            name: 'Cleanser',
            description: 'Gently removes sweat, oil, and residual products from the night before, creating a clean canvas without stripping the skin.',
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
            description: 'Dampens the skin, balances its natural pH, and primes it to better absorb the serums that follow.',
            types: [
                { 'Hydrating Toner/Mist': 'Contains humectants like hyaluronic acid to bind water to the skin. Suitable for all skin types.' },
                { 'Calming Toner': 'Contains anti-inflammatories like cica or chamomile to reduce redness. Perfect for sensitive skin.' }
            ]
        },
        {
            name: 'Serum',
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
            name: 'Moisturizer',
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
            name: 'Oil Cleanser',
            description: 'Dissolves and lifts oil-based impurities like stubborn makeup, sunscreen, and excess sebum based on the ‘like dissolves like’ principle.',
            types: [
                { 'Cleansing Oil': 'A liquid oil that is massaged onto dry skin and emulsifies into a milky liquid with water to rinse clean.' },
                { 'Cleansing Balm': 'A solid balm that melts into an oil on contact with skin, providing a rich, effective cleanse.' }
            ]
        },
        {
            name: 'Water Cleanser',
            description: 'Washes the skin itself, removing any remaining residue and ensuring pores are completely clean for nighttime treatments.',
            types: [
                { 'Gel Cleanser': 'For a deep clean, ideal for normal to oily skin.' },
                { 'Cream Cleanser': 'For a gentle, hydrating wash, ideal for dry and sensitive skin.' },
                { 'Foam Cleanser': 'Provides a rich lather for a thorough cleanse, good for combination skin.' }
            ]
        },
        {
            name: 'Exfoliant/Mask',
            note: 'Use only 2-3 times per week, not nightly.',
            description: 'A targeted treatment step to promote cell turnover or address specific issues like congestion or dehydration.',
            types: [
                { 'Acid Exfoliant (AHA/BHA)': 'Chemically dissolves the bonds holding dead cells to the skin for a brighter, smoother surface.' },
                { 'Clay Mask': 'Draws out impurities and absorbs excess oil from pores. Ideal for oily and congested skin.' },
                { 'Hydrating Mask (Sheet/Rinse-off)': 'Delivers a potent, concentrated dose of hydrating and soothing ingredients.' }
            ]
        },
        {
            name: 'Toner/Essence',
            description: 'Immediately replenishes hydration after cleansing. An essence is typically more concentrated and aids in product absorption.',
            types: [
                { 'Hydrating Toner': 'A watery liquid that provides an initial layer of moisture and balances the skin.' },
                { 'Essence': 'Slightly more viscous than a toner, packed with fermented ingredients to intensely hydrate and prep the skin.' }
            ]
        },
        {
            name: 'Treatment Serum',
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
            name: 'Moisturizer/Night Cream',
            description: 'Delivers sustained hydration and helps repair the skin barrier. Night creams are typically richer to support regeneration.',
            types: [
                { 'Night Cream': 'A richer, more restorative cream than a daytime moisturizer, often with added repair ingredients.' },
                { 'Standard Moisturizer (Lotion/Cream)': 'Your regular AM moisturizer can also be used, depending on your skin\'s needs.' }
            ]
        },
        {
            name: 'Face Oil/Mask',
            description: 'Creates a final occlusive barrier that locks in your entire routine, preventing moisture loss while you sleep.',
            types: [
                { 'Face Oil': 'Apply a few drops over your moisturizer to act as a nourishing, comforting seal.' },
                { 'Sleeping Mask': 'A cream or gel-cream specifically designed to be worn overnight as a breathable, final barrier.' },
                { 'Ointment/Balm (Slugging)': 'For very dry skin, a thick balm provides the most powerful occlusive barrier to prevent water loss.' }
            ]
        }
    ]
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
    sunButton: document.getElementById('sun-button'),
    moonButton: document.getElementById('moon-button'),
    body: document.body
};

// SINGLE STEP CONTAINER
function createStepElement(step) {
    const div = document.createElement('div');
    div.className = 'p-4 bg-white/50 rounded-lg';
    div.innerHTML = `<h3 class="font-bold">${step.name}</h3><p class="text-sm">${step.description}</p>`;
    return div;
}

// POPULATE STEP CONTAINER WITH ROUTINE STEPS
function populateSteps() {
    // Clear any existing steps
    elements.stepsContainer.innerHTML = '';
    
    // Get the morning routine from the data
    const morningRoutine = routines.am_routine || [];
    
    // Create and append an element for each step
    morningRoutine.forEach(step => {
        const stepElement = createStepElement(step);
        elements.stepsContainer.appendChild(stepElement);
    });
}

