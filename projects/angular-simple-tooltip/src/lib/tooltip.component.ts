import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  AfterViewInit,
  Host
} from '@angular/core';

@Component({
  selector: 'kun-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'kun-tooltip-container'
  }
})
export class TooltipComponent implements AfterViewInit {

  @Input()
  content = '';

  @Input()
  placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom';

  /**
   * @private To be used by template
   */
  _isActive = false;

  /**
   * @private To be used by template
   */
  _idForAriaDescribedBy = `__${btoa(String(Math.random() + Math.random())).substring(5, 15).toLowerCase()}__`;

  /**
   * The DOM element representing this tooltip
   */
  private _tooltip: HTMLDivElement;

  /**
   * The callback to run after this tooltip is closed
   */
  private _afterClosed?: () => void;

  /**
   * Width of the tooltip
   */
  private _width = 0;

  /**
   * Height of the tooltip
   */
  private _height = 0;

  constructor(@Host() private readonly _host: ElementRef<HTMLDivElement>) {
  }

  ngAfterViewInit() {
    if (!['top', 'right', 'bottom', 'left'].includes(this.placement)) {
      throw new Error('Invalid tooltip placement: ' + this.placement);
    }
    this._tooltip = this._host.nativeElement.firstElementChild as HTMLDivElement;

    const tooltipRect = this._tooltip.getBoundingClientRect();
    this._width = tooltipRect.width;
    this._height = tooltipRect.height;
  }

  hide() {
    this._isActive = false;
  }

  /**
   * Execute the provide callback after this tooltip is hidden
   *
   * @param fn
   */
  runAfterClosed(fn: () => void) {
    this._afterClosed = fn;
  }

  /**
   * Show a tooltip at the `anchor` element
   *
   * @param anchor
   */
  show(anchor: HTMLElement | SVGElement) {
    this._isActive = true;
    anchor.setAttribute('aria-describedby', this._idForAriaDescribedBy);
    switch (this.placement) {
      case 'top':
        this._showTop(anchor.getBoundingClientRect());
        break;
      case 'right':
        this._showRight(anchor.getBoundingClientRect());
        break;
      case 'bottom':
        this._showBottom(anchor.getBoundingClientRect());
        break;
      case 'left':
        this._showLeft(anchor.getBoundingClientRect());
        break;
    }
  }

  /**
   * Show a tooltip at the spefified x/y location
   *
   * @param x
   * @param y
   */
  showAt(x: number, y: number) {
    this._isActive = true;
    const anchorBoundingBox = {
      left: x,
      top: y,
      width: 0,
      height: 0
    };
    switch (this.placement) {
      case 'top':
        this._showTop(anchorBoundingBox);
        break;
      case 'right':
        this._showRight(anchorBoundingBox);
        break;
      case 'bottom':
        this._showBottom(anchorBoundingBox);
        break;
      case 'left':
        this._showLeft(anchorBoundingBox);
        break;
    }
  }

  /**
   *
   * @private Used in template, so can't have `private` keyword
   */
  _onLeave() {
    if (!this._isActive && this._afterClosed) {
      this._afterClosed();
    }
  }

  private _showTop(anchorBoundingBox: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>) {
    setTimeout(() => {
      const left = anchorBoundingBox.left + (anchorBoundingBox.width - this._width) / 2;
      let top = anchorBoundingBox.top - this._height - 10;
      if (top < 0) {
        this._tooltip.classList.remove('top');
        this._tooltip.classList.add('bottom');
        top = top + anchorBoundingBox.height + this._height + 20;
      }
      if (!this._shiftTooltipIntoViewFromRight(left)) {
        this._shiftTooltipIntoViewFromLeft(left);
      }
      this._tooltip.style.left = left + 'px';
      this._tooltip.style.top = top + 'px';
    }, 0);
  }

  /**
   * Returns true if tooltip overflows the right edge of the screen, false otherwise
   */
  private _shiftTooltipIntoViewFromRight(left: number) {
    const difference = left + this._width - window.innerWidth + 5;
    if (difference > 5) {
      this._tooltip.style.transform = `translateX(-${difference}px)`;
      this._tooltip.querySelector<HTMLElement>('.kun-tooltip__arrow').style.left = `calc(50% + ${difference}px)`;
      return true;
    }
    return false;
  }

