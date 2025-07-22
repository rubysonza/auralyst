import './style.css'
import gsap from "gsap";


    // GSAP animations or any other scripts
    gsap.registerPlugin();
    
    // PAGE ELEMENTS
    const stepScroll = document.getElementById('step-scroll');
    const menuButton = document.getElementById('menu-button');
    const productGrid = document.getElementById('product-grid');
    const plpSection = document.getElementById('plp-section');
    const pdpSection = document.getElementById('pdp-section');

    const landingBottle = document.querySelector('#landing-bottle')
    const landingTitle = document.getElementById('landing-title')

    // SORT MENU
    const sortContainer = document.getElementById('sort-menu-container');
    const sortButton = document.getElementById('sort-menu-button');
    const sortPanel = document.getElementById('sort-menu-panel');
    const sortIcon = document.getElementById('sort-menu-icon');
    const selectedOptionSpan = document.getElementById('selected-sort-option');
    const sortOptions = sortPanel.querySelectorAll('a');
    const filterButton = document.getElementById('filter-button');

    // FILTER SIDEBAR
    const openFilter = document.getElementById('open-filter-button');
    const closeFilter = document.getElementById('close-filter-button');
    const sidebar = document.getElementById('filter-sidebar');
    const backdrop = document.getElementById('filter-backdrop');
     

    // VARIABLES
    let currentStep = '';
    let isDragging = false;
    let startX;
    let scrollLeft;
    let isSortOpen = false;
    let currentSortOption = 'best-match';
    let currentProducts = [];
    let allProducts = [];
    let activeFilters = {
        skin_types: [],
        skin_concerns: [],
        brand_name: []
    }


    // INTRO ANIMATION
    gsap.set([landingTitle, plpSection], { autoAlpha: 1 });
    // gsap.set(landingBottle, { y: '35vh', autoAlpha: 1 });

    // function introAnimation () {
    //     const tl = gsap.timeline();

    //     tl.to(landingBottle, { y: '-50vh', autoAlpha: 0, scale: 0.5, duration: 1.0, ease: 'power2.inOut' })
    //       .to([landingTitle, plpSection], { autoAlpha: 1, duration: 0.8, ease: 'power2.out'}, '>')
    // }


    // PLP
    function createProductCard(product) {
        return `
            <div class="product-card group relative flex flex-col w-auto h-auto overflow-hidden rounded-3xl border border-gray-300 bg-white cursor-pointer" data-product-name="${product.product_name}">
                <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none h-40">
                    <img src="${product.image_url}" alt="${product.brand_name} ${product.product_name}" class="h-full w-full object-cover object-center">
                </div>

                <div class="flex flex-1 flex-col space-y-1 p-2 sm:p-4">
                    <p class="text-xs sm:text-sm font-bold text-gray-900">${product.brand_name}</p>
                    <h3 class="text-sm sm:text-base font-medium text-gray-900">${product.product_name}</h3>
                    <p class="text-xs sm:text-sm font-medium text-gray-500">${product.product_type}</p>
                    
                    <div class="flex flex-1 items-center justify-between pt-2">
                        <p class="text-sm sm:text-lg font-semibold text-gray-900">$${product.price.toFixed(2)}</p>
                        
                        <button 
                            type="button" 
                            class="add-to-routine-btn rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                            data-product-name="${product.product_name}"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function setupProductCardActions() {
        const productGrid = document.getElementById('product-grid');
        productGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            if (card) {
                const productName = card.dataset.productName;
                console.log('Card clicked, finding product:', productName); // DEBUGGING
                const productToShow = allProducts.find(p => p.product_name === productName);
                if (productToShow) {
                    console.log('Product found:', productToShow); // DEBUGGING
                    showPDP(productToShow);
                } else {
                    console.error('Product not found in allProducts array:', productName); // DEBUGGING
                }
            }
        });
    }

    async function displayProducts(step) {
        if (!productGrid) return;
        
        // Reset filters and grid when changing steps
        currentSortOption = 'best-match';
        selectedOptionSpan.textContent = 'Sort by: Best Match';

        const filePath = `/products-list/${step}.json`;
        productGrid.innerHTML = `<p class="text-center text-gray-500">Loading products...</p>`;
        currentStep = step;

        try {
            const response = await fetch(filePath);
            const data = await response.json();
            allProducts = data[step] || data; // Handles both object and array-based JSON
            renderProductGrid(allProducts);
        } catch (error) {
            console.error("Error displaying products:", error);
            document.getElementById('product-grid').innerHTML = '<p>Could not load products.</p>';
        }
    }

    function showPLP() {
        pdpSection.classList.add('hidden');
        plpSection.classList.remove('hidden');
    }
    


    // PDP
    function showPDP(product) {
        renderPDP(product);
        plpSection.classList.add('hidden');
        pdpSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function renderPDP(product) {
        document.getElementById('pdp-image').src = product.image_url;
        document.getElementById('pdp-brand').textContent = product.brand_name;
        document.getElementById('pdp-name').textContent = product.product_name;
        document.getElementById('pdp-type').textContent = product.product_type;
        document.getElementById('pdp-price').textContent = `$${product.price.toFixed(2)}`;

        const skinTypesContainer = document.getElementById('pdp-skin-types');
        skinTypesContainer.innerHTML = (product.skin_types || []).map(type => {
            const colorClasses = skinTypeColors[type] || skinTypeColors.default;
            return `<span class="text-sm font-medium px-3 py-1 rounded-full ${colorClasses}">${type}</span>`;
        }).join('');

        const skinConcernsContainer = document.getElementById('pdp-skin-concerns');
        skinConcernsContainer.innerHTML = (product.skin_concerns || []).map(concern => `<span class="text-sm font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded-full">${concern}</span>`).join('');
        
        const keyActivesContainer = document.getElementById('pdp-key-actives');
        keyActivesContainer.innerHTML = (product.key_actives || []).map(active => `<div class="bg-gray-100 p-3 rounded-lg"><p class="font-medium text-gray-800">${active}</p></div>`).join('');

        const morningIcon = document.querySelector('#usage-time-morning .text-3xl');
        const morningRec = document.querySelector('#usage-time-morning .text-sm');
        const nightIcon = document.querySelector('#usage-time-night .text-3xl');
        const nightRec = document.querySelector('#usage-time-night .text-sm');

        morningIcon.textContent = '☀️';
        nightIcon.textContent = '🌙';

        if (product.usage_time === 'Both') {
            morningRec.textContent = 'Recommended'; morningRec.className = 'text-sm text-green-600 font-semibold';
            nightRec.textContent = 'Recommended'; nightRec.className = 'text-sm text-green-600 font-semibold';
        } else if (product.usage_time === 'Morning') {
            morningRec.textContent = 'Recommended'; morningRec.className = 'text-sm text-green-600 font-semibold';
            nightRec.textContent = 'Not Recommended'; nightRec.className = 'text-sm text-gray-400';
        } else if (product.usage_time === 'Night') {
            morningRec.textContent = 'Not Recommended'; nightRec.className = 'text-sm text-gray-400';
            nightRec.textContent = 'Recommended'; nightRec.className = 'text-sm text-green-600 font-semibold';
        }
    }

    const skinTypeColors = {
        "Normal": "bg-green-100 text-green-800",
        "Oily": "bg-blue-100 text-blue-800",
        "Dry": "bg-orange-100 text-orange-800",
        "Combination": "bg-purple-100 text-purple-800",
        "Sensitive": "bg-pink-100 text-pink-800",
        "All Skin Types": "bg-gray-200 text-gray-800",
        "default": "bg-gray-100 text-gray-800"
    };

    function setupPDPActions() {
        const addBtn = document.getElementById('add-to-routine-btn');
        addBtn.addEventListener('click', () => {
        console.log('Add to routine clicked!');
        });
    }



    // STEPS SCROLL/DRAG
    stepScroll.addEventListener('mousedown', (e) => {
        isDragging = true;
        stepScroll.classList.add('active:cursor-grabbing');
        startX = e.pageX - stepScroll.offsetLeft;
        scrollLeft = stepScroll.scrollLeft;
    });

    stepScroll.addEventListener('mouseleave', () => {
        isDragging = false;
        stepScroll.classList.remove('active:cursor-pointer');
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        stepScroll.classList.remove('active:cursor-pointer');
    });

    stepScroll.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - stepScroll.offsetLeft;
        const walk = (x -startX) * 0.8;

        stepScroll.scrollLeft = scrollLeft - walk;
    });



    // STEP BUTTONS
    function setupStepFilters() {
        const filterContainer = document.getElementById('step-filter');
        if (!filterContainer) return;

        filterContainer.addEventListener('click', (event) => {
            if (event.target.matches('.step-button')) {
                const step = event.target.dataset.step;

                console.log('Button clicked! Step:', step);

                const allButtons = filterContainer.querySelectorAll('.step-button');
                allButtons.forEach(btn => btn.classList.remove('active'));

                event.target.classList.add('active');

                displayProducts(step);
            }
            
        })
    }



    // SORT OPTIONS
    function renderProductGrid(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        productGrid.innerHTML = products.map(p => createProductCard(p)).join('');
    }



    function setupSortMenu() {
        if (!sortButton || !sortPanel || !selectedOptionSpan || !sortIcon) {
            console.error("Sort menu elements not found!");
            return;
        }

        // Event listener for the main sort button
        sortButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            sortPanel.classList.toggle('hidden');
            // 2. Toggle the rotation class on the icon
            sortIcon.classList.toggle('rotate-180');
        });

        // Event listener for the panel with the sort options
        sortPanel.addEventListener('click', (event) => {
            if (event.target.matches('a[data-sort]')) {
                event.preventDefault();

                currentSortOption = event.target.dataset.sort;
                selectedOptionSpan.textContent = `Sort by: ${event.target.textContent}`;
                
                filterAndSortProducts();

                // 3. Hide the panel and reset the icon
                sortPanel.classList.add('hidden');
                sortIcon.classList.remove('rotate-180');
            }
        });

        // Event listener to close the dropdown when clicking outside
        window.addEventListener('click', () => {
            if (!sortPanel.classList.contains('hidden')) {
                sortPanel.classList.add('hidden');
                // 4. Also reset the icon here
                sortIcon.classList.remove('rotate-180');
            }
        });
    }


    function filterAndSortProducts() {
        // Start with the full list of products for the current step.
        let processedProducts = [...allProducts];

        // --- 1. APPLY FILTERS FIRST ---
        if (activeFilters.skin_types.length > 0) {
            processedProducts = processedProducts.filter(p => 
                activeFilters.skin_types.some(type => p.skin_types.includes(type))
            );
        }
        if (activeFilters.skin_concerns.length > 0) {
            processedProducts = processedProducts.filter(p =>
                activeFilters.skin_concerns.some(type => p.skin_concerns.includes(type))
            );
        }
        if (activeFilters.brand_name.length > 0) {
            processedProducts = processedProducts.filter(p => 
                activeFilters.brand_name.includes(p.brand_name)
            );
        }
        // (Add other filters like skin_concerns here)

        // --- 2. SORT THE FILTERED RESULT ---
        switch (currentSortOption) {
            case 'price-low-high':
                processedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                processedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'best-match':
            default:
                // For 'best-match', we do nothing and keep the original filtered order.
                break;
        }
        
        // --- 3. RENDER THE FINAL RESULT ---
        renderProductGrid(processedProducts);
    }



    // FILTER SIDEBAR
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
        openFilter.classList.add('opacity-0');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
        openFilter.classList.remove('opacity-0');
        document.body.style.overflow = '';
    }

    async function initializeFilters() {
        const brandsContainer = document.getElementById('brands-list');
        if (!brandsContainer) return;

        // Set the initial loading message
        brandsContainer.innerHTML = '<p class="text-sm text-gray-400">Loading brands...</p>';

        // You can add or remove steps here as you clean up your JSON files
        const steps = ['cleanser', 'exfoliator', 'toner', 'serum', 'eye-cream', 'spot-treatment', 'moisturizer', 'face-oil', 'sunscreen', 'sleeping-mask'];

        try {
            // Create a fetch promise for each step
            const fetchPromises = steps.map(step =>
                fetch(`/products-list/${step}.json`).then(res => res.json())
            );

            // Wait for all fetch requests to complete
            const results = await Promise.all(fetchPromises);

            let allProductsForFilters = [];

            // Combine all products from all files into one big array
            results.forEach((data, index) => {
                const stepName = steps[index];
                // Access the array inside the object (e.g., data['cleanser'])
                if (data && data[stepName] && Array.isArray(data[stepName])) {
                    allProductsForFilters.push(...data[stepName]);
                }
            });

            // THIS IS THE MISSING STEP:
            // Now, call the function to populate the sidebar with the combined product list.
            populateBrandFilters(allProductsForFilters);

        } catch (error) {
            console.error("Could not initialize filters:", error);
            brandsContainer.innerHTML = '<p class="text-xs text-red-500">Error loading brands.</p>';
        }
    }

    // FILTER: Brands
    function populateBrandFilters(products) {
        const brandsContainer = document.getElementById('brands-list');
        if (!brandsContainer) return;

        const brandCounts = {};

        // Count occurrences of each brand
        products.forEach(product => {
            const brand = product.brand_name;
            if (brand) {
                brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            }
        });

        let brandsHTML = '';
        // Sort brands alphabetically for a clean list
        Object.keys(brandCounts).sort().forEach(brand => {
            const count = brandCounts[brand];
            const brandId = `filter-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`;
            brandsHTML += `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="${brandId}" type="checkbox" data-category="brand_name" data-value="${brand}" class="h-4 w-4 rounded border-gray-300 accent-[#764C7E] cursor-pointer">
                        <label for="${brandId}" class="ml-3 text-sm text-gray-600 cursor-pointer">${brand}</label>
                    </div>
                    <span class="text-xs text-gray-500">${count}</span>
                </div>
            `;
        });

        brandsContainer.innerHTML = brandsHTML;
    }



    function setupFilterSidebar() {
        if (!sidebar) return;

        sidebar.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                const category = event.target.dataset.category;
                const value = event.target.dataset.value;
                if (!category || !value) return;

                if (event.target.checked) {
                    activeFilters[category].push(value);
                } else {
                    activeFilters[category] = activeFilters[category].filter(item => item !== value);
                }

                // Call the master function to re-render the grid
                filterAndSortProducts();
            }
        });
    }

    openFilter.addEventListener('click', openSidebar);
    closeFilter.addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);




document.addEventListener('DOMContentLoaded', () => {

    setupSortMenu();
    setupStepFilters();
    setupFilterSidebar();
    setupProductCardActions();
    setupPDPActions();

    initializeFilters();

    displayProducts('cleanser');
    const defaultButton = document.querySelector('button[data-step="cleanser"]');
    if (defaultButton) {
        defaultButton.classList.add('active');
    }

    gsap.delayedCall(0.5, introAnimation);


    renderPDP(productData);

    
});

