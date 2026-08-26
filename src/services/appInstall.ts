const DISMISSED_KEY="rotinaleve-install-dismissed";
let deferredPrompt:BeforeInstallPromptEvent|null=null;
export function initInstallPrompt(){window.addEventListener("beforeinstallprompt",(event)=>{event.preventDefault();deferredPrompt=event as BeforeInstallPromptEvent;window.dispatchEvent(new Event("rotinaleve-install-available"));});}
export function canInstall(){return Boolean(deferredPrompt)&&localStorage.getItem(DISMISSED_KEY)!=="1";}
export async function installApp(){if(!deferredPrompt)return false;await deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;deferredPrompt=null;return choice.outcome==="accepted";}
export function dismissInstall(){localStorage.setItem(DISMISSED_KEY,"1");window.dispatchEvent(new Event("rotinaleve-install-dismissed"));}
export function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches||((window.navigator as Navigator&{standalone?:boolean}).standalone===true);}
export type BeforeInstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