  /**
   *
   * Returns true if tooltip overflows the left edge of the screen, false otherwise
   */
  private _shiftTooltipIntoViewFromLeft(left: number) {
    if (left < 0) {
      left = Math.abs(left) + 5;
      this._tooltip.style.transform = `translateX(${left}px)`;
      this._tooltip.querySelector<HTMLElement>('.kun-tooltip__arrow').style.left = `calc(50% - ${left}px)`;
      return true;
    }
    return false;
  }

  private _showBottom(anchorBoundingBox: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>) {
    setTimeout(() => {
      const left = anchorBoundingBox.left + (anchorBoundingBox.width - this._width) / 2;
      let top = anchorBoundingBox.top + anchorBoundingBox.height + 10;
      if (top + this._height + 10 > window.innerHeight) {
        this._tooltip.classList.remove('bottom');
        this._tooltip.classList.add('top');
        top = top - anchorBoundingBox.height - this._height - 20;
      }
      if (!this._shiftTooltipIntoViewFromRight(left)) {
        this._shiftTooltipIntoViewFromLeft(left);
      }
      this._tooltip.style.left = left + 'px';
      this._tooltip.style.top = top + 'px';
    }, 0);
  }

  private _showRight(anchorBoundingBox: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>) {
    setTimeout(() => {
      let left = anchorBoundingBox.left + anchorBoundingBox.width + 10;
      const top = anchorBoundingBox.top + (anchorBoundingBox.height - this._height) / 2;
      if (left + this._width > window.innerWidth) {
        this._tooltip.classList.remove('right');
        this._tooltip.classList.add('left');
        left = left - anchorBoundingBox.width - this._width - 20;
      }
      if (!this._shiftTooltipIntoViewFromBottom(top)) {
        this._shiftTooltipIntoViewFromTop(top);
      }
      this._tooltip.style.left = left + 'px';
      this._tooltip.style.top = top + 'px';
    }, 0);
  }

  /**
   *
   * @param top Top edge value of the tooltip
   * @returns `true` if tooltip overflows the bottom edge of the screen, `false` otherwise
   */
  private _shiftTooltipIntoViewFromBottom(top: number) {
    const difference = top + this._height - window.innerHeight + 5;
    if (difference > 5) {
      this._tooltip.style.transform = `translateY(-${difference}px)`;
      this._tooltip.querySelector<HTMLElement>('.kun-tooltip__arrow').style.top = `calc(50% + ${difference}px)`;
      return true;
    }
    return false;
  }

  /**
   *
   * @param top Top edge value of the tooltip
   * @returns `true` if tooltip overflows the bottom top of the screen, `false` otherwise
   */
  private _shiftTooltipIntoViewFromTop(top: number) {
    if (top < 0) {
      top = Math.abs(top) + 5;
      this._tooltip.style.transform = `translateY(${top}px)`;
      this._tooltip.querySelector<HTMLElement>('.kun-tooltip__arrow').style.top = `calc(50% - ${top}px)`;
      return true;
    }
    return false;
  }

  private _showLeft(anchorBoundingBox: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>) {
    /**
     * Wrap this in a `setTimeout` because tooltip is animated, so by the time `getBoundingClientRect()`
     * is called, tooltip component might not be visible yet, so it can't calculate tooltip's client rect
     */
    setTimeout(() => {
      let left = anchorBoundingBox.left - this._width - 10;
      const top = anchorBoundingBox.top + (anchorBoundingBox.height - this._height) / 2;
      if (left < 0) {
        this._tooltip.classList.remove('left');
        this._tooltip.classList.add('right');
        left = left + anchorBoundingBox.width + this._width + 20;
      }
      if (!this._shiftTooltipIntoViewFromBottom(top)) {
        this._shiftTooltipIntoViewFromTop(top);
      }
      this._tooltip.style.left = left + 'px';
      this._tooltip.style.top = top + 'px';
    }, 0);
  }

}
