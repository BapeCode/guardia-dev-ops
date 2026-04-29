function toggleDropdown() {
    const menu = document.getElementById("my-account-dropdown")
    menu.classList.toggle("hidden")
}

document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("my-account-wrapper")
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById("my-account-dropdown").classList.add("hidden")
    }
})


//ANIMATIONS POUR LES BOUTONS
document.addEventListener('click', e => {
    const like = e.target.closest('.like-btn');
    const repost = e.target.closest('.repost-btn');
    const btn = like || repost;
    if (!btn) return;

    const icon = btn.querySelector('svg');
    if (!icon) return;

    if (like) {
        const path = icon.querySelector('path');
        const on = icon.classList.toggle('text-red-500');
        icon.classList.toggle('text-text-1', !on);
        if (path) path.setAttribute('fill', on ? 'currentColor' : 'none');
    } else {
        const on = icon.classList.toggle('text-green-500');
        icon.classList.toggle('text-text-1', !on);
    }

    const steps = like
        ? [[0,'scale(0.8)'],[100,'scale(1.35)'],[200,'scale(0.95)'],[280,'scale(1)']]
        : [[0,'rotate(0deg) scale(0.9)'],[80,'rotate(-180deg) scale(1.1)'],[220,'rotate(-350deg) scale(1)'],[320,'rotate(-360deg) scale(1)']];

    icon.style.cssText = 'transition:none';
    void icon.offsetWidth;
    steps.forEach(([d,t]) => setTimeout(() => {
        icon.style.cssText = 'transition:transform .13s cubic-bezier(.34,1.56,.64,1)';
        icon.style.transform = t;
    }, d));

    const {left,top,width,height} = icon.getBoundingClientRect();
    const [cx,cy] = [left+width/2, top+height/2];
    const color = like ? '#f43f5e' : '#22c55e';
    Array.from({length: like ? 6 : 5}, (_,i) => {
        const p = document.createElement('div');
        const a = (i/(like?6:5))*Math.PI*2, d = 16+Math.random()*10, s = 3+Math.random()*3;
        p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${s}px;height:${s}px;border-radius:50%;background:${color};pointer-events:none;z-index:9999;transform:translate(-50%,-50%)`;
        document.body.appendChild(p);
        void p.offsetWidth;
        p.style.cssText += `;transition:all .45s cubic-bezier(.16,1,.3,1);transform:translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px));opacity:0;width:2px;height:2px`;
        setTimeout(() => p.remove(), 500);
    });
});