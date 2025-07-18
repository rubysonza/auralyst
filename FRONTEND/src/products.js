import './style.css'
import gsap from "gsap";


    // GSAP animations or any other scripts
    gsap.registerPlugin();
    
    // PAGE ELEMENTS
    const stepScroll = document.getElementById('step-scroll')
    const menuButton = document.getElementById('menu-button')
    const productContent = document.getElementById('product-content')

    const landingBottle = document.querySelector('#landing-bottle')
    const landingTitle = document.getElementById('landing-title')

    // SORT MENU
    const sortContainer = document.getElementById('sort-menu-container');
    const sortButton = document.getElementById('sort-menu-button');
    const sortPanel = document.getElementById('sort-menu-panel');
    const sortIcon = document.getElementById('sort-menu-icon');
    const sortSelectedOption = document.getElementById('selected-sort-option');
    const sortOptions = sortPanel.querySelectorAll('a');
    const filterButton = document.getElementById('filter-button');

    // FILTER SIDEBAR
    const openFilter = document.getElementById('open-filter-button');
    const closeFilter = document.getElementById('close-filter-button');
    const sidebar = document.getElementById('filter-sidebar');
    const backdrop = document.getElementById('filter-backdrop');
     

    let isDragging = false;
    let startX;
    let scrollLeft;
    let isSortOpen = false;
    let currentProducts = [];
    let allProducts = [];
    let activeFilters = {
        skin_types: [],
        skin_concerns: [],
        brand_name: []
    }


    // INTRO ANIMATION

    gsap.set([landingTitle, productContent], { opacity: 1 });
    // gsap.set(landingBottle, { y: '35vh', autoAlpha: 1 });

    // function introAnimation () {
    //     const tl = gsap.timeline();

    //     tl.to(landingBottle, { y: '-50vh', autoAlpha: 0, scale: 0.5, duration: 1.0, ease: 'power2.inOut' })
    //       .to([landingTitle, productContent], { opacity: 1, duration: 0.8, ease: 'power2.out'}, '>')
    // }


    // PRODUCT GRID
    function createProductCard(product) {
        return `
        <div class="group relative flex flex-col w-auto h-auto overflow-hidden rounded-3xl border border-gray-300 bg-white">
            <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none h-40">
                <img src="${product.image_url}" alt="${product.brand_name} ${product.product_name}" class="h-full w-full object-cover object-center">
            </div>
            <div class="flex flex-1 flex-col space-y-1 p-2 sm:p-4">
                <p class="text-xs sm:text-sm font-bold text-gray-900">${product.brand_name}</p>
                <h3 class="text-sm sm:text-base font-medium text-gray-900">${product.product_name}</h3>
                <p class="text-xs sm:text-sm font-medium text-gray-500">${product.product_type}</p>
                <div class="flex flex-1 flex-col justify-end">
                    <p class="text-sm sm:text-lg font-semibold text-gray-900">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
        `;
    }

    async function displayProducts(step) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        
        // Reset filters and grid when changing steps
        activeFilters = { skin_types: [], skin_concerns: [], brand_name: [] };
        // You might also want to uncheck all checkboxes here if desired.

        const filePath = `/products-list/${step}.json`;
        productGrid.innerHTML = `<p class="text-center text-gray-500">Loading products...</p>`;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`File not found for ${step}`);
            
            const data = await response.json();
            allProducts = data[step] || []; // Store the new products

            // Crucial: After fetching, immediately apply filters (which are currently none) and render.
            applyFiltersAndRender();

        } catch (error) {
            console.error('Display Products Error:', error);
            productGrid.innerHTML = `<p class="text-center text-gray-500">Could not display products.</p>`;
        }
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
        stepScroll.classList.remove('active:cursor-grabbing');
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        stepScroll.classList.remove('active:cursor-grabbing');
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



    // SORT BY
    function toggleSortDropdown() {
        isSortOpen = !isSortOpen;
        sortPanel.classList.toggle('hidden');
        sortButton.setAttribute('aria-expanded', isSortOpen);
        sortIcon.classList.toggle('rotate-180');
    }

    function closeSortDropdown() {
        isSortOpen = false;
        sortPanel.classList.add('hidden');
        sortButton.setAttribute('aria-expanded', 'false');
        sortIcon.classList.remove('rotate-180');
    }

    function handleSortSelection(event) {
        event.preventDefault();
        const selectedText = event.target.textContent;
        const selectedValue = event.target.getAttribute('data-sort');

        sortSelectedOption.textContent = `Sort by: ${selectedText}`;

        closeSortDropdown();

        console.log(`Sorting by: ${selectedValue}`);
    }

    sortButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleSortDropdown();
    });

    sortOptions.forEach(option => {
        option.addEventListener('click', handleSortSelection);
    });

    window.addEventListener('click', (event) => {
        if(isSortOpen && !sortContainer.contains(event.target)) {
            closeSortDropdown();
        }
    });

    window.addEventListener('keydown', (event) => {
        if(isSortOpen && event.key === 'Escape') {
            closeSortDropdown
        }
    })


    // SORT OPTIONS
    function renderProductGrid(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        if (products.length === 0) {
            productGrid.innerHTML = '<p class="text-center text-gray-500">Could not display products.</p>';
            return;
        }

        const allCardsHTML = products.map(product => createProductCard(product)).join('');
        productGrid.innerHTML = allCardsHTML;
    }


    function sortAndRender(sortBy) {
        let sortedProducts = [...currentProducts];

        switch (sortBy) {
            case 'best-match':
                default:
                break;
            case 'price-low-high':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
        }

        renderProductGrid(sortedProducts);
    }


    function setupSortMenu() {
        if (!sortButton || !sortPanel || !sortSelectedOption) return;

        sortPanel.addEventListener('click', (event) => {
            if (event.target.matches('a[data-sort]')) {
                event.preventDefault();

                const sortBy = event.target.dataset.sort;
                const selectionText = event.target.textContent;

                sortSelectedOption.textContent = `Sort by: ${selectionText}`;

                sortAndRender(sortBy);

                sortPanel.classList.add('hidden');
            }
        });
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
        const steps = ['cleanser', 'exfoliator'];

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

    function applyFiltersAndRender() {
        let filteredProducts = [...allProducts];

        // Filter by Skin Types
        if (activeFilters.skin_types.length > 0) {
            filteredProducts = filteredProducts.filter(p => 
                activeFilters.skin_types.some(type => p.skin_types.includes(type))
            );
        }
        // Filter by Skin Concerns
        if (activeFilters.skin_concerns.length > 0) {
            filteredProducts = filteredProducts.filter(p => 
                activeFilters.skin_concerns.some(concern => p.skin_concerns.includes(concern))
            );
        }
        // Filter by Brand Name
        if (activeFilters.brand_name.length > 0) {
            filteredProducts = filteredProducts.filter(p => 
                activeFilters.brand_name.includes(p.brand_name)
            );
        }
        
        // After all filtering, call the function that actually builds the HTML.
        renderProductGrid(filteredProducts);
    }


    function setupFilterSidebar() {
        const sidebar = document.getElementById('filter-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const category = event.target.dataset.category;
                const value = event.target.dataset.value;
                
                if (!category || !value) return;

                // Update the activeFilters object based on whether the box is checked
                if (event.target.checked) {
                    activeFilters[category].push(value);
                } else {
                    activeFilters[category] = activeFilters[category].filter(item => item !== value);
                }

                // After any change, re-run the filter and render process.
                applyFiltersAndRender();
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
    initializeFilters();

    displayProducts('cleanser');
    const defaultButton = document.querySelector('button[data-step="cleanser"]');
    if (defaultButton) {
        defaultButton.classList.add('active');
    }

    gsap.delayedCall(0.5, introAnimation);

    
});

