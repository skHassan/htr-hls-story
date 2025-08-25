
// importing libraries

import { DailyCarousel } from '../../Libraries/DailyCarousel/DailyCarousel'
import '../../Libraries/DailyCarousel/DailyCarousel.scss'
import {t} from '../../Libraries/translations'

// importing components
import CardComponent from '../CardComponent/CardComponent'
import PreviewComponent from '../PreviewComponent/PreviewComponent'

// importing other requirements
import { leftIcon, rightIcon } from '../../Libraries/IconElements'

/* Inline VideoStory component */
import './InlineComponent.scss'
export default class InlineComponent {
  /**
   * @description To open the inline component
   * @param {number} index - index of the video to open
   */
  public startPreview() {
    this.isActive 
    && this.isInViewport
    && this.previewComponent && this.previewComponent.startPreview()
  }
  /**
   * @description to stop the preview
   */
  public stopPreview() {
    this.previewComponent && this.previewComponent.stopPreview()
  }
  /**
   * To set active state if nto fullscreen mode
   */
  public setActive(active: boolean) {
    this.isActive = active
  }

  /**
   * @description on card click event
   * @param {number} index - index of the video card clicked
   */
  public onCardClick?: (index: number) => void

  private container: HTMLElement
  private videos: any[]
  private isMobile: boolean = false
  private dailyCarousel: any
  private cardComponent: CardComponent
  private previewComponent!: PreviewComponent
  // to check if the component is active not fullscreen
  private isActive: boolean = true
  private isInViewport: boolean = false
  private observer!: IntersectionObserver

  @leftIcon
  private leftIcon!: string
  @rightIcon
  private rightIcon!: string
  constructor(container: HTMLElement, videos: any, isMobile: boolean = false) {
    this.container = container
    this.videos = videos
    this.isMobile = isMobile
    this.cardComponent = new CardComponent()
    this.renderHtml()
    this.renderCarousel()
    this.addSlideToCarousel()
    this.setupObserver()
  }
  private renderHtml() {
    this.container.innerHTML = `
      <div class="daily-carousel story-inline-carousel">
        <ul class="daily-carousel-wrapper story-inline-carousel-wrapper">
        </ul>
      </div>
      <button class="story-inline-btn story-inline-prev" aria-label="${t('prev')}" title="${t('prev')}">${this.leftIcon}</button>
      <button class="story-inline-btn story-inline-next"  aria-label="${t('next')}" title="${t('next')}">${this.rightIcon}</button>
    `
  }
  private renderCarousel(){
    this.dailyCarousel = new DailyCarousel({
      container: this.container.querySelector(".story-inline-carousel")!,
      gap: 16,
      perSlide: 1,
      navigation: {
        nextEl: this.container.querySelector(".story-inline-next")!,
        prevEl: this.container.querySelector(".story-inline-prev")!,
      },
    })
  }

  private addSlideToCarousel () {
    this.videos.forEach( (video: any, index:number) => {
      const card = this.cardComponent.getCard(video)
      const cardBtn = card.querySelector(".story-card-btn") as HTMLElement

      // Add click event to the button
      cardBtn.addEventListener("click", this.onCardBtnClicked.bind(this, card, index))
      // Add keydown event for accessibility (Enter/Space triggers click logic)
      cardBtn.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.onCardBtnClicked(card, index)
        }
      })
      // on mouseover event to show preview for only desktop users
      !this.isMobile && cardBtn.addEventListener("mouseover", () => {
        this.previewComponent && this.previewComponent.onPreview(card)
      })

      // adding card to the carousel
      this.dailyCarousel.appendSlide(card)
    })

    // rendering preview components
    this.previewComponent = new PreviewComponent(this.container.querySelector(".story-inline-carousel-wrapper")!, "")
  }
  private onCardBtnClicked(card: HTMLElement, index:number) {
    this.onCardClick && this.onCardClick(index)
    this.previewComponent.stopPreview()
  }
  /**
   * @description To observer size of container 
   * and start preview if the component is active
   */
  private setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isInViewport = entry.isIntersecting
        this.isInViewport ? this.startPreview() : this.stopPreview()
      })
    }, { threshold: 0.5 })

    this.observer.observe(this.container)
  }
}
