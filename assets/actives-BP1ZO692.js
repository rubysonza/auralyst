import"./styles-C3DhQ5Ln.js";import{g as b}from"./index-CH_iu5NA.js";document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("az-nav-container"),l=document.getElementById("actives-accordion-container"),s={menuButton:document.getElementById("menu-button"),menuClose:document.getElementById("menu-close"),menuScreen:document.getElementById("menu-screen"),menuBackdrop:document.getElementById("menu-backdrop")};let d=[],i="All";async function g(){try{const t=await fetch("./actives.json");if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);d=(await t.json()).sort((n,a)=>n.active_name.localeCompare(a.active_name)),f(),u(),h()}catch(t){console.error("Could not initialize glossary:",t),l.innerHTML='<p class="text-center text-red-500">Could not load actives.</p>'}}function f(){const t=["All",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];c.innerHTML=t.map(e=>`
            <button data-filter="${e}" class="nav-button shrink-0 px-4 py-2 text-lg font-semibold text-gray-500 hover:text-[#FF7451] cursor-pointer">${e}</button>
        `).join("")}function u(){v(i==="All"?d:d.filter(t=>t.active_name.toUpperCase().startsWith(i))),x()}function v(t){if(t.length===0){l.innerHTML='<p class="text-center text-gray-500 py-8">No actives found.</p>';return}let e="";l.innerHTML=t.map(n=>{const a=n.active_name[0].toUpperCase();let p="";return i==="All"&&a!==e&&(e=a,p=`
                    <div class="pt-8 mt-8 border-t border-gray-200">
                        <h2 class="text-2xl font-bold text-[#FF7451]">${e}</h2>
                    </div>
                `),`
                ${p}
                <div class="bg-white border border-gray-200 shadow-sm rounded-2xl">
                    <button class="accordion-toggle w-full flex justify-between items-center p-4 text-left hover:bg-gray-100 cursor-pointer">
                        <h3 class="text-xl font-semibold text-gray-900">${n.active_name}</h3>
                        <svg class="accordion-icon w-6 h-6 transition-transform duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="accordion-content bg-white rounded-b-2xl border-gray-200">
                        <div class="overflow-hidden">
                            <div class="p-6">
                                <div class="mb-6">
                                <div class="flex flex-col sm:flex-row justify-start sm:items-start mb-2 gap-2">
                                        <p class="text-gray-600"><span class="font-semibold">Also known as:</span> ${n.also_known_as.join(", ")}</p>
                                        <span class="bg-[#FF745110] text-[#FF7451] text-sm font-medium px-2.5 py-0.5 self-start">${n.category}</span>
                                    </div>
                                    <p class="text-gray-700">${n.description}</p>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><h4 class="font-semibold text-gray-900 mb-2">When to Use</h4><p class="text-gray-700">${n.when_to_use}</p></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Good For</h4><ul class="list-disc list-inside text-gray-700 space-y-1">${n.good_for_skin_concerns.map(r=>`<li>${r}</li>`).join("")}</ul></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Pairs Well With</h4><ul class="list-disc list-inside text-green-700 space-y-1">${n.pairs_well_with.map(r=>`<li>${r}</li>`).join("")}</ul></div>
                                    <div><h4 class="font-semibold text-gray-900 mb-2">Do Not Mix With</h4><ul class="list-disc list-inside text-red-700 space-y-1">${n.do_not_mix_with.map(r=>`<li>${r}</li>`).join("")}</ul></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join("")}function x(){c.querySelectorAll(".nav-button").forEach(t=>{t.classList.toggle("text-[#FF7451]",t.dataset.filter===i),t.classList.toggle("font-bold",t.dataset.filter===i),t.classList.toggle("text-gray-500",t.dataset.filter!==i)})}function h(){c.addEventListener("click",t=>{const e=t.target.closest(".nav-button");e&&(i=e.dataset.filter,u())}),l.addEventListener("click",t=>{const e=t.target.closest(".accordion-toggle");if(e){const n=e.nextElementSibling,a=e.querySelector(".accordion-icon");n.classList.toggle("is-open"),a.style.transform=n.classList.contains("is-open")?"rotate(180deg)":"rotate(0deg)"}})}let o=null;function y(){if(o){o.play();return}o=b.timeline({paused:!0}),o.to(s.menuBackdrop,{opacity:1,duration:.2,onStart:()=>s.menuBackdrop.classList.remove("hidden")},0).to(s.menuScreen,{x:0,duration:.2,ease:"power2.inOut",onStart:()=>s.menuScreen.classList.remove("translate-x-full")},0),o.play()}function m(){o&&(o.reverse(),o.eventCallback("onReverseComplete",()=>{s.menuBackdrop.classList.add("hidden"),s.menuScreen.classList.add("-translate-x-full")}))}s.menuButton.addEventListener("click",y),s.menuClose.addEventListener("click",m),s.menuBackdrop.addEventListener("click",t=>{t.target===s.menuBackdrop&&m()}),g()});
