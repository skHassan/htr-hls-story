
/**
 * @description : to load js library ( default widget library/ preview library)
 * @param {string} url : library js file link
 * @returns {promise<number>} : resolve when loaded
 */
export async function loadJSLib( 
  url:string = "https://statics.dmcdn.net/k/widget.min.js",
  libName:string = "DM_VideoPreview"): Promise<number> {

  return new Promise( async (resolve,reject) => {
      const script = document.createElement('script')
      script.src = url
      document.body.appendChild(script)
      script.onload = ()=> resolve(0)
  })
}
/**
 * @description Get a human-readable or machine-readable date string
 * @param {number} created_time - Time in seconds since epoch
 * @param {'relative' | 'datetime'} [format='relative'] - Output format
 * @returns {string}
 */
export function getDateString(
  created_time: number,
  format: 'relative' | 'datetime' = 'relative'
): string {
  const created = new Date(created_time * 1000);

  if (format === 'datetime') {
    return created.toISOString();
  }

  const dif = Date.now() - created.getTime();

  if (dif < 60_000) {
    return Math.floor(dif / 1_000) + ' seconds ago';
  } else if (dif < 3_600_000) {
    return Math.floor(dif / 60_000) + ' minutes ago';
  } else if (dif < 86_400_000) {
    return Math.floor(dif / 3_600_000) + ' hours ago';
  } else {
    const strArr = created.toUTCString().split(' ');
    return strArr[1] + ' ' + strArr[2] + ', ' + strArr[3];
  }
}


/**
 * @description to get filter params
 * @param {HTMLElement} container html dom
 * @returns filterParams
 */
export function getParams(container: HTMLElement): any {
  const refId = container.getAttribute('data-vvs-id')
  const settings = refId && (window as any)["htrHlsStory"] && (window as any)["htrHlsStory"][refId]|| {}
  settings.addDynamicSlide && (settings.refId = refId)
  return {
    playlistId: container.getAttribute('playlistId')? container.getAttribute('playlistId'): "",
    apiUrl: container.getAttribute('apiUrl')? container.getAttribute('apiUrl'): "",
    numOfVideos: container.getAttribute('numOfVideos')? container.getAttribute('numOfVideos'):  "10",
    lazyLoad: container.getAttribute('lazyLoad')? container.getAttribute('lazyLoad'): "false",
    ...settings
  }
}


export function popMessage(msg: string, container: HTMLElement){
  const popContainer = document.createElement("div")
  popContainer.classList.add("vvs-pop-msg")
  popContainer.innerHTML = `<div class="vvs-pop-line"></div>
  <div class="vvs-pop-text">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M12 3.5C7.03875 3.5 3 7.53875 3 12.5C3 17.4613 7.03875 21.5 12 21.5C16.9613 21.5 21 17.4613 21 12.5C21 7.53875 16.9613 3.5 12 3.5ZM16.2787 10.7787L11.4037 15.6537C11.2575 15.8 11.0662 15.875 10.875 15.875C10.6838 15.875 10.4925 15.8 10.3463 15.6537L7.72125 13.0287C7.42875 12.7362 7.42875 12.26 7.72125 11.9675C8.01375 11.675 8.49 11.675 8.7825 11.9675L10.8787 14.0637L15.225 9.7175C15.5175 9.425 15.9938 9.425 16.2863 9.7175C16.5787 10.01 16.5787 10.4862 16.2863 10.7787H16.2787Z" fill="var(--htrhs-pop-highlight-clr)"/>
    </svg>
    <span>${msg}</span>
  </div>
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path d="M11.1498 10.5L15.5748 6.07505C15.8873 5.76255 15.8873 5.23755 15.5748 4.92505C15.2623 4.61255 14.7373 4.61255 14.4248 4.92505L9.9998 9.35005L5.5748 4.92505C5.2623 4.61255 4.7373 4.61255 4.4248 4.92505C4.1123 5.23755 4.1123 5.76255 4.4248 6.07505L8.8498 10.5L4.4248 14.925C4.1123 15.2375 4.1123 15.7625 4.4248 16.075C4.5873 16.2375 4.7873 16.3125 4.9998 16.3125C5.2123 16.3125 5.4123 16.2375 5.5748 16.075L9.9998 11.65L14.4248 16.075C14.5873 16.2375 14.7873 16.3125 14.9998 16.3125C15.2123 16.3125 15.4123 16.2375 15.5748 16.075C15.8873 15.7625 15.8873 15.2375 15.5748 14.925L11.1498 10.5Z" fill="#606060"/>
    </svg>
  </button>`
  container.appendChild(popContainer)

  // auto remove
  const timer = setTimeout(()=>{
    container.removeChild(popContainer)
  },2000)
  popContainer.querySelector("button")?.addEventListener("click",()=>{
    clearTimeout(timer)
    container.removeChild(popContainer)
  })
}


