import './style.css'
import gsap from "gsap";

document.addEventListener('DOMContentLoaded', () => {

    const navContainer = document.getElementById('az-nav-container');
    const accordionContainer = document.getElementById('actives-accordion-container');
    
    let allActives = []; 
    let currentFilter = 'All'; 

    async function initializeGlossary() {
        try {
            const response = await fetch('./actives.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            allActives = data.sort((a, b) => a.active_name.localeCompare(b.active_name));
            
            generateAZNav();
            filterAndRender(); 
            setupEventListeners();

        } catch (error) {
            console.error("Could not initialize glossary:", error);
            accordionContainer.innerHTML = `<p class="text-center text-red-500">Could not load actives.</p>`;
        }
    }

    function generateAZNav() {
        const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
        navContainer.innerHTML = alphabet.map(letter => `
            <button data-filter="${letter}" class="nav-button shrink-0 px-4 py-2 text-lg font-semibold text-gray-500 hover:text-[#FF7451] cursor-pointer">${letter}</button>
        `).join('');
    }
    
    function filterAndRender() {
        renderActives(currentFilter === 'All' ? allActives : allActives.filter(a => a.active_name.toUpperCase().startsWith(currentFilter)));
        updateActiveNavButton();
    }
    
    function renderActives(activesToRender) {
        if (activesToRender.length === 0) {
            accordionContainer.innerHTML = `<p class="text-center text-gray-500 py-8">No actives found.</p>`;
            return;
        }
        
        let currentLetter = '';
        accordionContainer.innerHTML = activesToRender.map(active => {
            const firstLetter = active.active_name[0].toUpperCase();
            let headingHTML = '';
            if (currentFilter === 'All' && firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                headingHTML = `
                    <div class="pt-8 mt-8 border-t border-gray-200">
                        <h2 class="text-2xl font-bold text-[#FF7451]">${currentLetter}</h2>
                    </div>
                `;
            }

            // --- Note the changes in the accordion-content div below ---
            return `
                ${headingHTML}
                <div class="bg-white border border-gray-200 shadow-sm rounded-2xl">
                    <button class="accordion-toggle w-full flex justify-between items-center p-4 text-left hover:bg-gray-100 cursor-pointer">
                        <h3 class="text-xl font-semibold text-gray-900">${active.active_name}</h3>
                        <svg class="accordion-icon w-6 h-6 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="accordion-content bg-white rounded-b-2xl border-gray-200">
                        <div class="overflow-hidden">
                            <div class="p-6">
                                <div class="mb-6">
                                <div class="flex flex-col sm:flex-row justify-start sm:items-start mb-2 gap-2">
                                        <p class="text-gray-600"><span class="font-semibold">Also known as:</span> ${active.also_known_as.join(', ')}</p>
                                        <span class="bg-[#FF745110] text-[#FF7451] text-sm font-medium px-2.5 py-0.5 self-start">${active.category}</span>
                                    </div>
                                    <p class="text-gray-700">${active.description}</p>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><h4 class="font-semibold text-gray-900 mb-2">When to Use</h4><p class="text-gray-700">${active.when_to_use}</p></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Good For</h4><ul class="list-disc list-inside text-gray-700 space-y-1">${active.good_for_skin_concerns.map(item => `<li>${item}</li>`).join('')}</ul></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Pairs Well With</h4><ul class="list-disc list-inside text-green-700 space-y-1">${active.pairs_well_with.map(item => `<li>${item}</li>`).join('')}</ul></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Do Not Mix With</h4><ul class="list-disc list-inside text-red-700 space-y-1">${active.do_not_mix_with.map(item => `<li>${item}</li>`).join('')}</ul></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function updateActiveNavButton() {
        navContainer.querySelectorAll('.nav-button').forEach(button => {
            button.classList.toggle('text-[#FF7451]', button.dataset.filter === currentFilter);
            button.classList.toggle('font-bold', button.dataset.filter === currentFilter);
            button.classList.toggle('text-gray-500', button.dataset.filter !== currentFilter);
        });
    }

    function setupEventListeners() {
        navContainer.addEventListener('click', e => {
            const button = e.target.closest('.nav-button');
            if (button) {
                currentFilter = button.dataset.filter;
                filterAndRender();
            }
        });

        accordionContainer.addEventListener('click', e => {
            const toggleButton = e.target.closest('.accordion-toggle');
            if (toggleButton) {
                const content = toggleButton.nextElementSibling;
                const icon = toggleButton.querySelector('.accordion-icon');
                
                // --- Note the updated logic here ---
                content.classList.toggle('is-open');
                icon.style.transform = content.classList.contains('is-open') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }
    
    initializeGlossary();
});