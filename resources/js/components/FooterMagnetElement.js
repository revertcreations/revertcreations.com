import { gsap } from 'gsap'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export class FooterMagnetElement extends HTMLElement {
    #label = null
    #link = null
    #active = false
    #usingPointerEvents = false
    #placeholder = null
    #letterLayer = null
    #letters = []
    #placeholderLetters = []
    #letterQuickTo = []
    #letterAnchors = []
    #letterSizes = []
    #letterSpacing = []
    #placeholderRect = null
    #containerRect = null
    #lastPointer = null
    #wordBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    #wordOffset = { x: 0, y: 0 }
    #hasInitialPlacement = false
    #pressTimeline = null
    #releaseTimeline = null
    #config = {
        falloff: 0.35,
        maxYOffset: 28,
        tension: 0.8,
        spacingTolerance: 10
    }

    connectedCallback () {
        this.#hydrateStructure()

        if (!this.#link || !this.#label) {
            return
        }

        this.#usingPointerEvents =
            typeof window !== 'undefined' && window.PointerEvent !== undefined

        if (getComputedStyle(this).display === 'inline') {
            this.style.display = 'block'
        }

        this.style.touchAction = this.style.touchAction || 'none'

        // Pointer events should pass through the label so the link remains clickable
        this.#label.style.pointerEvents = 'none'

        this.#applyLayoutStyles()

        this.#wordOffset = { x: 0, y: 0 }
        this.#hasInitialPlacement = false
        this.#updateMetrics()
        this.#adjustLayoutDimensions()
        this.#initializeTweens()
        this.#resetLettersToAnchors({ immediate: true })
        this.#lastPointer = null

        if (this.#usingPointerEvents) {
            this.addEventListener('pointerenter', this.#handlePointerEnter)
            this.addEventListener('pointerdown', this.#handlePointerDown)
            this.addEventListener('pointermove', this.#handlePointerMove)
            this.addEventListener('pointerleave', this.#handlePointerLeave)
            this.addEventListener('pointercancel', this.#handlePointerUp)
            this.addEventListener('pointerup', this.#handlePointerUp)
        } else {
            this.addEventListener('mouseenter', this.#handleMouseEnter)
            this.addEventListener('mousemove', this.#handleMouseMove)
            this.addEventListener('mouseleave', this.#handleMouseLeave)
            this.addEventListener('touchstart', this.#handleTouchStart, {
                passive: false
            })
            this.addEventListener('touchmove', this.#handleTouchMove, {
                passive: false
            })
            this.addEventListener('touchend', this.#handleTouchEnd)
            this.addEventListener('touchcancel', this.#handleTouchEnd)
        }

        window.addEventListener('resize', this.#handleResize)
    }

    disconnectedCallback () {
        if (this.#usingPointerEvents) {
            this.removeEventListener('pointerenter', this.#handlePointerEnter)
            this.removeEventListener('pointerdown', this.#handlePointerDown)
            this.removeEventListener('pointermove', this.#handlePointerMove)
            this.removeEventListener('pointerleave', this.#handlePointerLeave)
            this.removeEventListener('pointercancel', this.#handlePointerUp)
            this.removeEventListener('pointerup', this.#handlePointerUp)
        } else {
            this.removeEventListener('mouseenter', this.#handleMouseEnter)
            this.removeEventListener('mousemove', this.#handleMouseMove)
            this.removeEventListener('mouseleave', this.#handleMouseLeave)
            this.removeEventListener('touchstart', this.#handleTouchStart)
            this.removeEventListener('touchmove', this.#handleTouchMove)
            this.removeEventListener('touchend', this.#handleTouchEnd)
            this.removeEventListener('touchcancel', this.#handleTouchEnd)
        }

        window.removeEventListener('resize', this.#handleResize)

        this.#cancelPressEffect(true)
    }

    #hydrateStructure () {
        this.#link = this.querySelector('a')

        if (!this.#link) {
            const href = this.dataset.href
            if (!href) {
                return
            }

            this.#link = document.createElement('a')
            this.#link.href = href
            this.#link.classList.add('block', 'h-full', 'w-full', 'relative')
            this.appendChild(this.#link)
        }

        this.#label =
            this.querySelector('[data-footer-label]') ||
            this.querySelector('span, h2')

        if (!this.#label) {
            this.#label = document.createElement('span')
            this.#label.dataset.footerLabel = ''
            this.#label.textContent = this.dataset.label || ''
            this.#link.appendChild(this.#label)
        } else if (!this.#label.dataset.footerLabel) {
            this.#label.dataset.footerLabel = ''
        }

        this.#prepareLabelLayers()
    }

    #prepareLabelLayers () {
        if (!this.#label) return

        const originalText = this.#label.textContent ?? ''
        this.#label.innerHTML = ''
        this.#label.classList.add('relative', 'inline-block')
        this.#label.style.position = 'relative'
        this.#label.style.display = 'inline-block'
        this.#label.style.width = '100%'
        this.#label.style.height = '100%'
        this.#label.setAttribute('aria-label', originalText.trim())

        this.#placeholder = document.createElement('span')
        this.#placeholder.dataset.footerPlaceholder = ''
        this.#placeholder.setAttribute('aria-hidden', 'true')
        this.#placeholder.style.visibility = 'hidden'
        this.#placeholder.style.pointerEvents = 'none'
        this.#placeholder.style.display = 'inline-block'
        this.#placeholder.style.whiteSpace = 'pre'
        this.#label.appendChild(this.#placeholder)

        this.#letterLayer = document.createElement('span')
        this.#letterLayer.dataset.footerLayer = ''
        this.#letterLayer.style.position = 'absolute'
        this.#letterLayer.style.left = '0'
        this.#letterLayer.style.top = '0'
        this.#letterLayer.style.display = 'block'
        this.#letterLayer.style.whiteSpace = 'pre'
        this.#letterLayer.style.pointerEvents = 'none'
        this.#letterLayer.style.color = 'inherit'
        this.#label.appendChild(this.#letterLayer)

        this.#letters = []
        this.#placeholderLetters = []

        const characters = [...originalText]

        characters.forEach(char => {
            const safeChar = char === ' ' ? '\u00A0' : char

            const placeholderLetter = document.createElement('span')
            placeholderLetter.dataset.footerPlaceholderLetter = ''
            placeholderLetter.textContent = safeChar
            placeholderLetter.style.display = 'inline-block'
            placeholderLetter.style.whiteSpace = 'pre'
            this.#placeholder.appendChild(placeholderLetter)
            this.#placeholderLetters.push(placeholderLetter)

            const interactiveLetter = document.createElement('span')
            interactiveLetter.dataset.footerLetter = ''
            interactiveLetter.textContent = safeChar
            interactiveLetter.style.position = 'absolute'
            interactiveLetter.style.display = 'inline-block'
            interactiveLetter.style.whiteSpace = 'pre'
            interactiveLetter.style.pointerEvents = 'none'
            interactiveLetter.style.willChange = 'transform'
            interactiveLetter.style.transformOrigin = '50% 50%'
            this.#letterLayer.appendChild(interactiveLetter)
            this.#letters.push(interactiveLetter)
        })

        if (!this.#letters.length) {
            const fallback = document.createElement('span')
            fallback.dataset.footerLetter = ''
            fallback.textContent = originalText || ''
            fallback.style.position = 'absolute'
            fallback.style.left = '0'
            fallback.style.top = '0'
            fallback.style.display = 'inline-block'
            fallback.style.whiteSpace = 'pre'
            fallback.style.pointerEvents = 'none'
            this.#letterLayer.appendChild(fallback)
            this.#letters.push(fallback)
        }
    }

    #initializeTweens () {
        if (!this.#letters.length) return

        if (!this.#letterAnchors.length) {
            this.#updateMetrics()
        }

        this.#letterQuickTo = this.#letters.map(letter => ({
            x: gsap.quickTo(letter, 'x', {
                duration: 0.32,
                ease: 'power3.out'
            }),
            y: gsap.quickTo(letter, 'y', {
                duration: 0.32,
                ease: 'power3.out'
            })
        }))

        this.#letters.forEach((letter, index) => {
            const anchor = this.#letterAnchors[index] || { x: 0, y: 0 }
            gsap.set(letter, { x: anchor.x, y: anchor.y })
        })
    }

    #handlePointerEnter = event => {
        this.#activate(event)
    }

    #handlePointerDown = event => {
        this.#activate(event)
        this.#startPressEffect()
    }

    #handlePointerMove = event => {
        if (!this.#active) return

        this.#moveLabel(event)
    }

    #handlePointerLeave = () => {
        this.#deactivate()
        this.#cancelPressEffect()
    }

    #handlePointerUp = event => {
        this.#endPressEffect(true)
        if (event?.pointerType === 'touch' || event?.pointerType === 'pen') {
            this.#deactivate()
        }
    }

    #handleMouseEnter = event => {
        this.#activate(event)
    }

    #handleMouseMove = event => {
        if (!this.#active) return
        this.#moveLabel(event)
    }

    #handleMouseLeave = () => {
        this.#deactivate()
        this.#cancelPressEffect()
    }

    #handleTouchStart = event => {
        if (!event.touches || event.touches.length === 0) return
        const touch = event.touches[0]
        this.#activate(touch)
        this.#startPressEffect()
    }

    #handleTouchMove = event => {
        if (!this.#active || !event.touches || event.touches.length === 0) return
        event.preventDefault()
        const touch = event.touches[0]
        this.#moveLabel(touch)
    }

    #handleTouchEnd = () => {
        this.#deactivate()
        this.#endPressEffect(true)
    }

    #handleResize = () => {
        this.#updateMetrics()
        this.#adjustLayoutDimensions()
        this.#reapplyLastTarget()
    }

    #applyLayoutStyles () {
        if (!this.#link || !this.#label) return

        this.style.display = this.style.display || 'block'
        this.style.position = this.style.position || 'relative'
        this.style.overflow = this.style.overflow || 'hidden'

        this.#link.style.position = 'relative'
        this.#link.style.display = 'flex'
        this.#link.style.alignItems = 'center'
        this.#link.style.justifyContent = 'center'
        this.#link.style.width = '100%'
        this.#link.style.height = '100%'
        this.#link.style.overflow = 'hidden'

        this.#label.style.position = 'absolute'
        this.#label.style.left = '0'
        this.#label.style.top = '0'
        this.#label.style.display = 'inline-block'
    }

    #activate (source) {
        this.#active = true
        this.#updateMetrics()
        if (source) {
            this.#moveLabel(source)
        }
    }

    #deactivate () {
        this.#active = false
    }

    #resetLettersToAnchors (options = {}) {
        if (!this.#letters.length) return

        this.#letters.forEach((letter, index) => {
            const anchor = this.#letterAnchors[index] || { x: 0, y: 0 }
            const targetX = anchor.x + this.#wordOffset.x
            const targetY = anchor.y + this.#wordOffset.y

            if (options.immediate || !this.#letterQuickTo[index]) {
                gsap.set(letter, { x: targetX, y: targetY })
            } else {
                this.#letterQuickTo[index].x(targetX)
                this.#letterQuickTo[index].y(targetY)
            }
        })
    }

    #updateMetrics () {
        if (!this.#placeholder || !this.#link) return

        this.#containerRect = this.#link.getBoundingClientRect()
        this.#placeholderRect = this.#placeholder.getBoundingClientRect()
        if (this.#letterLayer && this.#containerRect) {
            this.#letterLayer.style.width = `${this.#containerRect.width}px`
            this.#letterLayer.style.height = `${this.#containerRect.height}px`
        }
        this.#letterAnchors = []
        this.#letterSizes = []
        this.#letterSpacing = []
        const offsetX =
            this.#placeholderRect.left - this.#containerRect.left
        const offsetY =
            this.#placeholderRect.top - this.#containerRect.top

        if (this.#placeholderLetters.length) {
            this.#placeholderLetters.forEach((placeholderLetter, index) => {
                const rect = placeholderLetter.getBoundingClientRect()
                this.#letterAnchors[index] = {
                    x: offsetX + (rect.left - this.#placeholderRect.left),
                    y: offsetY + (rect.top - this.#placeholderRect.top)
                }
                this.#letterSizes[index] = {
                    width: rect.width,
                    height: rect.height
                }
                const prevAnchor = this.#letterAnchors[index - 1]
                this.#letterSpacing[index] =
                    index === 0 || !prevAnchor
                        ? 0
                        : this.#letterAnchors[index].x - prevAnchor.x
            })
        } else {
            const rect = this.#placeholderRect
            this.#letterAnchors[0] = { x: offsetX, y: offsetY }
            this.#letterSizes[0] = { width: rect.width, height: rect.height }
            this.#letterSpacing[0] = 0
        }

        this.#letterSpacing = this.#letterSpacing.map((spacing, index) => {
            if (spacing !== undefined) {
                return spacing
            }

            const currentAnchor = this.#letterAnchors[index]
            const previousAnchor = this.#letterAnchors[index - 1]
            if (!currentAnchor || !previousAnchor) {
                return 0
            }

            return currentAnchor.x - previousAnchor.x
        })

        if (!this.#letterAnchors.length) {
            this.#wordBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
            this.#wordOffset = { x: 0, y: 0 }
            return
        }

        const minX = Math.min(...this.#letterAnchors.map(anchor => anchor.x))
        const maxX = Math.max(
            ...this.#letterAnchors.map((anchor, index) =>
                anchor.x + (this.#letterSizes[index]?.width || 0)
            )
        )
        const minY = Math.min(...this.#letterAnchors.map(anchor => anchor.y))
        const maxY = Math.max(
            ...this.#letterAnchors.map((anchor, index) =>
                anchor.y + (this.#letterSizes[index]?.height || 0)
            )
        )

        this.#wordBounds = { minX, maxX, minY, maxY }

        const boundsWidth = this.#containerRect?.width || 0
        const boundsHeight = this.#containerRect?.height || 0
        const minTranslateX = -minX
        const maxTranslateX = boundsWidth - maxX
        const minTranslateY = -minY
        const maxTranslateY = boundsHeight - maxY

        if (!this.#hasInitialPlacement) {
            const wordWidth = Math.max(0, maxX - minX)
            const wordHeight = Math.max(0, maxY - minY)
            const desiredLeft = Math.max(0, (boundsWidth - wordWidth) / 2)
            const desiredTop = Math.max(0, (boundsHeight - wordHeight) / 2)

            this.#wordOffset.x = clamp(desiredLeft - minX, minTranslateX, maxTranslateX)
            this.#wordOffset.y = clamp(desiredTop - minY, minTranslateY, maxTranslateY)
            this.#hasInitialPlacement = true
        } else {
            this.#wordOffset.x = clamp(this.#wordOffset.x, minTranslateX, maxTranslateX)
            this.#wordOffset.y = clamp(this.#wordOffset.y, minTranslateY, maxTranslateY)
        }
    }

    #adjustLayoutDimensions () {
        if (!this.#placeholder || !this.#link) return

        const linkStyles = getComputedStyle(this.#link)
        const paddingX =
            parseFloat(linkStyles.paddingLeft) +
            parseFloat(linkStyles.paddingRight)
        const paddingY =
            parseFloat(linkStyles.paddingTop) +
            parseFloat(linkStyles.paddingBottom)

        const { width, height } = this.#placeholder.getBoundingClientRect()
        const totalWidth = width + paddingX
        const totalHeight = height + paddingY

        this.style.minHeight = `${totalHeight}px`
        this.#link.style.minHeight = `${totalHeight}px`
        this.#link.style.minWidth = `${totalWidth}px`

        if (this.#label) {
            this.#label.style.minHeight = `${height}px`
            this.#label.style.minWidth = `${width}px`
        }
    }

    #startPressEffect () {
        if (!this.#letters.length) return

        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill()
            this.#releaseTimeline = null
        }
        if (this.#pressTimeline) {
            this.#pressTimeline.kill()
        }

        const tl = gsap.timeline()

        tl.to(this.#letters, {
            scale: 0.70,
            duration: 0.12,
            ease: 'power2.out'
        })

        tl.to(this.#letters, {
            scale: 0.92,
            duration: 0.08,
            ease: 'power1.out'
        })

        this.#pressTimeline = tl

        gsap.to(this.#link, {
            backgroundColor: 'rgba(0,0,0,0.05)',
            duration: 0.12,
            ease: 'power2.out'
        })
    }

    #endPressEffect (withRelease = true) {
        if (!withRelease) {
            this.#cancelPressEffect()
            return
        }

        if (this.#pressTimeline) {
            this.#pressTimeline.kill()
            this.#pressTimeline = null
        }
        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill()
        }

        const tl = gsap.timeline({
            onComplete: () => {
                this.#releaseTimeline = null
            }
        })

        tl.to(this.#letters, {
            scale: 1.20,
            duration: 0.1,
            ease: 'back.out(2)'
        })

        tl.to(this.#letters, {
            scale: 1,
            duration: 0.2,
            ease: 'power3.out'
        })

        this.#releaseTimeline = tl

        gsap.to(this.#link, {
            backgroundColor: 'rgba(0,0,0,0)',
            duration: 0.24,
            ease: 'power2.out'
        })
    }

    #cancelPressEffect (silent = false) {
        if (this.#pressTimeline) {
            this.#pressTimeline.kill()
            this.#pressTimeline = null
        }

        if (this.#releaseTimeline) {
            this.#releaseTimeline.kill()
            this.#releaseTimeline = null
        }

        gsap.to(this.#letters, {
            scale: 1,
            duration: silent ? 0 : 0.12,
            ease: 'power2.out'
        })

        gsap.to(this.#link, {
            backgroundColor: 'rgba(0,0,0,0)',
            duration: silent ? 0 : 0.12,
            ease: 'power2.out'
        })
    }

    #positionLettersForPointer (pointer, options = {}) {
        if (!this.#letters.length || !this.#containerRect) {
            return
        }

        const boundsWidth =
            this.#containerRect.width || this.#link.offsetWidth || 0
        const boundsHeight =
            this.#containerRect.height || this.#link.offsetHeight || 0

        const pointerX = clamp(pointer?.x ?? boundsWidth / 2, 0, boundsWidth)
        const pointerY = clamp(pointer?.y ?? boundsHeight / 2, 0, boundsHeight)

        let closestIndex = 0
        let minDistance = Number.POSITIVE_INFINITY

        this.#letterAnchors.forEach((anchor, index) => {
            const size = this.#letterSizes[index] || { width: 0, height: 0 }
            const centerX = anchor.x + size.width / 2
            const centerY = anchor.y + size.height / 2
            const dx = pointerX - centerX
            const dy = pointerY - centerY
            const distance = dx * dx + dy * dy

            if (distance < minDistance) {
                minDistance = distance
                closestIndex = index
            }
        })

        const slack = this.#config.maxYOffset
        const spacingTolerance = this.#config.spacingTolerance
        const falloff = this.#config.falloff
        const tension = this.#config.tension

        const leadAnchor = this.#letterAnchors[closestIndex] || { x: 0, y: 0 }
        const leadSize = this.#letterSizes[closestIndex] || { width: 0, height: 0 }

        const minTranslateX = -this.#wordBounds.minX
        const maxTranslateX = boundsWidth - this.#wordBounds.maxX
        const minTranslateY = -this.#wordBounds.minY
        const maxTranslateY = boundsHeight - this.#wordBounds.maxY

        let translateX = this.#wordOffset.x
        const leftEdge = this.#wordBounds.minX + translateX
        const rightEdge = this.#wordBounds.maxX + translateX

        if (pointerX < leftEdge) {
            translateX = clamp(pointerX - this.#wordBounds.minX, minTranslateX, maxTranslateX)
        } else if (pointerX > rightEdge) {
            translateX = clamp(pointerX - this.#wordBounds.maxX, minTranslateX, maxTranslateX)
        }

        let translateY = this.#wordOffset.y
        const topEdge = this.#wordBounds.minY + translateY
        const bottomEdge = this.#wordBounds.maxY + translateY

        if (pointerY < topEdge) {
            translateY = clamp(pointerY - this.#wordBounds.minY, minTranslateY, maxTranslateY)
        } else if (pointerY > bottomEdge) {
            translateY = clamp(pointerY - this.#wordBounds.maxY, minTranslateY, maxTranslateY)
        }

        this.#wordOffset = { x: translateX, y: translateY }

        const proposals = this.#letters.map((letter, index) => {
            const anchor = this.#letterAnchors[index] || { x: 0, y: 0 }
            const size = this.#letterSizes[index] || { width: 0, height: 0 }

            const baseX = clamp(
                anchor.x + translateX,
                0,
                Math.max(0, boundsWidth - size.width)
            )
            const baseY = clamp(
                anchor.y + translateY,
                0,
                Math.max(0, boundsHeight - size.height)
            )

            const centerX = baseX + size.width / 2
            const centerY = baseY + size.height / 2
            const dx = pointerX - centerX
            const dy = pointerY - centerY
            const indexDistance = Math.abs(index - closestIndex)
            const influence = Math.exp(-(indexDistance ** 2) * falloff)
            const weight = 1 + indexDistance * tension

            const offsetX = (dx * influence) / weight
            let offsetY = (dy * influence) / weight

            if (indexDistance > 0) {
                const sag = Math.min(
                    slack,
                    Math.pow(indexDistance, 1.1) *
                        Math.min(16, Math.abs(dx) * 0.06 + Math.abs(offsetX) * 0.4)
                )
                offsetY += sag
            }

            const maxX = Math.max(0, boundsWidth - size.width)
            const maxY = Math.max(0, boundsHeight - size.height)

            const rawX = clamp(baseX + offsetX, 0, Math.max(0, boundsWidth - size.width))
            const rawY = clamp(baseY + offsetY, 0, Math.max(0, boundsHeight - size.height))

            return {
                letter,
                index,
                anchor,
                size,
                indexDistance,
                rawX,
                rawY,
                baseX,
                baseY
            }
        })

        const adjustedX = proposals.map(({ rawX }) => rawX)

        const iterations = 3
        for (let iteration = 0; iteration < iterations; iteration++) {
            for (let i = 1; i < proposals.length; i++) {
                const previous = proposals[i - 1]
                const current = proposals[i]
                const prevX = adjustedX[i - 1]
                const baseSpacing =
                    this.#letterSpacing[i] !== undefined
                        ? this.#letterSpacing[i]
                        : current.anchor.x - previous.anchor.x
                const minSpacing = Math.max(0, baseSpacing - spacingTolerance)
                const maxSpacing = baseSpacing + spacingTolerance
                const desiredSpacing = adjustedX[i] - prevX
                const springForce = (desiredSpacing - baseSpacing) * 0.35
                let clampedSpacing = clamp(
                    desiredSpacing - springForce,
                    minSpacing,
                    maxSpacing
                )
                let candidateX = prevX + clampedSpacing
                const maxX = Math.max(0, boundsWidth - current.size.width)

                candidateX = clamp(candidateX, 0, maxX)
                if (candidateX < prevX) {
                    candidateX = prevX
                }

                adjustedX[i] = candidateX
            }

            for (let i = proposals.length - 2; i >= 0; i--) {
                const current = proposals[i]
                const next = proposals[i + 1]
                const nextX = adjustedX[i + 1]
                const baseSpacing =
                    this.#letterSpacing[i + 1] !== undefined
                        ? this.#letterSpacing[i + 1]
                        : next.anchor.x - current.anchor.x
                const minSpacing = Math.max(0, baseSpacing - spacingTolerance)
                const maxSpacing = baseSpacing + spacingTolerance
                const desiredSpacing = nextX - adjustedX[i]
                const springForce = (desiredSpacing - baseSpacing) * 0.35
                let clampedSpacing = clamp(
                    desiredSpacing - springForce,
                    minSpacing,
                    maxSpacing
                )
                let candidateX = nextX - clampedSpacing
                const maxX = Math.max(0, boundsWidth - current.size.width)

                candidateX = clamp(candidateX, 0, maxX)
                if (candidateX > nextX) {
                    candidateX = nextX
                }

                adjustedX[i] = candidateX
            }
        }

        proposals.forEach(({ letter, index, rawY, indexDistance, size }, idx) => {
            const targetX = adjustedX[idx]
            const targetY = clamp(rawY, 0, Math.max(0, boundsHeight - size.height))

            letter.style.zIndex = `${1000 - indexDistance}`

            if (options.immediate || !this.#letterQuickTo[index]) {
                gsap.set(letter, { x: targetX, y: targetY })
            } else {
                this.#letterQuickTo[index].x(targetX)
                this.#letterQuickTo[index].y(targetY)
            }
        })
    }

    #moveLabel (source, options = {}) {
        if (!this.#placeholder) {
            return
        }

        if (!this.#containerRect) {
            this.#updateMetrics()
        }

        if (!this.#containerRect) {
            return
        }

        const pointerX =
            source?.clientX ?? source?.pageX ?? source?.x ?? null
        const pointerY =
            source?.clientY ?? source?.pageY ?? source?.y ?? null

        if (pointerX === null || pointerY === null) {
            return
        }

        const relativeX = pointerX - this.#containerRect.left
        const relativeY = pointerY - this.#containerRect.top

        this.#lastPointer = { x: relativeX, y: relativeY }

        this.#positionLettersForPointer(this.#lastPointer, options)
    }

    #reapplyLastTarget (options = {}) {
        if (!this.#containerRect) {
            this.#updateMetrics()
        }

        if (!this.#containerRect) return

        if (!this.#lastPointer) {
            this.#resetLettersToAnchors(options)
            return
        }

        this.#positionLettersForPointer(this.#lastPointer, options)
    }
}

if (!customElements.get('footer-magnet-element')) {
    customElements.define('footer-magnet-element', FooterMagnetElement)
}
