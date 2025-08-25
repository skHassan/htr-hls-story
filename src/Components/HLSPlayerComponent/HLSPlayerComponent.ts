
import HLS from "hls.js"
import toWebVTT from "../../Libraries/srtToVtt"
import EventPass from "../../Libraries/EventPass"

export default class HLSPlayerComponent{
    //-----------------------Set Event Callbacks-----------------------
    /**
     * Callback for when the video metadata is loaded.
     * @callback onLoad
     * @param {number} duration - The duration of the video in seconds.
     */
    public set onLoad(callback: any){
        this.videoEl.addEventListener("loadedmetadata", ()=>{
            callback(this.videoEl.duration)
        }, false)
    }
    /**
     * Callback for when the video is progressing.
     * @callback onProgress
     * @param {number} duration - The total duration of the video in seconds.
     * @param {number} currentTime - The current playback position in seconds.
     */
    public set onProgress(callback: any){
        this.videoEl.addEventListener("timeupdate", ()=>{
            callback(this.videoEl.duration, this.videoEl.currentTime)
        }, false)
    }
    /**
     * Callback for when the video starts playing.
     * @callback onVideoStart
     */
    public set onVideoStart(callback: any){
        this.videoEl.addEventListener("playing", callback, { once: true })
    }
    /**
     * Callback for when the video is paused.
     * @callback onPause
     */
    public set onPause(callback: any){
        this.videoEl.addEventListener("pause", ()=>{
            callback(this.byUser)
        }, false)
    }
    /**
     * Callback for when the video is played.
     * @callback onPlay
     */
    public set onPlay(callback: any){
        this.videoEl.addEventListener("play", ()=>{
            callback(this.byUser)
        }, false)
    }
    /**
     * Callback for when mute state changes.
     * @callback onMute
     * @param {boolean} isMuted - The current muted state of the video.
     */
    public set onMute(callback: any){
        this.videoEl.addEventListener("volumechange", ()=>{
            callback(this.videoEl.muted)
        }, false)
    }
    public set onSubtitleToggle(callback: any){
        this.onSubtitleChange = callback
    }


    public set onCanPlay(callback: any){
        this.videoEl.addEventListener("canplaythrough", ()=>{
            callback()
        }, false)
    }
    public set onWating(callback: any){
        this.videoEl.addEventListener("waiting", ()=>{
            callback()
        }, false)
    }
    //-----------------------Set Methods-----------------------
    /**
     * to set the current time of the video.
     * @param {number} pos - The position in the video to set, as a fraction of the total duration (0 to 1).
     * @example
     * player.currentTime = 0.5; // Sets the video to the halfway point
     * @memberof HLSPlayerComponent
     */
    public set currentTime(pos: number){
        this.videoEl.currentTime = pos * this.videoEl.duration;
    }
    public set setMute(flag: boolean){
        this.videoEl.muted = flag;
    }
    public set setSubtitles(flag: boolean){
        if (this.subtitle && this.subtitleWrapper){
            // Set the first track's mode based on the flag
            this.subtitleWrapper && this.subtitleWrapper.classList.toggle("hidden", !flag)
            this.isSubtitlesEnabled = flag
            this.onSubtitleChange(flag)
        }
    }
    //-----------------------Get Methods-----------------------
    /**
     * Gets the current time of the video.
     * @returns {number} The current time in seconds.
     * @memberof HLSPlayerComponent
     */
    public get currentTime(): number {
        return this.videoEl.currentTime;
    }
    /**
     * Gets the isPlaying state of the video.
     * @returns {boolean} The play/pause state
     * @memberof HLSPlayerComponent
     */
    public get isPlaying(): boolean {
        return !this.videoEl.paused && !this.videoEl.ended;
    }
    /**
     * Gets the muted state of the video.
     * @returns {boolean} The muted state
     * @memberof HLSPlayerComponent
     */
    public get isMuted(): boolean {
        return this.videoEl.muted;
    }
    public get isSubtitleAvailable(): boolean {
        return this.subtitle !== null;
    }
    public get isSubtitleActive(): boolean {
        return this.isSubtitlesEnabled;
    }
    //-----------------------Public Methods-----------------------
    public play(){
        if(this.videoEl.paused) {
            this.byUser = false
            this.videoEl.play()
        }
    }
    public pause(){
        if(!this.videoEl.paused) {
            this.byUser = false
            this.videoEl.pause()
        }
    }

