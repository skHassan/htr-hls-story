
import { getDateString } from '../../Libraries/MiscHelper'
import { t } from '../../Libraries/translations'

// import component scss
import "./CardComponent.scss"

export default class CardComponent{
    /**
     * @constructor
     */
    constructor(){}
    /**
     * @description to create Li slide
     * @param {ICard} videoObj 
     * @returns {HTMLElement} it return li DOM
     */
    public getCard(videoObj: any): HTMLElement{
        const card = document.createElement('li');
        card.classList.add("story-card-slide", "daily-carousel-slide")
        card.setAttribute("data-video", videoObj.id) 

        card.innerHTML = `
            <button class="story-card-btn" aria-label="${t('preview_label')}: ${videoObj.title}. ${t('play_fullscreen_label')}" title="${t('preview_label')}: ${videoObj.title}. ${t('play_fullscreen_label')}">
                <img src="${videoObj.thumbnail_480_url}" alt="${videoObj.title}" />
                <div class="story-preview-wrapper">
                    <div class="story-preview"></div>
                </div>
                <div class="story-card-overlay">
                    <span class="story-card-top-info">${videoObj.channel}</span>
                    <div class="story-card-bottom-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none">
                            <circle cx="17" cy="17" r="15" fill="black" fill-opacity="0.3"/>
                            <path d="M23.8794 16.2169L14.1241 9.46321C13.4925 9.02592 12.6296 9.478 12.6296 10.2462V23.7536C12.6296 24.5219 13.4925 24.974 14.1241 24.5367L23.8794 17.783C24.4265 17.4043 24.4265 16.5956 23.8794 16.2169Z" fill="currentColor"/>
                        </svg>
                        <h5>${videoObj.title}</h5>
                        <time class="story-card-video-created" datetime="${getDateString(videoObj.created_time, "datetime")}">${getDateString(videoObj.created_time)}</time>
                    </div>
                </div>
            </button>`;

        return card
    }
}