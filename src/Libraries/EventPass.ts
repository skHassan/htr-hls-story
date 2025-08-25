
export default function EventPass(eventName: string, videoId: string, duration?: number, currentTime?:number): void {
    const event = new CustomEvent("vvs-"+eventName, {
        detail: { 
            videoId, 
            ...duration&&{duration},
            ...currentTime&&{currentTime}
        }
    });
    document.dispatchEvent(event);
}