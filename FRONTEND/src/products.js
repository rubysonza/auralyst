import './style.css'
import gsap from "gsap";


    // GSAP animations or any other scripts
    gsap.registerPlugin();
    
    // BUTTONS
    const menuButton = document.getElementById('menu-button');
    const backButton = document.getElementById('back-button');
    const fsSection = document.getElementById('filter-sort-section');

    // PAGE ELEMENTS
    const landingBottle = document.querySelector('#landing-bottle');
    const headerTitle = document.getElementById('header-title');

    // MAIN CONTENT
    const mainContent = document.getElementById('main-content');
    const stepScroll = document.getElementById('step-scroll');
    const stepFilter = document.getElementById('step-filter');
    const productGrid = document.getElementById('product-grid');
    const plpSection = document.getElementById('plp-section');
    const pdpSection = document.getElementById('pdp-section');

    // SORT MENU
    const sortContainer = document.getElementById('sort-menu-container');
    const sortButton = document.getElementById('sort-menu-button');
    const sortPanel = document.getElementById('sort-menu-panel');
    const sortIcon = document.getElementById('sort-menu-icon');
    const selectedOptionSpan = document.getElementById('selected-sort-option');
    const sortOptions = sortPanel.querySelectorAll('a');
    
    // FILTER SIDEBAR
    const openFilter = document.getElementById('open-filter-button');
    const closeFilter = document.getElementById('close-filter-button');
    const sidebar = document.getElementById('filter-sidebar');
    const backdrop = document.getElementById('filter-backdrop');
    const activeFilters = document.getElementById('active-filters-container');
     

    // VARIABLES
    let lastScrollY = window.scrollY;
    let lastScrollPosition = 0;
    let currentStep = '';
    let isDragging = false;
    let startX;
    let scrollLeft;
    let isSortOpen = false;
    let currentSortOption = 'best-match';
    let currentProducts = [];
    let allProducts = [];
    let filters = {
        skin_types: [],
        skin_concerns: [],
        brand_name: []
    }


    // INTRO ANIMATION
    gsap.set([headerTitle, plpSection], { autoAlpha: 1 });
    // gsap.set(landingBottle, { y: '35vh', autoAlpha: 1 });

    // function introAnimation () {
    //     const tl = gsap.timeline();

    //     tl.to(landingBottle, { y: '-50vh', autoAlpha: 0, scale: 0.5, duration: 1.0, ease: 'power2.inOut' })
    //       .to([headerTitle, plpSection], { autoAlpha: 1, duration: 0.8, ease: 'power2.out'}, '>')
    // }


    // PLP
    function createProductCard(product) {
        return `
            <div class="product-card group relative flex flex-col w-auto h-auto overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg cursor-pointer" data-product-name="${product.product_name}">
                <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none h-40">
                    <img src="${product.image_url}" alt="${product.brand_name} ${product.product_name}" class="h-full w-full object-contain object-center bg-white">
                </div>

                <div class="flex flex-1 flex-col space-y-1 p-2 sm:p-4">
                    <p class="text-sm font-bold text-gray-900">${product.brand_name}</p>
                    <h3 class="text-base font-medium text-gray-900">${product.product_name}</h3>
                    <p class="text-sm font-medium text-gray-500">${product.product_type}</p>
                    
                    <div class="flex flex-1 items-end justify-center">
                        <div class="flex flex-1 items-center justify-between py-2">
                            <p class="text-lg font-semibold text-gray-900">$${product.price.toFixed(2)}</p>
                            
                            <button 
                                type="button" 
                                class="add-to-routine-btn rounded-full bg-[#7D32FF] p-2 px-3 text-white shadow-sm hover:bg-[#6524D5] focus-visible:outline-offset-2 cursor-pointer"
                                data-product-name="${product.product_name}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function displayProducts(step) {
        if (!productGrid) return;
        
        currentSortOption = 'best-match';
        selectedOptionSpan.textContent = 'Sort by: Best Match';

        const filePath = `/products-list/${step}.json`;
        productGrid.innerHTML = `<p class="text-center text-gray-500">Loading products...</p>`;
        currentStep = step;

        try {
            const response = await fetch(filePath);
            const data = await response.json();
            allProducts = data[step] || data;
            filterAndSortProducts(); 
        } catch (error) {
            console.error("Error displaying products:", error);
            document.getElementById('product-grid').innerHTML = '<p>Could not load products.</p>';
        }
    }

    // Click event for product cards
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

    function showPLP() {
        pdpSection.classList.add('hidden');
        plpSection.classList.remove('hidden');
        window.scrollTo(0, lastScrollPosition);
    }
    


    // PDP
    function showPDP(product) {
        lastScrollPosition = window.scrollY;
        renderPDP(product);
        plpSection.classList.add('hidden');
        pdpSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    const skinTypeColors = {
        "Normal": "bg-green-100 text-green-800",
        "Oily": "bg-blue-100 text-blue-800",
        "Dry": "bg-orange-100 text-orange-800",
        "Combination": "bg-purple-100 text-purple-800",
        "Sensitive": "bg-pink-100 text-pink-800",
    };

    function renderPDP(product) {
        const imageLink = document.getElementById('pdp-image-link');
        const image = document.getElementById('pdp-image');

        image.src = product.image_url;
        imageLink.href = product.product_url || '#';
        
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
        skinConcernsContainer.innerHTML = (product.skin_concerns || []).map(concern => `
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-green-500 mr-2 flex-shrink-0">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700 text-sm">${concern}</span>
            </div>
        `).join('');
        
        const keyActivesContainer = document.getElementById('pdp-key-actives');
        keyActivesContainer.innerHTML = (product.key_actives || []).map(active => `<div class="p-2 rounded-lg"><p class="text-gray-800">${active}</p></div>`).join('');

        const usageContainer = document.getElementById('pdp-usage-time');
            let usageHTML = '';
            let usageClasses = 'flex items-center justify-evenly p-4 rounded-lg border';

            const morningHTML = `
                <div class="flex items-center gap-2 text-[#575000]">
                    <span class="text-lg ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" />
                        </svg>
                    </span>
                    <span class="font-medium">Morning</span>
                </div>`;
            const nightHTML = `
                <div class="flex items-center gap-2 text-[#002557]">
                    <span class="text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z" />
                        </svg>
                    </span>
                    <span class="font-medium">Night</span>
                </div>`;
            const divider = `<div class="h-6 w-px bg-gray-300 mx-4"></div>`;

            if (product.usage_time === 'Both') {
                usageHTML = `${morningHTML}${divider}${nightHTML}`;
                usageClasses += ' bg-gradient-to-r from-yellow-200 to-blue-200 border-gray-200';
            } else if (product.usage_time === 'Morning') {
                usageHTML = morningHTML;
                usageClasses += ' bg-yellow-100 border-yellow-200';
            } else if (product.usage_time === 'Night') {
                usageHTML = nightHTML;
                usageClasses += ' bg-blue-100 border-blue-200';
            }
            
            usageContainer.innerHTML = usageHTML;
            usageContainer.className = usageClasses;

            const morningBtn = document.getElementById('select-morning-btn');
            const nightBtn = document.getElementById('select-night-btn');

            // 1. Reset both buttons to their default enabled state
            morningBtn.disabled = false;
            nightBtn.disabled = false;
            
            // 2. Disable buttons based on usage_time
            if (product.usage_time === 'Morning') {
                nightBtn.disabled = true;
            } else if (product.usage_time === 'Night') {
                morningBtn.disabled = true;
            }
    }

    function setupPDPActions() {
        const morningBtn = document.getElementById('select-morning-btn');
        const nightBtn = document.getElementById('select-night-btn');
        const addBtn = document.getElementById('add-to-routine-btn');
        const addBtnText = document.getElementById('add-to-routine-btn-text');
        const errorMsg = document.getElementById('cta-error-msg');

        let selectedRoutines = []; // Use an array for multi-select

        function updateButtonState() {
            // Update Morning Button
            if (selectedRoutines.includes('Morning')) {
                morningBtn.classList.add('active');
            } else {
                morningBtn.classList.remove('active');
            }

            // Update Night Button
            if (selectedRoutines.includes('Night')) {
                nightBtn.classList.add('active');
            } else {
                nightBtn.classList.remove('active');
            }

            // Update Main "Add to Routine" Button Text
            if (selectedRoutines.length === 0) {
                addBtnText.textContent = 'Add to Routine';
            } else if (selectedRoutines.length === 2) {
                addBtnText.textContent = 'Add to Morning & Night';
            } else {
                addBtnText.textContent = `Add to ${selectedRoutines[0]}`;
            }
        }

        morningBtn.addEventListener('click', () => {
            if (selectedRoutines.includes('Morning')) {
                selectedRoutines = selectedRoutines.filter(r => r !== 'Morning');
            } else {
                selectedRoutines.push('Morning');
            }
            updateButtonState();
        });

        nightBtn.addEventListener('click', () => {
            if (selectedRoutines.includes('Night')) {
                selectedRoutines = selectedRoutines.filter(r => r !== 'Night');
            } else {
                selectedRoutines.push('Night');
            }
            updateButtonState();
        });
        
        addBtn.addEventListener('click', () => {
            if (selectedRoutines.length === 0) {
                errorMsg.textContent = 'Please select a routine first.';
                setTimeout(() => { errorMsg.textContent = ''; }, 3000);
            } else {
                errorMsg.textContent = '';
                console.log(`Product added to: ${selectedRoutines.join(', ')} Routine(s)`);
                // Reset selection after adding
                selectedRoutines = [];
                updateButtonState();
            }
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



    // STEP SCROLL
    function setupStepFilters() {
        const filterContainer = document.getElementById('step-filter');
        if (!filterContainer || !stepScroll) return;

        filterContainer.addEventListener('click', (event) => {
            if (event.target.matches('.step-button')) {
                const button = event.target;
                const step = button.dataset.step;

                const allButtons = filterContainer.querySelectorAll('.step-button');
                allButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const scrollTarget = button.offsetLeft - 20;

                stepScroll.scrollTo({
                    left: scrollTarget,
                    behavior: 'smooth'
                });

                displayProducts(step);
            }
            
        })
    }



    // FILTER and SORT
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 150) {
            fsSection.classList.add('-translate-y-full');
        } else {
            fsSection.classList.remove('-translate-y-full');
        }

        lastScrollY = window.scrollY;
    })



    // SORT BY
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
        if (filters.skin_types.length > 0) {
            processedProducts = processedProducts.filter(p => 
                filters.skin_types.some(type => p.skin_types.includes(type))
            );
        }
        if (filters.skin_concerns.length > 0) {
            processedProducts = processedProducts.filter(p =>
                filters.skin_concerns.some(type => p.skin_concerns.includes(type))
            );
        }
        if (filters.brand_name.length > 0) {
            processedProducts = processedProducts.filter(p => 
                filters.brand_name.includes(p.brand_name)
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
        renderActiveFilterPills();
    }



    // FILTER SIDEBAR
    function openSidebar() {
        const filterTop = fsSection.getBoundingClientRect();

        sidebar.style.top = `${filterTop.top}px`;

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

        brandsContainer.innerHTML = '<p class="text-sm text-gray-400">Loading brands...</p>';

        const steps = ['cleanser', 'exfoliator', 'toner', 'serum', 'eye-cream', 'spot-treatment', 'moisturizer', 'face-oil', 'sunscreen', 'sleeping-mask'];

        try {
            const fetchPromises = steps.map(step =>
                fetch(`/products-list/${step}.json`).then(res => res.json())
            );

            const results = await Promise.all(fetchPromises);

            let allProductsForFilters = [];

            results.forEach((data, index) => {
                const stepName = steps[index];
                // Access the array inside the object (e.g., data['cleanser'])
                if (data && data[stepName] && Array.isArray(data[stepName])) {
                    allProductsForFilters.push(...data[stepName]);
                }
            });

            populateBrandFilters(allProductsForFilters);

        } catch (error) {
            console.error("Could not initialize filters:", error);
            brandsContainer.innerHTML = '<p class="text-xs text-red-500">Error loading brands.</p>';
        }
    }

    function renderActiveFilterPills() {
        if (!activeFilters) return;

        let pillsHTML = '';

        for (const category in filters) {
            filters[category].forEach(value => {
                pillsHTML += `
                    <span class="inline-flex items-center gap-x-1.5 rounded-full bg-[#7D32FF20] px-2 py-1 text-sm font-medium text-[#7D32FF]">
                        ${value}
                        <button type="button" class="remove-filter-btn group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-indigo-600/20" data-category="${category}" data-value="${value}">
                            <svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-indigo-600/50 group-hover:stroke-indigo-600/75">
                                <path d="M4 4l6 6m0-6l-6 6" />
                            </svg>
                        </button>
                    </span>
                `;
            });
        }
        activeFilters.innerHTML = pillsHTML;
    }

    // FILTER: Brands
    function populateBrandFilters(products) {
        const brandsContainer = document.getElementById('brands-list');
        if (!brandsContainer) return;

        const brandCounts = {};

        products.forEach(product => {
            const brand = product.brand_name;
            if (brand) {
                brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            }
        });

        let brandsHTML = '';
        Object.keys(brandCounts).sort().forEach(brand => {
            const count = brandCounts[brand];
            const brandId = `filter-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`;
            brandsHTML += `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="${brandId}" type="checkbox" data-category="brand_name" data-value="${brand}" class="h-4 w-4 rounded border-gray-300 accent-[#7D32FF] cursor-pointer">
                        <label for="${brandId}" class="ml-3 text-sm text-gray-600 cursor-pointer">${brand}</label>
                    </div>
                    <span class="text-xs text-gray-500">${count}</span>
                </div>
            `;
        });

        brandsContainer.innerHTML = brandsHTML;
    }

    function setupMobileSidebarToggle() {
            const openBtn = document.getElementById('open-filter-button');
            const closeBtn = document.getElementById('close-filter-button');
            const sidebar = document.getElementById('filter-sidebar');

            if (!openBtn || !closeBtn || !sidebar) return;

            openBtn.addEventListener('click', () => {
                sidebar.classList.remove('-translate-x-full');
                // This is the fix: reset scroll position to the top every time it's opened.
                sidebar.scrollTop = 0;
            });

            closeBtn.addEventListener('click', () => {
                sidebar.classList.add('-translate-x-full');
            });
        }

    function setupFilterSidebar() {
        if (!sidebar) return;

        sidebar.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                const category = event.target.dataset.category;
                const value = event.target.dataset.value;
                if (!category || !value) return;

                if (event.target.checked) {
                    filters[category].push(value);
                } else {
                    filters[category] = filters[category].filter(item => item !== value);
                }

                filterAndSortProducts();
            }
        });
    }

    function setupActivePillActions() {
        if (!activeFilters) return;

        activeFilters.addEventListener('click', (event) => {
            const removeBtn = event.target.closest('.remove-filter-btn');
            if (removeBtn) {
                const category = removeBtn.dataset.category;
                const value = removeBtn.dataset.value;

                // 1. Remove the filter from our state
                filters[category] = filters[category].filter(item => item !== value);

                // 2. Find and uncheck the corresponding checkbox in the sidebar
                const checkboxToUncheck = document.querySelector(`input[data-category="${category}"][data-value="${value}"]`);
                if (checkboxToUncheck) {
                    checkboxToUncheck.checked = false;
                }

                // 3. Re-run the master function to update everything
                filterAndSortProducts();
            }
        });
    }

    openFilter.addEventListener('click', openSidebar);
    closeFilter.addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);


    // HEART ICON
    function setupFavoriteButton() {
        const favButton = document.getElementById('pdp-favorite-btn');
        const heartUnfilled = document.getElementById('heart-icon-unfilled');
        const heartFilled = document.getElementById('heart-icon-filled');

        if (!favButton || !heartUnfilled || !heartFilled) return;

        let isFavorited = false; // Initial state

        favButton.addEventListener('click', () => {
            isFavorited = !isFavorited; // Toggle the state

            if (isFavorited) {
                heartUnfilled.classList.add('hidden');
                heartFilled.classList.remove('hidden');
                showToast('Product saved to favorites');
            } else {
                heartFilled.classList.add('hidden');
                heartUnfilled.classList.remove('hidden');
                showToast('Product removed from favorites');
            }
        });
    }

    // NEW: Helper function to show and hide the toast notification
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById('favorite-toast');
        if (!toast) return;

        // Clear any existing timeout to prevent glitches
        clearTimeout(toastTimeout);

        toast.textContent = message;
        toast.classList.remove('hidden', 'toast-exit-active');
        toast.classList.add('toast-enter-active');

        // Set a timeout to hide the toast after 3 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('toast-enter-active');
            toast.classList.add('toast-exit-active');
            // Optional: fully hide after animation
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }


document.addEventListener('DOMContentLoaded', () => {

    setupSortMenu();
    setupStepFilters();
    setupFilterSidebar();
    setupActivePillActions();
    setupProductCardActions();
    setupPDPActions();
    setupMobileSidebarToggle();
    setupFavoriteButton();
    backButton.addEventListener('click', showPLP);

    initializeFilters();

    
    const defaultButton = document.querySelector('button[data-step="cleanser"]');
    if (defaultButton) {
        defaultButton.classList.add('active');
    }

    displayProducts('cleanser');

    gsap.delayedCall(0.5, introAnimation);

    renderPDP(productData);

    
    
});