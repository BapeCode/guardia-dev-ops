// Animated Grid
class AnimatedGrid {
    constructor(uid) {
        this.uid = uid
        this.CELL_H = 40
        this.CELL_W = 40
        this.duration = 4
        this.color = "rgba(201,169,110,0.4)"
        this.svg = document.querySelector('[data-grid-pattern="' + uid + '"]');
        this.group = this.svg.querySelector('.animated-squares-' + this.uid)
    }


    getDimension() {
        return {w: this.svg.clientWidth, h: this.svg.clientHeight}
    }

    randomPos(dims) {
        const cols = Math.floor(dims.w / this.CELL_W)
        const rows = Math.floor(dims.h / this.CELL_H)
        return [
            Math.floor(Math.random() * cols),
            Math.floor(Math.random() * rows)
        ]
    }

    animateSquare(rect, dims, delay) {
        const [col, row] = this.randomPos(dims)
        rect.setAttribute("x", col * this.CELL_W + 1)
        rect.setAttribute("y", row * this.CELL_H + 1)

        rect.animate([
            {opacity: 0},
            {opacity: this.MAX_OP},
            {opacity: 0}
        ], {
            duration: this.duration * 1000,
            delay: delay,
            easing: "ease-in-out",
            fill: "forwards"
        }).onfinish = () => {
            const newDims = this.getDimension()
            this.animateSquare(rect, newDims, Math.random() * 1000)
        }
    }

    setup() {
        const dims = this.getDimension()
        if (!dims.w || !dims.h) {
            requestAnimationFrame(() => this.setup())
            return
        }

        for (let i = 0; i < this.NUM_SQUARES; i++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", String(this.CELL_W - 1));
            rect.setAttribute("height", String(this.CELL_H - 1));
            rect.setAttribute("fill", this.color);
            rect.setAttribute("opacity", "0");
            this.group.appendChild(rect);
            this.animateSquare(rect, dims, i * 100);
        }

        const ro = new ResizeObserver(() => {
            const newDims = this.getDimension();
            this.group.querySelectorAll("rect").forEach(r => {
                const [col, row] = this.randomPos(newDims);
                r.setAttribute("x", String(col * this.CELL_W + 1));
                r.setAttribute("y", String(row * this.CELL_H + 1));
            });
        });
        ro.observe(this.svg);
    }
}

//ShinyText
class ShinyText {
    constructor(element, options = {}) {
        this.el = typeof element === "string"
            ? document.querySelector(element)
            : element

        // Options avec valeurs par défaut
        this.disabled = options.disabled ?? false
        this.speed = options.speed ?? 2
        this.color = options.color ?? "#b5b5b5"
        this.shineColor = options.shineColor ?? "#ffffff"
        this.spread = options.spread ?? 120
        this.yoyo = options.yoyo ?? false
        this.pauseOnHover = options.pauseOnHover ?? false
        this.direction = options.direction ?? "left"
        this.delay = options.delay ?? 0

        // État interne
        this.isPaused = false
        this.elapsed = 0
        this.lastTime = null
        this.dirMult = this.direction === "left" ? 1 : -1
        this.progress = 0
        this.rafId = null

        this._applyBaseStyle()
        this._bindEvents()
        this._tick = this._tick.bind(this)
        this.start()
    }

    _applyBaseStyle() {
        this.el.style.backgroundImage = `linear-gradient(
            ${this.spread}deg,
            ${this.color} 0%,
            ${this.color} 35%,
            ${this.shineColor} 50%,
            ${this.color} 65%,
            ${this.color} 100%
        )`
        this.el.style.backgroundSize = "200% auto"
        this.el.style.webkitBackgroundClip = "text"
        this.el.style.backgroundClip = "text"
        this.el.style.webkitTextFillColor = "transparent"
        this.el.style.display = "inline-block"
    }

    _updatePosition() {
        // p=0 → shine à droite (150%), p=100 → shine à gauche (-50%)
        const pos = 150 - this.progress * 2
        this.el.style.backgroundPosition = `${pos}% center`
    }

    _tick(time) {
        if (this.disabled || this.isPaused) {
            this.lastTime = null
            this.rafId = requestAnimationFrame(this._tick)
            return
        }

        if (this.lastTime === null) {
            this.lastTime = time
            this.rafId = requestAnimationFrame(this._tick)
            return
        }

        const delta = time - this.lastTime
        this.lastTime = time
        this.elapsed += delta

        const animDuration = this.speed * 1000
        const delayDuration = this.delay * 1000

        if (this.yoyo) {
            const cycleDuration = animDuration + delayDuration
            const fullCycle = cycleDuration * 2
            const cycleTime = this.elapsed % fullCycle

            if (cycleTime < animDuration) {
                // Aller : 0 → 100
                const p = (cycleTime / animDuration) * 100
                this.progress = this.dirMult === 1 ? p : 100 - p
            } else if (cycleTime < cycleDuration) {
                // Pause en fin
                this.progress = this.dirMult === 1 ? 100 : 0
            } else if (cycleTime < cycleDuration + animDuration) {
                // Retour : 100 → 0
                const reverseTime = cycleTime - cycleDuration
                const p = 100 - (reverseTime / animDuration) * 100
                this.progress = this.dirMult === 1 ? p : 100 - p
            } else {
                // Pause en début
                this.progress = this.dirMult === 1 ? 0 : 100
            }
        } else {
            const cycleDuration = animDuration + delayDuration
            const cycleTime = this.elapsed % cycleDuration

            if (cycleTime < animDuration) {
                // Animation : 0 → 100
                const p = (cycleTime / animDuration) * 100
                this.progress = this.dirMult === 1 ? p : 100 - p
            } else {
                // Pause — shine hors écran
                this.progress = this.dirMult === 1 ? 100 : 0
            }
        }

        this._updatePosition()
        this.rafId = requestAnimationFrame(this._tick)
    }

    _bindEvents() {
        if (!this.pauseOnHover) return
        this.el.addEventListener("mouseenter", () => {
            this.isPaused = true
        })
        this.el.addEventListener("mouseleave", () => {
            this.isPaused = false
        })
    }

    // API publique
    start() {
        if (this.rafId) return
        this.rafId = requestAnimationFrame(this._tick)
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
    }

    setDirection(dir) {
        this.direction = dir
        this.dirMult = dir === "left" ? 1 : -1
        this.elapsed = 0
        this.progress = 0
    }
}


// Loader
const uid = document.getElementById("grid-container").dataset.uid


document.addEventListener("DOMContentLoaded", () => {
    const grid = new AnimatedGrid(uid)
    grid.setup()

    new ShinyText("#glint-logo", {
        color: "#C9A96E",
        shineColor: "#fff8e8",
        speed: 3,
    })
})
