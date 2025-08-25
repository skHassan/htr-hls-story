
let translations: { [key: string]: string } = {
  
  //-------- Inline carousel texts
  video_shorts: "Shorts vidéo",
  prev: "Précédent",
  next: "Suivant",
  //-------- Inline card texts
  preview_label: "Aperçu",
  play_fullscreen_label: "Lire en plein écran",

  //-------- Full page component texts
  fullpage_label : "Carrousel vidéo vertical en plein écran",
  fullpage_prev: "Diapositive précédente",
  fullpage_next: "Diapositive suivante",
  fullpage_close: "Fermer le carrousel vidéo vertical en plein écran",

  //-------- Player component texts
  shorts_text: "Shorts",
  play_label: "Lire la vidéo",
  pause_label: "Mettre la vidéo en pause",
  subtitles_not_available: "Sous-titres non disponibles",
  subtitles_available: "Sous-titres disponibles",
  subtitle_off_label: "Désactiver les sous-titres",
  subtitle_on_label: "Activer les sous-titres",
  subtitles_text: "ST",
  unmute_label: "Activer le son de la vidéo",
  mute_label: "Couper le son de la vidéo",
  sound_text: "Son",
  share_label: "Partager la vidéo",
  share_text: "Partager",
  share_copy_text: "Lien copié"
}
  

// This function should be called ONCE at app startup (in VideoStoryManager)
export function setCustomTranslations(container: HTMLElement) {
  const refId = container.getAttribute('data-vvs-id')
  const customT = refId 
                  && (window as any)["htrHlsStory"] 
                  && (window as any)["htrHlsStory"][refId]
                  && (window as any)["htrHlsStory"][refId].translations
                  || {}
  translations = {...translations, ...customT}
}

export function t(key: string): string {
  return translations[key] || key
}