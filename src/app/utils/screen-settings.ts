interface FullscreenDocument extends Document {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}

interface FullscreenElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}

export function isFullScreen(): boolean {
  const fsDoc = <FullscreenDocument>document;
  return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement || fsDoc.msFullscreenElement);
}

export function setFullScreen(full: boolean): void {
  if (full !== isFullScreen()) toggleFullScreen();
}

export function toggleFullScreen(): void {
  const fsDoc = <FullscreenDocument>document;
  if (!isFullScreen()) {
    const fsDocElem = <FullscreenElement>document.documentElement;
    if (fsDocElem.requestFullscreen) {
      fsDocElem.requestFullscreen();
    } else if (fsDocElem.msRequestFullscreen) {
      fsDocElem.msRequestFullscreen();
    } else if (fsDocElem.mozRequestFullScreen) {
      fsDocElem.mozRequestFullScreen();
    }
  } else if (fsDoc.exitFullscreen) {
    fsDoc.exitFullscreen();
  } else if (fsDoc.msExitFullscreen) {
    fsDoc.msExitFullscreen();
  } else if (fsDoc.mozCancelFullScreen) {
    fsDoc.mozCancelFullScreen();
  }
}
