
// Extend the Window interface to include htrHlsStoryMuted
declare global {
    interface Window {
        htrHlsStoryMuted: boolean
        htrHlsStorySubtitle: boolean
        temDMPlayer: any
    }
}
import { getDateString, popMessage } from '../../Libraries/MiscHelper'
import {t} from '../../Libraries/translations'
import HLSPlayerComponent from '../HLSPlayerComponent/HLSPlayerComponent'
import EventPass from '../../Libraries/EventPass'

/* Player component */
import './PlayerComponent.scss'
/**
 * @description PlayerComponent class for handling video player functionality in a story reel.
 * @class PlayerComponent
 */
export default class PlayerComponent{
    /**
     * @description This method is called when the visibility of the video changes.
     * @param isVisible - true if the video is visible, false otherwise
     */
    public onViewablityChange(isVisible: boolean) {
        if (isVisible) {
            this.container.classList.toggle("story-reel-active", true)
            this.container.setAttribute("aria-current", "true")

            this.player 
            && (
                window["htrHlsStoryMuted"] !== undefined && (
                    this.player.setMute = window["htrHlsStoryMuted"]
                ),
                window["htrHlsStorySubtitle"] !== undefined &&  (
                    this.player.setSubtitles = window["htrHlsStorySubtitle"]
                ),
                this.player.play(),EventPass("playerIsVisible", this.videoInfo.id)
            )  
        }else{
            this.container.classList.toggle("story-reel-active", false)
            this.container.setAttribute("aria-current", "false")

            this.player ? (
                this.player.pause(),
                EventPass("playerIsHidden", this.videoInfo.id)
             ) : null
        }
    }
    /**
     * @description Returns the status of the video slide, including the title of the video.
     * @returns {string} - Status of the video slide
     * @memberof PlayerComponent
     */
    public getStatus(): string {
        return "Video slide: "+ this.videoInfo.title
    }
    /**
     * @description Callback when ad state changes
     * @param {boolean} isAdPlaying - true if ad is playing, false otherwise
     * @memberof PlayerComponent
     * @example
     * onAdChange: (isAdPlaying: boolean) => {
     *     console.log("Ad is playing: ", isAdPlaying);
     * }
     * @type {function}
     */
    public onAdChange?: (isAdPlaying: boolean) => void
    /**
     * @description Flag to check if player is created
     * @type {boolean}
     */
    public playerCreated: boolean = false
    /**
     * @description Creating player
     */
    public createPlayer(){
        const videoId = this.videoInfo.id
        // if already script exist, do not create one
        if( document.querySelector("#video-"+ videoId)) return
        this.playerCreated = true

        const playerDiv = document.createElement("div")
        playerDiv.id = "video-" + videoId
        playerDiv.classList.add("story-player")
        playerDiv.setAttribute("data-video", videoId)
        this.playerContainer.appendChild(playerDiv)
        this.player = new HLSPlayerComponent(this.videoInfo.stream_hls_url, videoId, playerDiv, this.videoInfo.subtitle)
        this.addEvents()
    }

