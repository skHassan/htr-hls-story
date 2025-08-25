// daily-carousel.ts

export interface DailyCarouselOptions {
  container: HTMLElement
  gap?: number
  perSlide?: number
  navigation?: {
    nextEl: HTMLElement
    prevEl: HTMLElement
  }
  type?: "horizontal" | "vertical" // Renamed from direction
}

export class DailyCarousel {

  public appendSlide(slide: HTMLElement, afterSlide?: HTMLElement) {
    slide.classList.add("daily-carousel-slide")
    if (afterSlide) {
      // Insert after the given slide element
      const refNode = afterSlide.nextSibling
      this.wrapper.insertBefore(slide, refNode)
    } else {
      // Append at the end
      this.wrapper.appendChild(slide)
    }
    this.updateNavigation()
  }
  public removeSlide(slide: HTMLElement) {
    this.wrapper.removeChild(slide)
    this.updateNavigation()
  }
  public lock() {
      if (this.isScrolling) {
        // Wait and try again after 50ms
        this.lockTimeout && clearTimeout(this.lockTimeout)
        this.lockTimeout = setTimeout(this.lock.bind(this), 50)
      } else {
        if (this.navigation) {
          this.navigation.nextEl.classList.add("locked")
          this.navigation.prevEl.classList.add("locked")
        }
        this.container.style.overflow = "hidden"
      }
  }

  public unlock() {
    this.lockTimeout && clearTimeout(this.lockTimeout)
    this.container.style.overflow = ""
    if (this.navigation) {
      this.navigation.nextEl.classList.remove("locked")
      this.navigation.prevEl.classList.remove("locked")
    }
    this.updateNavigation()
  }

  // public slideTo(index: number) {
  //   const slideSize = this.getSlideSize()
  //   const target = slideSize * index
  //   if (this.type === "vertical") {
  //     const maxScroll = this.container.scrollHeight - this.container.clientHeight
  //     const scrollTop = Math.max(0, Math.min(target, maxScroll))
  //     this.container.scrollTo({ top: scrollTop, behavior: "instant" })
  //   } else {
  //     const maxScroll = this.container.scrollWidth - this.container.clientWidth
  //     const scrollLeft = Math.max(0, Math.min(target, maxScroll))
  //     this.container.scrollTo({ left: scrollLeft, behavior: "instant" })
  //   }
  //   setTimeout(() => this.updateNavigation(), 350)
  // }
  
  public scrollToElement(element: HTMLElement) {
    if (!element) return

    const containerRect = this.container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    if (this.type === "vertical") {
      const offset = elementRect.top - containerRect.top + this.container.scrollTop
      this.container.scrollTo({ top: offset, behavior: "instant" })
    } else {
      const offset = elementRect.left - containerRect.left + this.container.scrollLeft
      this.container.scrollTo({ left: offset, behavior: "instant" })
    }
    setTimeout(() => this.updateNavigation(), 350)
  }

  private isScrolling = false
  private scrollTimeout: any = null
  private lockTimeout:any = null
  private container: HTMLElement
  private wrapper: HTMLElement
  private gap: number
  private perSlide: number
  private navigation?: {
    nextEl: HTMLElement
    prevEl: HTMLElement
  }
  private type: "horizontal" | "vertical" // Renamed from direction

  constructor(options: DailyCarouselOptions) {
    const {
      container,
      gap = 0,
      perSlide = 1,
      navigation,
      type = "horizontal" // Default value
    } = options

    this.container = container
    this.gap = gap
    this.perSlide = perSlide
    this.navigation = navigation
    this.type = type

    const wrapper = this.container.querySelector(".daily-carousel-wrapper") as HTMLElement
    if (!wrapper) throw new Error(".daily-carousel-wrapper not found inside container")
    this.wrapper = wrapper

    this.gap && this.wrapper.style.setProperty('--daily-carousel-gap', `${this.gap}px`)

    // Only toggle class, let SCSS handle styles
    if (this.type === "vertical") {
      this.container.classList.add("vertical")
    } else {
      this.container.classList.remove("vertical")
    }

    if (navigation?.nextEl && navigation?.prevEl) {
      [navigation.nextEl, navigation.prevEl].forEach(
        btn => btn.classList.add("daily-carousel-btn")
      )

      navigation.nextEl.addEventListener("click", () => this.scrollBy(1))
      navigation.prevEl.addEventListener("click", () => this.scrollBy(-1))
      this.container.addEventListener("scroll", () => {
        this.isScrolling = true
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
        this.scrollTimeout = setTimeout(() => {
          this.isScrolling = false
        }, 100)
        this.updateNavigation()
      })
      window.addEventListener("resize", () => this.updateNavigation())
      this.updateNavigation()
    }
  }

  private getSlideSize(): number {
    const slide = this.wrapper.querySelector(".daily-carousel-slide") as HTMLElement
    if (!slide) return 0

    const style = window.getComputedStyle(slide)
    if (this.type === "vertical") {
      const marginBottom = parseFloat(style.marginBottom || "0")
      return slide.offsetHeight + marginBottom + this.gap
    } else {
      const marginRight = parseFloat(style.marginRight || "0")
      return slide.offsetWidth + marginRight + this.gap
    }
  }

  private scrollBy(direction: 1 | -1) {
    const scrollAmount = this.getSlideSize() * this.perSlide
    if (this.type === "vertical") {
      const maxScroll = this.container.scrollHeight - this.container.clientHeight
      let target = this.container.scrollTop + direction * scrollAmount
      target = Math.max(0, Math.min(target, maxScroll))
      this.container.scrollTo({ top: target, behavior: "smooth" })
    } else {
      const maxScroll = this.container.scrollWidth - this.container.clientWidth
      let target = this.container.scrollLeft + direction * scrollAmount
      target = Math.max(0, Math.min(target, maxScroll))
      this.container.scrollTo({ left: target, behavior: "smooth" })
    }
    setTimeout(() => this.updateNavigation(), 350)
  }

  private updateNavigation() {
    if (!this.navigation) return

    const { nextEl, prevEl } = this.navigation
    const isVertical = this.type === "vertical"

    const scrollPos = isVertical ? this.container.scrollTop : this.container.scrollLeft
    const maxScroll = isVertical
      ? this.container.scrollHeight - this.container.clientHeight
      : this.container.scrollWidth - this.container.clientWidth

    const nearStart = scrollPos <= 0
    const nearEnd = scrollPos >= maxScroll - 1 // allow slight buffer for float precision


    // Show/hide or enable/disable
    nearStart 
    ? prevEl.setAttribute("disabled", "true") 
    : prevEl.removeAttribute("disabled")
    
    nearEnd 
    ? nextEl.setAttribute("disabled", "true") 
    : nextEl.removeAttribute("disabled")

  }

}
