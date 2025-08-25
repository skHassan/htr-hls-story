
import ApiHelper from '../../Libraries/ApiHelper'
import { DailyCarousel } from '../../Libraries/DailyCarousel/DailyCarousel'
import {t} from '../../Libraries/translations'

// importing components
import PlayerComponent from '../PlayerComponent/PlayerComponent'

/* FullPage Player component */
import './FullPageComponent.scss'
export default class FullPageComponent {
    public onOpen?: () => void
    public onClose?: () => void
    /**
     * @description To open the fullscreen component
     * @param {number} index - index of the video to open
     */
    public open(index: number){
        this.firstSlideByOpen = true
        this.container.classList.add("open")
        this.container.setAttribute("aria-hidden", "false")

        const reelEl = this.container.querySelectorAll(".story-reel-slide")[index] as HTMLElement
        const videoEl = reelEl.querySelector("video") as HTMLVideoElement
        this.dailyCarousel.scrollToElement(reelEl)
        videoEl ? videoEl.focus() : this.container.focus()
        // Add ESC key listener
        document.addEventListener("keydown", this.escListener)
        document.body.classList.add("htr-hls-story-fullpage")
        this.onOpen && this.onOpen()
    }

    private dailyCarousel!: DailyCarousel
    private reelElObserver!: IntersectionObserver
    private playerComponentMap = new Map<HTMLElement, PlayerComponent>()
    private storyAnnouncer!: HTMLElement

    private container: HTMLElement
    private videos: any[]
    // private dataParams: any = null
    private closeBtn: HTMLElement = null as any
    private showCloseButtonOnAd: number = null as any
    private callToAction: any = null
    private refId: string = ""
    private addDynamicSlide: any = null
    private lastAdSlideIndex: number = 0
    private lazyLoad: boolean = false
    private firstSlideByOpen: boolean = false
    /**
     * 
     * @param {HTMLElement} container - The container element for the full page component
     * @param {any[]} videos - Array of video objects to be displayed 
     * @param {boolean} lazyLoad - to load player lazyly 
     * @param {number} showCloseButtonOnAd - number of seconds to show close button on ad
     * @param {any} dataParams - Additional data parameters for the player 
     * @param {any} callToAction - Additional information for callToAction 
     * @param {any} addDynamicSlide - Function to add dynamic slides, if any 
     * @param {string} refId - Reference of Vertical video story id 
     */
    constructor(
        container: HTMLElement,
        videos: any[],
        lazyLoad: boolean = false,
        showCloseButtonOnAd: number = null as any,
        dataParams: any = "",
        callToAction: any = null,
        addDynamicSlide: any = null,
        refId:string = ""
    ) {
        this.container = container
        this.videos = videos
        this.lazyLoad = lazyLoad
        this.showCloseButtonOnAd = showCloseButtonOnAd
        // this.dataParams = dataParams
        this.callToAction = callToAction
        this.addDynamicSlide = addDynamicSlide
        this.refId = refId
        this.setupForDynamicSlide()
        this.renderHtml()
        this.renderCarousel()
        this.addSlideToCarousel()
    }
    private setupForDynamicSlide(){
        if(this.addDynamicSlide && this.refId){
            (window as any)["htrHlsStory"][this.refId].lockSlide = this.onAdUIChange.bind(this)
        }
    }
    private renderHtml() {
        this.container.innerHTML = `<div class="daily-carousel story-fullpage-carousel" role="region" aria-label="${t('fullpage_label')}">
                <ul class="daily-carousel-wrapper story-fullpage-carousel-wrapper">
                </ul>
            </div>
            <div
                class="htr-hls-story-announcer htr-hls-story-visually-hidden"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            ></div>
            <div class="story-fullpage-btn-wrapper">
                <button class="story-fullpage-btn story-fullpage-prev" aria-label="${t('fullpage_prev')}" title="${t('fullpage_prev')}">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <circle cx="22" cy="22" r="22" transform="rotate(-90 22 22)" fill="white" ></circle>
                    <path d="M15.125 24.75L22 16.5L29.3333 24.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
                <button class="story-fullpage-btn story-fullpage-next" aria-label="${t('fullpage_next')}" title="${t('fullpage_next')}">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <circle cx="22" cy="22" r="22" transform="rotate(90 22 22)" fill="white" ></circle>
                    <path d="M28.875 19.25L22 27.5L14.6667 19.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>
            <button class="stroy-fullpage-close" aria-label="${t('fullpage_close')}" title="${t('fullpage_close')}">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 19L19 5M19 19L5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>`
        // selecting elements
        this.storyAnnouncer = this.container.querySelector(".htr-hls-story-announcer")!
        // on close button click
        this.closeBtn = this.container.querySelector(".stroy-fullpage-close") as HTMLElement
        this.closeBtn.addEventListener("click", this.closeFullPage.bind(this))

    }
    private renderCarousel(){
        this.dailyCarousel = new DailyCarousel({
            container: this.container.querySelector(".story-fullpage-carousel")!,
            type: "vertical",
            gap: 0,
            perSlide: 1,
            navigation: {
                nextEl: this.container.querySelector(".story-fullpage-next")!,
                prevEl: this.container.querySelector(".story-fullpage-prev")!,
            },
        })
    }

