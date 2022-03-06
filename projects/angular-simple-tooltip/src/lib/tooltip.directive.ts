import { Directive, Input, HostListener, OnDestroy, Host, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TooltipService } from './tooltip.service';
import { isMobile, watchForLongPress } from '../utils';

@Directive({
  selector: '[kunTooltip]'
})
export class TooltipDirective implements OnDestroy, AfterViewInit {

  @Input('kunTooltip')
  content = '';

  @Input('kunTooltipPlacement')
  placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom';

  private _timer: number;
  private _longPressEventSubscription: Subscription;

  constructor(
    @Host() private readonly _hostElement: ElementRef<HTMLElement>,
    private readonly _tooltipService: TooltipService
  ) {

  }

  ngOnDestroy() {
    this._tooltipService.hide();
    this._longPressEventSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    if (isMobile()) {
      this._longPressEventSubscription = watchForLongPress(this._hostElement.nativeElement)
        .subscribe({
          next: event => {
            this._showTooltip(event);
            setTimeout(() => this._hideTooltip(event), 5000);
          }
        });
    }
  }

  private _showTooltip(event: MouseEvent | KeyboardEvent | PointerEvent) {
    this._hideTooltip(event);
    this._timer = window.setTimeout(() => {
      event.stopPropagation();
      this._tooltipService.show(event.target as HTMLElement | SVGElement, this.content, this.placement);
    }, 250);
  }

  private _hideTooltip(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    window.clearTimeout(this._timer);
    this._tooltipService.hide();
  }

  /**
   * Tooltip is only shown on mouseover events iff we are not on a mobile device
   */
  @HostListener('mouseover', ['$event'])
  _onShowTooltipOnHover(event: MouseEvent) {
    if (!isMobile()) {
      this._showTooltip(event);
    }
  }

  @HostListener('keyup', ['$event'])
  _onShowTooltipOnFocus(event: KeyboardEvent) {
    if (document.activeElement === this._hostElement.nativeElement) {
      this._showTooltip(event);
    }
  }

  @HostListener('mouseout', ['$event'])
  @HostListener('blur', ['$event'])
  _onHideTooltip(event: MouseEvent | KeyboardEvent) {
    this._hideTooltip(event);
  }

}