    private container: HTMLElement
    private callToAction: any = null
    private videoInfo: any
    private player: HLSPlayerComponent = null as any 
    private playerContainer: HTMLElement = null as any
    private progressContainer: HTMLElement = null as any
    private progressBar: HTMLElement = null as any
    private progressIndicator: HTMLElement = null as any
    private volumeBtn: HTMLButtonElement = null as any
    private subtitleBtn: HTMLButtonElement = null as any
    private shareBtn: HTMLButtonElement = null as any

    
    /**
     * @description Player component constructor
     * @param {HTMLElement} container - HTML element to render the player
     * @param {any} videoInfo - Video information object
     * @param {boolean} lazyLoad - Whether to lazy load the player (default: true)
     * @param {any} callToAction - Call to action object (optional)
     */
    constructor(
        container: HTMLElement,
        videoInfo: any,
        lazyLoad: boolean = true,
        callToAction: any = null
    ){
        this.container = container
        this.videoInfo = videoInfo
        this.callToAction = callToAction
        this.renderHtml()
        // if not lazy load, create player immediately
        !lazyLoad && this.createPlayer()
    }
    private renderHtml() {
        this.container.innerHTML = `<div class="story-player-wrapper"></div>
            <div class="story-reel-overlay">
                <div class="story-reel-play-pause-state">
                    <span class="story-reel-pause">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="32" fill="black" fill-opacity="0.3"/>
                            <path d="M24 18.6666V45.3332" stroke="white" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M40 18.6666V45.3332" stroke="white" stroke-width="5.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="htr-hls-story-visually-hidden">${t('play_label')}</span>
                    </span>
                    <span class="story-reel-play">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="story-reel-play" width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="32" fill="black" fill-opacity="0.3"/>
                            <path d="M46.6773 30.3294L25.8659 15.9215C24.5184 14.9886 22.6777 15.9531 22.6777 17.592V46.4078C22.6777 48.0467 24.5184 49.0111 25.8659 48.0782L46.6773 33.6703C47.8443 32.8624 47.8443 31.1373 46.6773 30.3294Z" fill="white"/>
                        </svg>
                        <span class="htr-hls-story-visually-hidden">${t('pause_label')}</span>
                    </span>
                </div>
                <div class="story-reel-loader">
                    <span></span>
                </div>
                <div class="story-reel-top-sec">
                
                    <h2 class="story-reel-name">${t('shorts_text')}</h2>
                    <div class="story-reel-video-tags">
                        ${
                            (()=>{
                                let tags = ''

                                this.videoInfo.tags.forEach((tag:string)=>{
                                    tags += `<span>#${tag}</span>`
                                })
                                return tags
                            })()
                        }
                    </div>
                </div>
                <div class="story-reel-bottom-sec">
                    <div class="story-reel-bottom-left">
                        ${
                            this.callToAction 
                            ? `<a class="story-reel-cta" href="${this.callToAction.link}" target="_blank">${this.callToAction.text ? this.callToAction.text :  "More Information"}</a>`
                            : ""
                        }
                        <div class="story-reel-owner">
                            <div class="story-reel-owner-ava">
                                <img src="${this.videoInfo["owner.avatar_60_url"]}" alt="${this.videoInfo.title}" />
                            </div>
                            <div class="story-reel-video-meta">
                                <h4 class="story-reel-owner-name">${this.videoInfo["owner.screenname"]}</h4>
                                <time class="story-reel-video-time" datetime="${getDateString(this.videoInfo.created_time, "datetime")}">${getDateString(this.videoInfo.created_time)}</time>
                            </div>
                        </div>
                        <div class="story-reel-title-wrapper">
                            <h3 class="story-reel-title" id="video-title-${this.videoInfo.id}">${this.videoInfo.title}</h3>
                        </div>
                        <div class="story-reel-progress" role="slider" aria-label="Video progress bar" tabindex="0" aria-valuemin="0">
                            <div class="story-reel-progress-wrap">
                                <div class="story-reel-progress-bar">
                                    <span class="reel-progress-indicator" aria-hidden="true"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="story-reel-btn-wrapper">
                        <button class="story-reel-btn sub-button" aria-label="${t('subtitles_not_available')}" title="${t('subtitles_not_available')}" disabled>
                            <svg aria-hidden="true" class="subtitle-off" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <rect x="4" y="6.00009" width="23" height="18" rx="1.5" stroke="white" stroke-width="2" stroke-linejoin="round"></rect>
                                <path d="M8 11.25H11.75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M8 15H14.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M18 15L23 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M15.5 11.25L23 11.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M23 18.75H21.75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M8 18.75H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <svg aria-hidden="true" class="subtitle-on" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 7.5C2.5 6.11929 3.61929 5 5 5H25C26.3807 5 27.5 6.11929 27.5 7.5V22.5C27.5 23.8807 26.3807 25 25 25H5C3.61929 25 2.5 23.8807 2.5 22.5V7.5ZM6.25 11.25C6.25 10.5596 6.80964 10 7.5 10H11.25C11.9404 10 12.5 10.5596 12.5 11.25C12.5 11.9404 11.9404 12.5 11.25 12.5H7.5C6.80964 12.5 6.25 11.9404 6.25 11.25ZM7.5 13.75C6.80964 13.75 6.25 14.3096 6.25 15C6.25 15.6904 6.80964 16.25 7.5 16.25H13.75C14.4404 16.25 15 15.6904 15 15C15 14.3096 14.4404 13.75 13.75 13.75H7.5ZM16.25 15C16.25 14.3096 16.8096 13.75 17.5 13.75H22.5C23.1904 13.75 23.75 14.3096 23.75 15C23.75 15.6904 23.1904 16.25 22.5 16.25H17.5C16.8096 16.25 16.25 15.6904 16.25 15ZM15 10C14.3096 10 13.75 10.5596 13.75 11.25C13.75 11.9404 14.3096 12.5 15 12.5H22.5C23.1904 12.5 23.75 11.9404 23.75 11.25C23.75 10.5596 23.1904 10 22.5 10H15ZM23.75 18.75C23.75 19.4404 23.1904 20 22.5 20H21.25C20.5596 20 20 19.4404 20 18.75C20 18.0596 20.5596 17.5 21.25 17.5H22.5C23.1904 17.5 23.75 18.0596 23.75 18.75ZM7.5 17.5C6.80964 17.5 6.25 18.0596 6.25 18.75C6.25 19.4404 6.80964 20 7.5 20H17.5C18.1904 20 18.75 19.4404 18.75 18.75C18.75 18.0596 18.1904 17.5 17.5 17.5H7.5Z" fill="white"/>
                            </svg>
                            <span class="story-reel-btn-name" aria-hidden="true">${t('subtitles_text')}</span>
                        </button>
                        <button class="story-reel-btn mute-button" title="${'unmute_label'}" aria-label="${'unmute_label'}" aria-pressed="true">
                            <svg aria-hidden="true" class="unmute-svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M10 20H5V10H10L15 5V25L10 20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M20 10C22.5 12.5 22.5 17.5 20 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M20 5C28.125 9.375 28.125 20.625 20 25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <svg aria-hidden="true" class="mute-svg" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M10 20H5V10H10L15 5V25L10 20Z" stroke="#606060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20 10C22.5 12.5 22.5 17.5 20 20" stroke="#606060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20 5C28.125 9.375 28.125 20.625 20 25" stroke="#606060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.5 4L25.5 26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span aria-hidden="true" class="story-reel-btn-name" >${t('sound_text')}</span>
                        </button>
                        <button class="story-reel-btn share-button" title="${t('share_label')}" aria-label="${t('share_label')}" aria-pressed="false">
                            <svg class="not-clicked" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M17.7429 11.2581C9.09819 11.4816 5.99404 16.3066 4.64037 21.1235C4.44352 21.824 5.70329 22.2947 6.19481 21.7582C9.68124 17.9528 14.4018 18.0627 17.8671 18.6579C18.1628 18.7087 18.375 18.9671 18.375 19.2672V23.4106C18.375 24.0076 19.1319 24.2648 19.4956 23.7914L25.9575 15.3808C26.13 15.1562 26.13 14.8438 25.9575 14.6192L19.4956 6.20858C19.1319 5.73519 18.375 5.99167 18.375 6.58863V10.6237C18.375 10.9689 18.088 11.2492 17.7429 11.2581Z" stroke="white" stroke-width="2" stroke-linejoin="round"></path>
                            </svg>
                            <svg class="clicked" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M18.7436 11.2581C10.0527 11.4815 6.39313 16.3276 4.77423 21.1553C4.5429 21.8451 5.74917 22.325 6.25558 21.8025C9.98952 17.9503 15.3329 18.0605 18.8673 18.6587C19.1632 18.7087 19.375 18.9671 19.375 19.2672V24.0287C19.375 24.6599 20.2042 24.8932 20.5333 24.3546L26.0508 15.3259C26.1731 15.1258 26.1731 14.8742 26.0508 14.6741L20.5333 5.6454C20.2042 5.10679 19.375 5.33891 19.375 5.97013V10.6242C19.375 10.9694 19.0887 11.2492 18.7436 11.2581Z" fill="white" stroke="white" stroke-width="1.66667" stroke-linejoin="round"/>
                            </svg>
                            <span class="story-reel-btn-name" >${t('share_text')}</span>
                        </button>
                    </div>
                </div>
            </div>`

        this.playerContainer = this.container.querySelector(".story-player-wrapper")!
        this.progressContainer = this.container.querySelector(".story-reel-progress")!
        this.progressBar = this.progressContainer.querySelector(".story-reel-progress-bar")!
        this.progressIndicator = this.progressBar.querySelector(".reel-progress-indicator")!
        this.volumeBtn = this.container.querySelector(".mute-button")!
        this.subtitleBtn = this.container.querySelector(".sub-button")!
        this.shareBtn = this.container.querySelector(".share-button")!
        // check for overflow in title
        this.checkOverflowWhenVisible()
    }
    private checkOverflowWhenVisible() {
        const titlWrapper = this.container.querySelector(".story-reel-title-wrapper") as HTMLElement
        const title = titlWrapper.querySelector(".story-reel-title") as HTMLElement

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lineHeight = parseFloat(getComputedStyle(title).lineHeight)
                    // if title is overflowing, add toggle button
                    if( title.scrollHeight > lineHeight * 2 ){
                        const toggleButton = document.createElement("button")
                        toggleButton.classList.add("story-reel-title-toggle")
                        toggleButton.textContent = 'Show More'
                        toggleButton.setAttribute("aria-controls", "video-title-"+this.videoInfo.id)
                        toggleButton.setAttribute("aria-expanded", "false")
                        titlWrapper.appendChild(toggleButton)


                        toggleButton.addEventListener("click", (e)=>{
                            e.stopPropagation()
                            const expanded = title.classList.toggle('expanded')
                            toggleButton.setAttribute("aria-expanded", String(expanded))
                            toggleButton.textContent = expanded ? 'Show less' : 'Show more'
                        })
                    }
                    observer.disconnect()
                 }
            })
        })

        observer.observe(this.container)
    }
    private addEvents(){
        // on ready
        this.player.onLoad = (videoDuration:number)=>{
            // update ARIA for progress bar
            this.progressContainer.setAttribute("aria-valuemax",videoDuration.toFixed(0))
            // seting for mute and subtitle
            window["htrHlsStoryMuted"] !== undefined &&  (
                this.player.setMute = window["htrHlsStoryMuted"] as boolean
            )
            this.player.isSubtitleAvailable
            && (this.subtitleBtn.disabled = false)

            this.player.isSubtitleAvailable 
            && (window["htrHlsStorySubtitle"] = this.player.isSubtitleActive)
            
            this.container.classList.contains("story-reel-active") && this.player.play()
        }
        // on progress
        this.player.onProgress = (videoDuration: number, currentTime: number)=>{  
            this.progressBar.style.width = Math.floor((currentTime / videoDuration) * 100) + '%'
            this.progressIndicator.textContent = currentTime.toFixed(0)
            // update ARIA
            this.progressContainer.setAttribute("aria-valuenow", currentTime.toFixed(0))
            this.progressContainer.setAttribute("aria-valuetext", "Current Time: " + currentTime.toFixed(0) + " seconds")
        }
        // on video start
        this.player.onVideoStart = ()=>{
            // if not active, pause the video
            !this.container.classList.contains("story-reel-active") && this.player.pause()

            // for mobile add playing instantly
            this.container.closest(".htr-hls-story")?.classList.contains("container-small")
                ? (this.container.classList.add("playing"), this.container.classList.remove("paused"))
                : (
                    setTimeout(()=>{
                        if( this.player.isPlaying ){
                            this.container.classList.add("playing")
                            this.container.classList.remove("paused")   
                        }
                    }, 1500)
                )
            // set mute option
            this.container.classList.toggle("muted", this.player.isMuted)
        }
        // on video subtitles change
        this.player.onSubtitleToggle = (flag:boolean)=>{
            window["htrHlsStorySubtitle"] = flag
            // update ARIA attributes
            if(flag){
                this.subtitleBtn.setAttribute("aria-label", t('subtitle_off_label'))
                this.subtitleBtn.setAttribute("title", t('subtitle_off_label'))
                this.subtitleBtn.setAttribute("aria-pressed", "true")
                this.container.classList.add("vvs-cc")
            }else{
                this.subtitleBtn.setAttribute("aria-label", t('subtitle_on_label'))
                this.subtitleBtn.setAttribute("title", t('subtitle_on_label'))
                this.subtitleBtn.setAttribute("aria-pressed", "false")
                this.container.classList.remove("vvs-cc")
            }
        }
        // on volume change
        this.player.onMute = (isMuted: boolean)=>{
            this.container.classList.toggle("muted", isMuted)
            isMuted
                ? (
                    this.volumeBtn.setAttribute("aria-label", t('unmute_label')),
                    this.volumeBtn.setAttribute("title", t('unmute_label')),
                    this.volumeBtn.setAttribute("aria-pressed", "true")
                )
                : (
                    this.volumeBtn.setAttribute("aria-label", t('mute_label')),
                    this.volumeBtn.setAttribute("title", t('mute_label')),
                    this.volumeBtn.setAttribute("aria-pressed", "false")
                )
            window["htrHlsStoryMuted"] = isMuted
        }
        // on player play 
        this.player.onPlay = (playedByUser: boolean)=>{
            // if playedBy user show animation in mobile
            this.container.closest(".htr-hls-story")?.classList.contains("container-small") 
            && this.container.classList.toggle("story-reel-byuser", playedByUser)

            this.container.classList.remove("paused")
            this.container.classList.add("playing")
        }
        // on player pause 
        this.player.onPause = (playedByUser: boolean)=>{
            // if playedBy user show animation in mobile
            this.container.closest(".htr-hls-story")?.classList.contains("container-small") 
            && this.container.classList.toggle("story-reel-byuser", playedByUser)

            this.container.classList.add("paused"),
            this.container.classList.remove("playing")
        }

        this.player.onCanPlay = ()=>{
            this.container.classList.remove("loading")
        }
        this.player.onWating = ()=>{
            this.container.classList.add("loading")
        }
        // ------------------- HTML interaction --------------------------//
        
        // on progress button click
        this.progressContainer.addEventListener('click', (e)=>{
            e.stopPropagation()
            this.player.currentTime = e.offsetX / this.progressContainer.offsetWidth
        }, false)
        // // on volume button click
        this.volumeBtn.addEventListener('click', async(e)=>{
            e.stopPropagation()
            this.player.setMute = !this.container.classList.contains("muted")
        }, false)
        // // on subtitle button click
        this.subtitleBtn.addEventListener('click', async(e)=>{
            e.stopPropagation()
            if(!this.player || !this.player.isSubtitleAvailable)  return
            this.player.setSubtitles = !this.player.isSubtitleActive
        }, false)
        // // on share button click 
        this.shareBtn.addEventListener('click', async(e)=>{
            e.stopPropagation()
            const playerIsPlaying = this.player.isPlaying

            // display pop msg for desktop
            if(!this.container.closest(".htr-hls-story")?.classList.contains("container-small")){
                try {
                    await navigator.clipboard.writeText(window.location.href)
                    popMessage(t('share_copy_text'), this.container.closest(".video-stroy-fullpage-wrapper")!)
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }   
            }

            // checking if navigation share api present in browser
            if (navigator.share) { 
                playerIsPlaying && this.player.pause()
                this.shareBtn.classList.add("active")
                this.shareBtn.setAttribute("aria-pressed", "true")
                try {
                    await navigator.share({
                        title: "QN reel",
                        text: this.videoInfo.title,
                        url: window.location.href,
                    })

                } catch (err) {
                    console.log(err)
                }

                this.shareBtn.classList.remove("active")
                this.shareBtn.setAttribute("aria-pressed", "false")

                playerIsPlaying && this.player.play()
            } else{
                console.log("Share API not supported in this browser.")
            }
        }, false)
    }
}