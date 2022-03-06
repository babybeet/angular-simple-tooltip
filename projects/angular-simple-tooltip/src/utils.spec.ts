import { fakeAsync, tick } from '@angular/core/testing';

import { isMobile, watchForLongPress } from './utils';

describe('utils', () => {
  describe('#isMobile', () => {
    const originalNavigator = navigator;

    afterEach(() => {
      Object.defineProperty(window, 'navigator', {
        get() {
          return originalNavigator;
        }
      });
    });

    it('1. should return false for a Macbook Pro laptop', () => {
      setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');
      expect(isMobile()).toBe(false);
    });

    it('2. should return true for a Moto G4 device', () => {
      setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36');
      expect(isMobile()).toBe(true);
    });

    it('3. should return true for an iPhone5s/SE device', () => {
      setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1');
      expect(isMobile()).toBe(true);
    });

    it('4. should return true for an iPad pro device', () => {
      setUserAgent('Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1');
      expect(isMobile()).toBe(true);
    });

    function setUserAgent(userAgent: string) {
      Object.defineProperty(window, 'navigator', {
        get() {
          return {
            userAgent
          }
        }
      });
    }

  });

  describe('#watchForLongPress', () => {

    it('1. should emit after pressing on target for 500ms or longer', fakeAsync(() => {
      const target = document.createElement('button');
      const longPressListenerSpy = jasmine.createSpy('longPressListenerSpy');
      watchForLongPress(target).subscribe({
        next: longPressListenerSpy
      });
      target.dispatchEvent(new Event('pointerdown'));
      tick(600);
      target.dispatchEvent(new Event('pointerup'));
      expect(longPressListenerSpy).toHaveBeenCalledTimes(1);
    }));

    it('2. should not emit if pressing on target for less than 500ms', fakeAsync(() => {
      const target = document.createElement('button');
      const longPressListenerSpy = jasmine.createSpy('longPressListenerSpy');
      watchForLongPress(target).subscribe({
        next: longPressListenerSpy
      });
      target.dispatchEvent(new Event('pointerdown'));
      tick(300);
      window.dispatchEvent(new PointerEvent('pointerup'));
      expect(longPressListenerSpy).toHaveBeenCalledTimes(0);
    }));

  });

});