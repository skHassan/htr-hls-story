/* Main class for managing all componenets */

import '../Styles/htrHlsStory.scss'

// importing other requirements
import ApiHelper from '../Libraries/ApiHelper'
import { getParams } from '../Libraries/MiscHelper'
import { t, setCustomTranslations } from '../Libraries/translations'
// importing components
import InlineComponent from '../Components/InlineComponent/InlineComponent'
import FullPageComponent from '../Components/FullPageComponent/FullPageComponent'

export default class htrHlsStoryManager {

  private params: any = null
  private container: HTMLElement
  constructor(container: HTMLElement) {
    this.container = container
    this.params = getParams(this.container)
    if(!this.params.playlistId){
      console.error(t("playlistId is required for htrHlsStoryManager"))
      return
    }
    if(!this.params.apiUrl){
      console.error(t("apiUrl is required for htrHlsStoryManager"))
      return
    }
    setCustomTranslations(this.container)
    this.start()
  }
  private async start(){

    let videosInfo = await this.getVideos()
    if (videosInfo.list && videosInfo.list.length > 0) {
      this.drawSkeletonHtml()
      this.observer()
      this.renderComponents(videosInfo.list)
    }
  }
  private async getVideos(apiPageNum = 1){
    let videosInfo = await ApiHelper.fetchVideosByPlaylist(this.params.apiUrl, this.params.playlistId, this.params.numOfVideos)
    return videosInfo
  }
  private drawSkeletonHtml(){
    this.container.innerHTML = `
      <div class="video-story-inline-wrapper" role="region" aria-label="Horizontal video story carousel" aria-hidden="false"></div>
      <div class="video-stroy-fullpage-wrapper" aria-hidden="true" aria-modal="true" role="dialog" tabindex="0"></div>
    `;
  }
  private renderComponents(videos: any[]) {
    const inlineWrapper = this.container.querySelector(".video-story-inline-wrapper") as HTMLElement
    const inlineComponent = new InlineComponent(
      inlineWrapper,
      videos,
      this.container.classList.contains("container-small") ? true : false,
    )
    
    const fullPageComponent = new FullPageComponent(
      this.container.querySelector(".video-stroy-fullpage-wrapper") as HTMLElement,
      videos,
      this.params.lazyLoad === "true" ? true : false,
      this.params.showCloseButtonOnAd,
      this.params.dataParams,
      this.params.callToAction,
      this.params.addDynamicSlide,
      this.params.addDynamicSlide && this.params.refId
    )
    fullPageComponent.onOpen = () => {
      inlineWrapper.setAttribute("aria-hidden", "true")
      inlineComponent.setActive(false)
      inlineComponent.stopPreview()
    }
    fullPageComponent.onClose = () => {
      inlineWrapper.setAttribute("aria-hidden", "false")
      inlineComponent.setActive(true)
      inlineComponent.startPreview()
    }
    inlineComponent.onCardClick = (index: number = 0) => {
      fullPageComponent.open(index)
    }
  }

  /**
   * @description To observer size of container 
   * to check mobile view
   */
  private observer(){
    let containerWidth:any = 0
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry)=>{
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          containerWidth = Array.isArray(entry.contentBoxSize)
              ? entry.contentBoxSize[0].inlineSize
              : (entry.contentBoxSize as any)['inlineSize']
        }else {
          containerWidth = entry.contentRect.width
        }
        this.addWidthClass(containerWidth)
      })
    });
    // observer the container
    resizeObserver.observe(document.body)
    // trigger first round
    this.addWidthClass(document.body.getBoundingClientRect().width)
  }
  /**
   * @description To add class for mobile view
   */
  private addWidthClass(containerWidth: number) {
    if(containerWidth <= 600){
        this.container.classList.add('container-small')
    }else{
        this.container.classList.remove('container-small')
    }
  }
}
