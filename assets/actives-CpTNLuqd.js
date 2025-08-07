import"./styles-BBXe8umR.js";import{g as b}from"./index-CH_iu5NA.js";document.addEventListener("DOMContentLoaded",()=>{const g=document.getElementById("az-nav-container"),c=document.getElementById("actives-accordion-container"),n={menuButton:document.getElementById("menu-button"),menuClose:document.getElementById("menu-close"),menuScreen:document.getElementById("menu-screen"),menuBackdrop:document.getElementById("menu-backdrop")};let u=[],l="All";async function p(){try{const t=await fetch("./actives.json");if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);u=(await t.json()).sort((e,i)=>e.active_name.localeCompare(i.active_name)),h(),v(),y()}catch(t){console.error("Could not initialize glossary:",t),c.innerHTML='<p class="text-center text-red-500">Could not load actives.</p>'}}function h(){const t=["All",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];g.innerHTML=t.map(s=>`
            <button data-filter="${s}" class="nav-button shrink-0 px-4 py-2 text-lg font-semibold text-gray-500 hover:text-[#FF7451] cursor-pointer">${s}</button>
        `).join("")}function v(){x(l==="All"?u:u.filter(t=>t.active_name.toUpperCase().startsWith(l))),f()}function x(t){if(t.length===0){c.innerHTML='<p class="text-center text-gray-500 py-8">No actives found.</p>';return}let s="";c.innerHTML=t.map(e=>{const i=e.active_name[0].toUpperCase();let d="";return l==="All"&&i!==s&&(s=i,d=`
                    <div class="pt-8 mt-8 border-t border-gray-200">
                        <h2 class="text-2xl font-bold text-[#FF7451]">${s}</h2>
                    </div>
                `),`
                ${d}
                <div class="accordion-toggle bg-white border border-gray-200 shadow-sm rounded-2xl hover:bg-[#FF745120] transform ease-in-out duration-300">
                    
                    <button class="accordion-button w-full flex justify-between items-center p-4 text-left cursor-pointer">
                        <h3 class="active-name text-xl lg:text-2xl font-extrabold text-gray-700">${e.active_name}</h3>
                        <div class="flex items-center gap-x-3">
                            <span class="active-category bg-[#FF745110] text-[#FF7451] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">${e.category}</span>
                            <svg class="accordion-icon w-6 h-6 transition-transform duration-300 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </button>
                    
                    <div class="accordion-content bg-white rounded-b-2xl border-gray-200">
                        <div class="overflow-hidden">
                            <div class="p-6">
                                
                                <div class="mb-6">
                                    ${e.also_known_as&&e.also_known_as.length>0?`
                                    <p class="text-sm text-gray-500 mb-4">
                                        Also known as: ${e.also_known_as.join(", ")}
                                    </p>
                                    `:""}
                                    <p class="text-gray-700">${e.description}</p>
                                </div>

                                <div class="space-y-6">
                                    <div class="space-y-2 border-t pt-5 border-gray-200">
                                        <div class="flex items-center gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="#FF7451" d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137" />
                                            </svg>
                                            <h4 class="font-bold lg:text-lg text-gray-900">Good For</h4>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            ${e.good_for_skin_concerns.map(o=>`<span class="bg-[#FF745110] text-[#ec5631] text-sm font-bold px-3 py-1 rounded-full">${o}</span>`).join("")}
                                        </div>
                                    </div>
                                    <div class="space-y-2 border-t pt-5 border-gray-200">
                                        <div class="flex items-center gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                                                <path fill="#FF7451" stroke="#FF7451" d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-.993.883L11 7v5l.009.131a1 1 0 0 0 .197.477l.087.1l3 3l.094.082a1 1 0 0 0 1.226 0l.094-.083l.083-.094a1 1 0 0 0 0-1.226l-.083-.094L13 11.585V7l-.007-.117A1 1 0 0 0 12 6" stroke-width="0.5" stroke="currentColor" />
                                            </svg>
                                            <h4 class="font-semibold lg:text-lg text-gray-900">When to Use</h4>
                                        </div>
                                        <div class="flex items-center gap-x-4">
                                            ${e.when_to_use.map(o=>o.toUpperCase()==="AM"?`<div class="flex items-center">
                                                                <svg class="text-yellow-600" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                                                                    <path fill="yellow" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" />
                                                                </svg>
                                                                <span class="font-semibold text-gray-700">AM</span>
                                                            </div>`:o.toUpperCase()==="PM"?`<div class="flex items-center">
                                                                <svg class="text-blue-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                    <path fill="lightblue" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z" />
                                                                </svg>
                                                                <span class="font-semibold text-gray-700">PM</span>
                                                            </div>`:"").join("")}
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2 border-t pt-5 border-gray-200">
                                            <div class="flex items-center gap-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="green" stroke-width="2" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" />
                                                </svg>
                                                <h4 class="font-semibold lg:text-lg text-gray-900">Pairs Well With</h4>
                                            </div>
                                            <div class="flex flex-wrap gap-2">
                                                ${e.pairs_well_with.map(o=>`<span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-md">${o}</span>`).join("")}
                                            </div>
                                        </div>
                                        <div class="space-y-2 border-t pt-5 border-gray-200">
                                            <div class="flex items-center gap-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                    <path fill="red" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 5L5 19M5 5l14 14" />
                                                </svg>
                                                <h4 class="font-semibold lg:text-lg text-gray-900">Do Not Mix With</h4>
                                            </div>
                                            <div class="flex flex-wrap gap-2">
                                                ${e.do_not_mix_with.map(o=>`<span class="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-md">${o}</span>`).join("")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join("")}function f(){g.querySelectorAll(".nav-button").forEach(t=>{t.classList.toggle("text-[#FF7451]",t.dataset.filter===l),t.classList.toggle("font-bold",t.dataset.filter===l),t.classList.toggle("text-gray-500",t.dataset.filter!==l)})}function y(){g.addEventListener("click",t=>{const s=t.target.closest(".nav-button");s&&(l=s.dataset.filter,v())}),c.addEventListener("click",t=>{const s=t.target.closest(".accordion-button");if(!s)return;const e=s.closest(".accordion-toggle"),i=e.querySelector(".accordion-content"),d=e.querySelector(".accordion-icon"),o=!i.classList.contains("is-open");c.querySelectorAll(".accordion-toggle").forEach(r=>{r!==e&&(r.classList.remove("bg-[#FF7451]"),r.classList.add("bg-white","hover:bg-[#FF745120]"),r.querySelector("h3").classList.remove("text-white"),r.querySelector("h3").classList.add("text-gray-700"),r.querySelector("span").classList.remove("bg-white/10","text-white"),r.querySelector("span").classList.add("bg-[#FF745110]","text-[#FF7451]"),r.querySelector("svg").classList.remove("text-white"),r.querySelector("svg").classList.add("text-gray-400"),r.querySelector(".accordion-content").classList.remove("is-open"),r.querySelector(".accordion-icon").style.transform="rotate(0deg)")}),i.classList.toggle("is-open"),d.style.transform=o?"rotate(180deg)":"rotate(0deg)",o?(e.classList.add("bg-[#FF7451]"),e.classList.remove("bg-white","hover:bg-[#FF745120]"),e.querySelector("h3").classList.add("text-white"),e.querySelector("h3").classList.remove("text-gray-700"),e.querySelector("span").classList.add("bg-white/10","text-white"),e.querySelector("span").classList.remove("bg-[#FF745110]","text-[#FF7451]"),e.querySelector("svg").classList.add("text-white"),e.querySelector("svg").classList.remove("text-gray-400")):(e.classList.remove("bg-[#FF7451]"),e.classList.add("bg-white","hover:bg-[#FF745120]"),e.querySelector("h3").classList.remove("text-white"),e.querySelector("h3").classList.add("text-gray-700"),e.querySelector("span").classList.remove("bg-white/10","text-white"),e.querySelector("span").classList.add("bg-[#FF745110]","text-[#FF7451]"),e.querySelector("svg").classList.remove("text-white"),e.querySelector("svg").classList.add("text-gray-400"))})}let a=null;function w(){if(a){a.play();return}a=b.timeline({paused:!0}),a.to(n.menuBackdrop,{opacity:1,duration:.2,onStart:()=>n.menuBackdrop.classList.remove("hidden")},0).to(n.menuScreen,{x:0,duration:.2,ease:"power2.inOut",onStart:()=>n.menuScreen.classList.remove("translate-x-full")},0),a.play()}function m(){a&&(a.reverse(),a.eventCallback("onReverseComplete",()=>{n.menuBackdrop.classList.add("hidden"),n.menuScreen.classList.add("-translate-x-full")}))}n.menuButton.addEventListener("click",w),n.menuClose.addEventListener("click",m),n.menuBackdrop.addEventListener("click",t=>{t.target===n.menuBackdrop&&m()}),p()});
