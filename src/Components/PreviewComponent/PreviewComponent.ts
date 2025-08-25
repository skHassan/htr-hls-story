
import {loadJSLib} from '../../Libraries/MiscHelper'

// decalre variable
declare var DM_VideoPreview: any

/* preview VideoStory component */
import './PreviewComponent.scss'
export default class PreviewComponent{

    public onPreview(card:HTMLElement){
        if(this.isViewable(card)){
            this.removeOldPreview()
            this.startPreview(card)
        }
    }
    public startPreview(card?: HTMLElement) {
        // Stop any running preview first
        this.stopPreview()
        this.activePreview = true
        card && (this.currentSlide = card)

        this.previewInterval = window.setInterval(
            this.previewUpdate.bind(this),
            7000
        );
        this.showPreview()
    }
    public stopPreview() {
        clearInterval(this.previewInterval)
        this.removeOldPreview()
        this.activePreview = false
    }
    
    private container: HTMLElement
    private list:any
    private isGrid:boolean
    private previewInterval: any
    private currentSlide!: HTMLElement
    private firstIndex: number = 0
    private totalView: number = 3
    private activePreview: boolean = false

    constructor(container: HTMLElement, list: any, isGrid=false){
        this.container= container
        this.list = list
        this.isGrid = isGrid
        this.init()
    }
    /**
     * @description initalize preview library script and start preveiw
     */
    private async init(): Promise<void>{
        this.currentSlide = this.container.firstElementChild as HTMLElement

        // if (this.isGrid) {
        //     this.totalView = this.list.length
        // } else {// total viewable slide
        //     this.totalView = this.getVisibleCardComponent()

        //     if (this.totalView > this.list.length) this.totalView = this.list.length
        // }

        // load js library and then start preview
        await loadJSLib()

        
    }
    private previewUpdate(){
        this.removeOldPreview()
        // if next slide is viewable
        if(this.isViewable(this.currentSlide.nextElementSibling as HTMLElement)){
            this.currentSlide = this.currentSlide.nextElementSibling as HTMLElement
        }else{

            while (this.currentSlide.previousElementSibling && 
                this.isViewable(this.currentSlide.previousElementSibling as HTMLElement)){
                this.currentSlide = this.currentSlide.previousElementSibling as HTMLElement
            }
        }
        this.showPreview()
    }
    /**
     * @description to remove old events
     */
    private removeOldPreview(){
        // if preview is active
        if(this.activePreview){
            // remove preview class
            this.currentSlide.classList.remove("preview-running")
            //create new container for preview
            const prevDiv = document.createElement("div")
            prevDiv.classList.add("story-preview")
            // clean up html
            this.currentSlide.querySelector(".story-preview-wrapper")!.replaceChild(
                prevDiv,
                this.currentSlide.querySelector(".story-preview")!
            )
        }
    }

    private showPreview(){
        if(typeof DM_VideoPreview == "undefined") return
        DM_VideoPreview(
            this.currentSlide.querySelector(".story-preview"),
            this.currentSlide.getAttribute("data-video"),
            { 
                title:'none', duration:'none', mode:'video', trigger:'auto' 
            }
        )
        this.currentSlide.classList.add("preview-running")
    }

    private isViewable(card: HTMLElement) {
        const containerRect = this.container.parentElement!.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const visibleWidth = Math.min(cardRect.right, containerRect.right) - Math.max(cardRect.left, containerRect.left);
        const cardWidth = cardRect.width;

        return visibleWidth > 0 && (visibleWidth / cardWidth) >= 0.9;
    }
}