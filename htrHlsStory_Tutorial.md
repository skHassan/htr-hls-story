# Tutorial for Implementing htrHlsStory SDK for Vertical Video Story

htrHlsStory is a web SDK designed to create an inline carousel of vertical video thumbnails, complete with previews. When a thumbnail is clicked, it opens a fullscreen vertical video carousel. This SDK leverages the HTML video element as a player, utilizing [hls.js](https://github.com/video-dev/hls.js) to stream videos via their URLs. In the following sections, we will delve into how to effectively utilize the SDK and explore its various functionalities.

## Test Pages:
* <https://staging.dmvs-apac.com/htr-hls-story/lab/default.html>
* <https://staging.dmvs-apac.com/htr-hls-story/lab/outstream.html>
* <https://staging.dmvs-apac.com/htr-hls-story/lab/lazy_loading.html>

## Scripts:
* <https://staging.dmvs-apac.com/htr-hls-story/htr-hls-stories.js>
* <https://staging.dmvs-apac.com/htr-hls-story/htr-hls-stories.min.js>

## How to Use?

Follow the recommended steps below to implement the htrHlsStory script on your web page.

### 1. Add the `<div class="htr-hls-story"` to Your HTML Page

Insert a `div` with the class `htr-hls-story` into the section of your HTML page where you want to embed it.

```html
<div class="htr-hls-story" 
     playlistId="<PLAYLIST_ID>" 
     apiUrl="https://htr-playlists.professional-services.workers.dev/" 
     numOfVideos="10">
</div>
```

> **Note:** We have developed a custom API endpoint at `https://htr-playlists.professional-services.workers.dev/` in accordance with the guidelines provided here: <https://developers.dailymotion.com/guides/generate-stream-urls/#secured-stream-url>. This implementation is designed to protect your private API keys and secrets. Below are the details of the private API key in use.
> 
> #### Important: API Key (Do not delete this):
> * **Name:** htr Vertical Video API
> * **Account:** <https://www.dailymotion.com/cosmopolitan>
> * **Type:** Private
> 
> For any further inquiries, please reach out to <professional-services@dailymotion.com>.

### 2. Add the `htr-hls-stories.js` Script to Your HTML Page

Insert the htrHlsStory script into your HTML page, preferably after the `<div class="htr-hls-story"` or at the very bottom before the closing `body` tag.

```html
<script src="https://YOUR_PATH/htr-hls-stories.min.js"></script>
```

> **Note:** Change the script path from `https://YOUR_PATH/htr-hls-stories.min.js` to the URL where you have uploaded `htr-hls-stories.min.js` on your server.
> 
> You have two options for obtaining the script: you can either build it using GitHub (access will be provided) or download it directly from our staging site at <https://staging.dmvs-apac.com/htr-hls-story/htr-hls-stories.min.js> and then upload it to your server.

## Attributes of `<div class="htr-hls-story"`

| Attribute | Type | Description |
|-----------|------|-------------|
| playlistId `Mandatory` | string | Sets the playlist ID for htrHlsStory. |
| apiUrl `Mandatory` | URL | sets the API end point for getting video data |
| numOfVideos | number | Specifies the number of videos in the playlist. Default value: `10`. |
| data-vvs-id | string | Adds a reference ID for the `<div class="htr-hls-story"`. This helps customize the configuration of htrHlsStory at the page level, like Setting dataParams. |
| lazyLoad | boolean | To Set lazyLoad for htrHlsStory, follow the detailed instructions provided in the tutorial. |

## How to Add Dynamic Slides for Interstitial Ads?

The `htrHlsStory` script includes the `addDynamicSlide` option, similar to `dataParams`, which enables you to incorporate dynamic slides based on specific conditions. This feature is particularly useful for generating interstitial ads between video slides. Below are some examples:

### How to Add a Dynamic Slide After Two Slides:

```html
<script>
window.htrHlsStory = window.htrHlsStory || {};
window.htrHlsStory['dynamicStory'] = {
    // To add a dynamic slide
    addDynamicSlide: {
        // Per slide condition
        perSlide: 2,
        /**
         * @description : When a new slide is created
         * 
         * @param {HTMLElement} adContainer A HTMLElement object for ads
         */
        onCreate: (adContainer) => {},
        /**
         * @description : When a new slide is shown
         */
        onShow: (adContainer) => {}
    }
};
</script>
```

> **Note:** The `addDynamicSlide` can be configured with `perSlide` and callback functions:
> * `perSlide` (*type: number or function*): Sets the condition for adding a dynamic slide. In the example above, setting it to 2 will create a dynamic slide after every two slides.
> * `onCreate` (*type: function*): A callback function that triggers when dynamic slides are created. It provides `adContainer`, a HTMLElement object of the slide.
> * `onShow` (*type: function*): A callback function that triggers when dynamic slides are shown. It also provides `adContainer`, a HTMLElement object of the slide.

### How to Implement an Out-Stream Player with the Dailymotion player:

```html
<script>
window.htrHlsStory = window.htrHlsStory || {};
window.htrHlsStory['dynamicStory'] = {
    // To add a dynamic slide
    addDynamicSlide: {
        // Per slide condition
        perSlide: (slideNum) => {
            // Return true for slides 3, 8, 13, 18
            return [3, 8, 13, 18].includes(slideNum);
        },
        /**
         * @description : When a new slide is created
         * 
         * @param {HTMLElement} adContainer A HTMLElement object for ads
         */
        onCreate: (adContainer) => {
            interstitialSlide = adContainer;
            interstitialSlide.classList.add("htr-outstream");
            adContainer.innerHTML = `<div id="htr-outsream-player"></div><span class="loader">Loading Ad..</span>`;
            const loader = adContainer.querySelector("span.loader");
            
            dailymotion
                .createPlayer('htr-outsream-player', {
                    video: "x9j1kf4",
                    player: "x1apmu",
                    params: {
                        mute: window["htrHlsStoryMuted"] !== undefined ? window["htrHlsStoryMuted"] : true,
                    },
                })
                .then((player) => {
                    player.on(dailymotion.events.AD_START, () => {
                        loader.parentElement.removeChild(loader);
                        if (!adContainer.classList.contains("story-reel-active")) {
                            player.pause();
                        } else {
                            window.htrHlsStory['dynamicStory'].lockSlide(true);
                        }
                    });
                    
                    player.on(dailymotion.events.AD_END, () => {
                        console.log("player-AD_END");
                        onInterstitialOff(player);
                    });
                    
                    player.on(dailymotion.events.PLAYER_ERROR, () => {
                        console.log("player-error");
                        onInterstitialOff(player);
                    });
                    
                    player.on(dailymotion.events.VIDEO_START, () => {
                        console.log("player-VIDEO-start");
                        onInterstitialOff(player);
                    });
                    
                    player.on(dailymotion.events.PLAYER_VIEWABILITYCHANGE, (state) => {
                        state.playerIsViewable ? player.play() : player.pause();
                    });
                }).catch((e) => console.error(e));
        },
        /**
         * @description : When a new slide is shown
         */
        onShow: (adContainer) => {
        }
    }
};

function onInterstitialOff(player){
    const slide = player.getRootNode().closest(".story-reel-adslide")
    slide.parentElement.removeChild(slide);
    player.destroy();
    window.htrHlsStory['dynamicStory'].lockSlide(false)
}
</script>
```

> **Note:** In this example, we use `perSlide` as a function that defines the condition for creating dynamic slides. It takes the `slideNum` parameter to set up the condition. As shown, dynamic slides will be created for slides 3, 8, 13, and 18.
> 
> The `onCreate` function is utilized to create the Dailymotion player on the dynamic slide, which will display as an out-stream player. It is important to note that the out-stream player should always be set to play when first viewable, as per the Dailymotion Studio guidelines.

## Controlling the Close Button on htrHlsStory Ads

You can manage the visibility of the close button after an ad begins by using the `showCloseButtonOnAd` option. Below is an example to illustrate this functionality.

```html
<script>
window.htrHlsStory = window.htrHlsStory || {};
window.htrHlsStory['dynamicStory'] = {
    // to show close button after 5 seconds from ad start
    showCloseButtonOnAd : 5
};
</script>
```

## Set `lazyLoad` for htrHlsStory

When `lazyLoad` is set to `true`, the player components are not loaded immediately for all slides. Instead, a player is only initialized and loaded when its corresponding slide comes into view (e.g., when the user navigates to that slide). This approach improves performance by reducing initial load time and resource usage, as only the currently visible (or about-to-be-visible) player is loaded, while others remain unloaded until needed.

```html
<div class="htr-hls-story" 
     playlistId="<PLAYLIST_ID>" 
     apiUrl="https://htr-playlists.professional-services.workers.dev/" 
     numOfVideos="10"
     lazyLoad="true">
</div>
```

> **Recommendation: `lazyLoad=true`**
> 
> Browsers, such as Chrome, impose limits on the number of simultaneous TCP connections or downloads per origin, which can result in other requests becoming "stalled" when these limits are exceeded. Therefore, it is highly recommended to set `lazyLoad=true`. This configuration will restrict the loading of video assets to a maximum of three videos, thereby helping to manage the preloading of video assets and mitigate any stalling issues.

## Events

The `htrHlsStory` script also throws [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) on document related to player and video events.

![VVS Events](https://staging.dmvs-apac.com/VV-Hls-Story/EVENT%20FOR%20VVS.png)

Below is an example that illustrates how to add events.

```html
<script>
document.addEventListener("vvs-playerIsVisible", (e) => {
    console.log("player is visible for videoId:", e.detail.videoId);
});

document.addEventListener("vvs-playerIsHidden", (e) => {
    console.log("player is hidden for videoId:", e.detail.videoId);
});

document.addEventListener("vvs-playerLoad", (e) => {
    console.log("Player loaded for videoId:", e.detail.videoId, "with duration:", e.detail.duration);
});

document.addEventListener("vvs-videoStart", (e) => {
    console.log("Video started for videoId:", e.detail.videoId);
});

document.addEventListener("vvs-videoPlaying", (e) => {
    console.log("Video playing for videoId:", e.detail.videoId, "of duration:", e.detail.duration, "at current time:", e.detail.currentTime);
});

document.addEventListener("vvs-videoPlay", (e) => {
    console.log("Video played for videoId:", e.detail.videoId, "of duration:", e.detail.duration, "at current time:", e.detail.currentTime);
});

document.addEventListener("vvs-videoPause", (e) => {
    console.log("Video paused for videoId:", e.detail.videoId);
});

document.addEventListener("vvs-videoSeeking", (e) => {
    console.log("Video seeking for videoId:", e.detail.videoId, "of duration:", e.detail.duration, "at current time:", e.detail.currentTime);
});

document.addEventListener("vvs-videoSeeked", (e) => {
    console.log("Video seeked for videoId:", e.detail.videoId, "of duration:", e.detail.duration, "at current time:", e.detail.currentTime);
});

document.addEventListener("vvs-videoBuffering", (e) => {
    console.log("Video buffering for videoId:", e.detail.videoId, "of duration:", e.detail.duration, "at current time:", e.detail.currentTime);
});

document.addEventListener("vvs-videoEnd", (e) => {
    console.log("Video ended for videoId:", e.detail.videoId);
});

document.addEventListener("vvs-videoError", (e) => {
    console.error("Video error for videoId:", e.detail.videoId);
});
</script>
```

### Events:

| Event Name | Parameters in `e.detail` | Type |
|------------|--------------------------|------|
| `vvs-playerIsVisible` | videoId | *string* |
| `vvs-playerIsHidden` | videoId | *string* |
| `vvs-playerLoad` | videoId, duration | *string, number* |
| `vvs-videoStart` | videoId | *string* |
| `vvs-videoPlaying` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoPlay` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoPause` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoSeeking` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoSeeked` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoBuffering` | videoId, duration, currentTime | *string, number, number* |
| `vvs-videoEnd` | videoId | *string* |
| `vvs-videoError` | videoId | *string* |

## How to Change Style?

We offer a set of global CSS variables within the `.htr-hls-story` selector, as outlined below:

```css
.htr-hls-story {
    --htrhs-highlight-font: 'Arial Black', sans-serif;
    --htrhs-normal-font: Arial, sans-serif;
    --htrhs-pop-highlight-clr: #ff6b35;
    --htrhs-pop-bg: #000;
    --htrhs-pop-clr: #fff;
    --htrhs-card-color: #fff;
    --htrhs-card-background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
    --htrhs-card-bg-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    --htrhs-card-text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8);
    --htrhs-tag-bg: rgba(255, 255, 255, 0.2);
    --htrhs-tag-color: #fff;
    --htrhs-tag-radius: 4px;
    --htrhs-inside-tag-bg: rgba(0, 0, 0, 0.6);
    --htrhs-inside-tag-color: #fff;
    --htrhs-card-height: 200px;
}
```

Feel free to modify these variables to suit your design preferences:

* `--htrhs-highlight-font`: Sets the font family for highlighted text elements.
* `--htrhs-normal-font`: Sets the font family for regular text elements.
* `--htrhs-pop-highlight-clr`: Defines the highlight color used in pop-up elements.
* `--htrhs-pop-bg`: Sets the background color for pop-up elements.
* `--htrhs-pop-clr`: Sets the text color for pop-up elements.
* `--htrhs-card-color`: Sets the text color for story cards.
* `--htrhs-card-background`: Sets the background for story cards.
* `--htrhs-card-bg-shadow`: Sets the background shadow effect for story cards.
* `--htrhs-card-text-shadow`: Sets the text shadow for story cards.
* `--htrhs-tag-bg`: Sets the background color for tags.
* `--htrhs-tag-color`: Sets the text color for tags.
* `--htrhs-tag-radius`: Sets the border radius for tags.
* `--htrhs-inside-tag-bg`: Sets the background color for inside tags.
* `--htrhs-inside-tag-color`: Sets the text color for inside tags.
* `--htrhs-card-height`: Sets the default height for story cards.

## Global Accessible Variables

* `htrHlsStoryMuted`: This variable controls the global mute setting (`true/false`) for all players in htrHlsStory.
* `htrHlsStorySubtitle`: This variable manages the global subtitle setting (`true/false`) for all players in htrHlsStory.