    private hls!: HLS;
    private playerCssClass: string = "story-player"
    private media: string
    private videoId: string
    private container: HTMLElement
    private videoEl: HTMLVideoElement = null as any
    private subtitle: any = null
    private subtitleWrapper: HTMLParagraphElement = null as any
    private isSubtitlesEnabled: boolean = false
    private onSubtitleChange: any = () => {}
    private byUser: boolean = false
    /**
     * @constructor
     * @param {string} media url 
     * @param {string} videoId - The unique identifier for the video.
     * @param {HTMLElement} container - The HTML element where the video player will be rendered.
     * @param {any} subtitle - Optional subtitle object containing URL and language information.
     */
    constructor(media: string, videoId:string, container: HTMLElement, subtitle: any = null){
        this.media = media
        this.videoId = videoId
        this.container = container
        this.subtitle = subtitle
        this.createPlayer()
    }
    private async createPlayer(){
        this.videoEl = document.createElement("video")
        this.videoEl.classList.add(this.playerCssClass)

        this.videoEl.muted = true
        this.videoEl.playsInline = true
        this.videoEl.loop = true
        this.videoEl.defaultMuted = true;
        this.videoEl.preload = "metadata"
        this.videoEl.setAttribute("preload", "metadata")
        // this.videoEl.controls = true
        this.videoEl.setAttribute("tabIndex", "0")
        this.videoEl.setAttribute("x-webkit-airplay", "allow")
        this.videoEl.setAttribute("controlslist", "nofullscreen nodownload noremoteplayback")
        this.videoEl.setAttribute("disablepictureinpicture", "true")

        if(this.subtitle){
            const vttUrl = await toWebVTT(this.subtitle.url);
            if (!vttUrl) return
            const track = document.createElement("track")
            track.kind = "subtitles"
            track.label = this.subtitle.language_label || "French";
            track.srclang = this.subtitle.language || "fr";
            track.src = vttUrl;
            this.videoEl.appendChild(track)

            this.subtitleWrapper = document.createElement("div")
            this.subtitleWrapper.classList.add("track-container","hidden")
            this.container.appendChild(this.subtitleWrapper)
        }

        // Browser support check for native HLS
        if (HLS.isSupported()) {
            // Use hls.js for HLS playback
            this.setupHLSPlayer();
        }
        else if (this.videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            // Use native HLS support (Safari, iOS)
            this.videoEl.src = this.media;
        } else {
            console.error("HLS is not supported in this browser.");
            return;
        }

        this.container.appendChild(this.videoEl)

        this.addEvents()
    }
    private setupHLSPlayer() {
        const hls = this.hls = new HLS({
            maxBufferLength: 10,  // Try to buffer 10 seconds ahead
            maxMaxBufferLength: 20, // Never buffer more than 20 seconds)
        });
        hls.loadSource(this.media)
        hls.attachMedia(this.videoEl)

        // Handling fatal errors and attempting recovery
        let attemptedErrorRecovery:any = null
        this.videoEl.addEventListener('error', (event) =>{
            const mediaError = (event.currentTarget! as any).error;
            if (mediaError.code === mediaError.MEDIA_ERR_DECODE) {
                const now = Date.now();
                if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
                    attemptedErrorRecovery = now;
                    hls.recoverMediaError();
                }
            }
        });
        hls.on(HLS.Events.ERROR, (name, data) =>{
            // Special handling is only needed to errors flagged as `fatal`.
            if (data.fatal) {
                switch (data.type) {
                case HLS.ErrorTypes.MEDIA_ERROR: {
                    const now = Date.now();
                    if (!attemptedErrorRecovery || now - attemptedErrorRecovery > 5000) {
                        console.log('Fatal media error encountered (' + this.videoEl.error + + '), attempting to recover');
                        attemptedErrorRecovery = now;
                        hls.recoverMediaError();
                    } else {
                        console.log('Skipping media error recovery (only ' + (now - attemptedErrorRecovery) + 'ms since last error)');
                    }
                    break;
                }
                case HLS.ErrorTypes.NETWORK_ERROR:
                    console.error('fatal network error encountered', data);
                    break;
                default:
                    // cannot recover
                    hls.destroy();
                    break;
                }
            }
        });
    }
    private addEvents(){
        // play/pause on click
        this.videoEl.addEventListener("click", this.onclick.bind(this), false)
        document.addEventListener("keydown", (e) => {
            if (
                e.code === "Space" &&
                document.activeElement === this.videoEl
            ) {
                e.preventDefault()
                this.onclick()
            }
        });
        // to prevent right click context menu
        this.videoEl.addEventListener("contextmenu", (e) => {
            e.preventDefault()
        }, false)

        // to prevent default subtitles
        this.videoEl.addEventListener("play",() => {
            this.hideDefaultSubtitles()
        }, { once: true });

        // ------ Tracking Events ------
        this.videoEl.addEventListener("loadedmetadata", ()=>{
            EventPass("playerLoad", this.videoId, this.videoEl.duration)
            // Hide default subtitles if any
            this.hideDefaultSubtitles()
        }, false);
        this.videoEl.addEventListener("playing", (e) => {
            EventPass("videoStart", this.videoId)
        }, { once: true });
        this.videoEl.addEventListener("playing", (e) => {
            EventPass("videoPlaying", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false);
        this.videoEl.addEventListener("play", () => {
            this.hls && this.hls.startLoad()
            EventPass("videoPlay", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false);
        this.videoEl.addEventListener("pause", () => {
            this.hls && this.hls.stopLoad();
            EventPass("videoPause", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false);
        this.videoEl.addEventListener("seeking", (e) => {
            EventPass("videoSeeking", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false);
        this.videoEl.addEventListener("seeked", (e) => {
            EventPass("videoSeeked", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false);
        this.videoEl.addEventListener("waiting", ()=>{
            EventPass("videoBuffering", this.videoId, this.videoEl.duration, this.videoEl.currentTime)
        }, false)
        this.videoEl.addEventListener("ended", () => {
            EventPass("videoEnd", this.videoId)
        }, false);
        this.videoEl.addEventListener("error", (e) => {
            EventPass("videoError", this.videoId)
        }, false);
        // this is temporary Event for debugging
        this.videoEl.addEventListener("stalled", (e) => {
            EventPass("videoStalled", this.videoId)
        }, false);


        // on time update, update the track mode
        this.subtitle && this.videoEl.addEventListener("timeupdate", () => {
            const track = this.videoEl.textTracks[0];
            if (!track) return;
            track.mode = "hidden";
            const cues = track.activeCues;
            this.subtitleWrapper.innerHTML = "";
            if (cues && cues.length > 0) {
                this.subtitleWrapper.innerHTML = `<p>${(cues[0] as any).text}</p>`;
            }
        }, false);
    }
    private onclick(){
        this.byUser = true
        this.videoEl.paused ? this.videoEl.play() : this.videoEl.pause()
    }
    private hideDefaultSubtitles(){
        const track = this.videoEl.textTracks[0];
        if (!track) return;
        track.mode = "hidden";
    }
}