import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function isMobile() {
  return /iPhone|iPad|Android/i.test(navigator.userAgent);
}

export function watchForLongPress(target: HTMLElement) {
  let timeoutId: number;
  const notifier = new Subject<PointerEvent>();
  const pointerdown = (event: PointerEvent) => {
    timeoutId = window.setTimeout(() => notifier.next(event), 500);
  };
  const pointerup = () => {
    window.clearTimeout(timeoutId);
  };

  target.addEventListener('pointerdown', pointerdown, false);
  window.addEventListener('pointerup', pointerup, false);

  target.oncontextmenu = event => {
    event.preventDefault();
  };

  return notifier.pipe(finalize(() => {
    target.removeEventListener('pointerdown', pointerdown, false);
    window.removeEventListener('pointerup', pointerup, false);
  }));
}