    private addSlideToCarousel () {
        // initializing reel observer
        this.initReelObserver()
        // creating slides for each video
        this.videos.forEach( async(video: any, index) => {
            const reel = document.createElement("li")
            reel.classList.add("story-reel-slide", "loading")
            reel.setAttribute("aria-current", "false")
            reel.setAttribute("data-vvs-vi", `${index}`)
            this.dailyCarousel.appendSlide(reel)
            this.reelElObserver!.observe(reel)

            const subtitle = await ApiHelper.getSubtitle(video.id)
            subtitle && (video.subtitle = subtitle)
            
            const playerComponent = new PlayerComponent(
                reel,
                video,
                this.lazyLoad,
                // this.getDataParams(index+1),
                this.getCallToActionInfo(video.id)
            )
            // playerComponent.onAdChange = (flag: boolean)=>{
            //     this.onAdUIChange(flag, reel)
            // }
            this.playerComponentMap.set(reel, playerComponent)
        })
                
    }
    // private getDataParams(slidePos: number): string{
    //     if(this.dataParams){
    //         // if its array then there are multiple values 
    //         if(Array.isArray(this.dataParams)){
    //             let returnVal = ""
    //             // Try to find a config with matching position
    //             let matched = this.dataParams.find((obj: any) => obj.position && obj.position.includes(slidePos))
    //             if(matched){
    //                 returnVal = matched.value
    //             } else {
    //                 // If no match, check for a default value
    //                 matched = this.dataParams.find((obj: any) => !obj.position)
    //                 returnVal = matched ? matched.value : ""
    //             }
    //             return returnVal
    //         }else{
    //             return (
    //                 this.dataParams.position 
    //                 ? this.dataParams.position.includes(slidePos) && this.dataParams.value 
    //                 : this.dataParams.value
    //             )
    //         }
    //     }else 
    //         return ""
    // }
    private getCallToActionInfo(videoId: string): any{
        if(this.callToAction && this.callToAction[videoId]){
            return this.callToAction[videoId]
        } else
            return null
    }
    private escListener (e: KeyboardEvent) {
        if (e.key === "Escape" || e.key === "Esc") {
            this.closeFullPage()
        }
    }
    private onAdUIChange (isAdPlaying: boolean, el?: HTMLElement) {
        isAdPlaying ? this.dailyCarousel.lock() : this.dailyCarousel.unlock()
        this.closeBtn.setAttribute("aria-hidden", String(isAdPlaying))
        this.closeBtn.setAttribute("tabindex", isAdPlaying ? "-1" : "0")
        this.closeBtn.classList.toggle("htr-hls-story-hidden", isAdPlaying)

        if(isAdPlaying && this.showCloseButtonOnAd){
            const timeout = setTimeout(() => {
                clearTimeout(timeout)
                this.onAdUIChange(false)
                el && el.classList.add("ad-clicked")
            }, this.showCloseButtonOnAd * 1000)
        }
    }
    private closeFullPage () {
        // Remove ESC key listener
        document.removeEventListener("keydown", this.escListener)
        
        this.container.contains(document.activeElement) 
        &&(document.activeElement as HTMLElement).blur()

        this.container.classList.remove("open")
        this.container.setAttribute("aria-hidden", "true")
        document.body.classList.remove("htr-hls-story-fullpage")
        // remove ad slide if any
        if(this.addDynamicSlide){
            this.container.querySelectorAll(".story-reel-adslide").forEach((slide: Element)=>{
                slide.parentElement?.removeChild(slide)
            })
            //reset adslide index
            this.lastAdSlideIndex = 0
            this.dailyCarousel.unlock()
        }
        this.firstSlideByOpen = false
        this.onClose && this.onClose()
    }
    private onActivityChange (el: HTMLElement, flag: boolean) {
        const playerComponent = this.playerComponentMap.get(el)
        // if it is player component
        if(playerComponent && playerComponent instanceof PlayerComponent){
            this.lazyLoad && flag && this.loadPlayersForLazy(el,playerComponent)
            
            playerComponent.onViewablityChange(flag)
            flag && (this.storyAnnouncer.textContent = `Now ${playerComponent.getStatus()}`)

            if(flag && this.addDynamicSlide) {
                const newIndex = Number(el.getAttribute("data-vvs-vi"))
                // console.log(newIndex, this.lastAdSlideIndex)
                if ( newIndex >= this.lastAdSlideIndex) {
                    // console.log(newIndex, this.addDynamicSlide.perSlide)
                    // if perSlide is function then call it
                    // else if it is number then check if it is multiple of perSlide
                    // and create ad slide
                    if(typeof this.addDynamicSlide.perSlide === "function"){
                        this.addDynamicSlide.perSlide(newIndex+1) 
                        && this.createAdSlide(el, newIndex)
                    }else if((newIndex+1) % this.addDynamicSlide.perSlide == 0){
                        this.createAdSlide(el, newIndex)
                    }
                }
            }
            this.onAdUIChange(false)
            // if(flag && el.classList.contains("ad-playing") && !el.classList.contains("ad-clicked")){
            //     this.onAdUIChange(true)
            // }
        }else if(el.classList.contains("story-reel-adslide")){ 
            // if it is ad slide
            el.classList.toggle("story-reel-active", flag)
            this.container.setAttribute("aria-current", String(flag))
            flag && this.addDynamicSlide.onShow(el)
        }

    }
    private loadPlayersForLazy(el: HTMLElement, playerComponent: PlayerComponent) {
        const keys = Array.from(this.playerComponentMap.keys());
        const currentIndex = keys.indexOf(el);
        const indicesToCreate = new Set<number>();

        // Always create current
        indicesToCreate.add(currentIndex);

        // Next and previous
        if (currentIndex + 1 < keys.length) indicesToCreate.add(currentIndex + 1);
        if (currentIndex - 1 >= 0) indicesToCreate.add(currentIndex - 1);

        // If first slide, also create next-next
        if (currentIndex === 0 && keys.length > 2) indicesToCreate.add(2);

        // If last slide, also create prev-prev
        if (currentIndex === keys.length - 1 && keys.length > 2) indicesToCreate.add(keys.length - 3)
        
        // if not first slide
        if(!this.firstSlideByOpen && currentIndex > 0 && keys.length > currentIndex + 2) {
            // Create next-next
            indicesToCreate.add(currentIndex + 2);
        }else{
            this.firstSlideByOpen = false
        }

        // Create players as needed
        for (const idx of indicesToCreate) {
            const comp = this.playerComponentMap.get(keys[idx]);
            if (comp && !comp.playerCreated) comp.createPlayer();
        }
    }
    private createAdSlide(afterSlide: HTMLElement, newIndex: number){

        const reel = document.createElement("li")
        reel.classList.add("story-reel-slide", "story-reel-adslide")
        reel.setAttribute("aria-current", "false")

        this.dailyCarousel.appendSlide(reel, afterSlide)
        this.reelElObserver!.observe(reel)
        this.addDynamicSlide.onCreate(reel)

        this.lastAdSlideIndex = newIndex+1
    }
    /**
     * @description To observer li element 
     * to play and pause on slide change
     */
    private initReelObserver() {
        this.reelElObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                this.onActivityChange(entry.target as HTMLElement, entry.isIntersecting)
            })
        }, {
            threshold: 0.6,
        })
    }
}