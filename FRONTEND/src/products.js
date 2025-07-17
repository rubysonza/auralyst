import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {
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
     


    // INTRO ANIMATION

    gsap.set([landingTitle, productContent], { opacity: 1 });
    // gsap.set(landingBottle, { y: '35vh', autoAlpha: 1 });

    // function introAnimation () {
    //     const tl = gsap.timeline();

    //     tl.to(landingBottle, { y: '-50vh', autoAlpha: 0, scale: 0.5, duration: 1.0, ease: 'power2.inOut' })
    //       .to([landingTitle, productContent], { opacity: 1, duration: 0.8, ease: 'power2.out'}, '>')
    // }

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
        if (!productGrid) {
            console.error('Container #product-grid not found!');
            return;
        }

        const filePath = `/products-list/${step}.json`;
        
        // CHECKPOINT 1: Log the file path to ensure it's correct.
        console.log('Attempting to fetch:', filePath);

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
            throw new Error(`Network response was not ok for: ${filePath}`);
            }
            
            // CHECKPOINT 2: Confirm the fetch was successful before parsing.
            console.log('Fetch successful. Parsing JSON...');
            
            const data = await response.json();
            const products = data.cleanser;

            // CHECKPOINT 3: THIS IS THE MOST IMPORTANT ONE.
            // Log the data to see its exact structure.
            console.log('Parsed data:', products);

            // CHECKPOINT 4: Confirm we are about to loop.
            console.log('Data parsing complete. Starting card creation...');

            let allCardsHTML = '';
            products.forEach(product => {
            allCardsHTML += createProductCard(product);
            });

            productGrid.innerHTML = allCardsHTML;
            
            // CHECKPOINT 5: Final success message.
            console.log('Successfully displayed products!');

        } catch (error) {
            // The error object itself will give us a clue.
            console.error('An error occurred in the try block:', error);
            productGrid.innerHTML = `<p class="text-center text-gray-500">Could not load products for ${step}.</p>`;
        }
    }


    // STEPS SCROLL/DRAG
    let isDragging = false;
    let startX;
    let scrollLeft;

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



    // SORT BY
    let isSortOpen = false;

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

    openFilter.addEventListener('click', openSidebar);
    closeFilter.addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);



    // Remember to call the function
    displayProducts('cleanser');


    gsap.delayedCall(0.5, introAnimation);

    
});

