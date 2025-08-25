
/**
 * @description to get left svg icons
 * @returns string
 */
export function leftIcon(target: any, memberName: string):void {
  Object.defineProperty(target, memberName, { 
      get: () => `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
        <circle cx="27" cy="23" r="17" transform="rotate(-180 27 23)" fill="white" stroke="white" stroke-width="4"/>
        <g filter="url(#filter0_dd_169_3479)">
          <circle class="inner-circle" cx="27" cy="23" r="15" transform="rotate(-180 27 23)" fill="white"/>
        </g>
        <path d="M28.875 27.6875L23.25 23L28.875 18" stroke="#0D0D0D" stroke-width="1.36364" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <filter id="filter0_dd_169_3479" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="6"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0.16 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_169_3479"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_169_3479" result="effect2_dropShadow_169_3479"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_169_3479" result="shape"/>
          </filter>
        </defs>
      </svg>`
  }); 
}
/**
 * @description to get right svg icons
 * @returns string
 */
export function rightIcon(target: any, memberName: string):void  {
  Object.defineProperty(target, memberName, { 
    get: () => `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
        <circle cx="27" cy="23" r="17" fill="white" stroke="white" stroke-width="4"/>
        <g filter="url(#filter0_dd_169_3704)">
          <circle class="inner-circle" cx="27" cy="23" r="15" fill="white"/>
        </g>
        <path d="M25.125 18.3125L30.75 23L25.125 28" stroke="#0D0D0D" stroke-width="1.36364" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <filter id="filter0_dd_169_3704" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="6"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0.16 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_169_3704"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="effect1_dropShadow_169_3704" result="effect2_dropShadow_169_3704"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_169_3704" result="shape"/>
          </filter>
        </defs>
      </svg>`
  }); 
}