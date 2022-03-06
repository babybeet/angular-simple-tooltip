import {
  Injectable,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef
} from '@angular/core';

import { TooltipComponent } from './tooltip.component';

@Injectable({
  providedIn: 'root'
})
/**
 * This class allows to programmatically show tooltip anchored at an element or at a specific x/y location
 */
export class TooltipService {

  private readonly _tooltipComponentFactory: ComponentFactory<TooltipComponent>;

  private _tooltipRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private readonly _injector: Injector,
    private readonly _applicationRef: ApplicationRef,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    this._tooltipComponentFactory = componentFactoryResolver.resolveComponentFactory(TooltipComponent);
  }

  /**
   * Programmatically show tooltip anchored at the element specified by `target`
   *
   * @param target The element at which to place the tooltip.
   * @param content Tooltip's body's content, it can contain HTML
   * @param placement Where the tooltip should be anchored at, `bottom` is the default
   */
  show(target: HTMLElement | SVGElement, content: string, placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom') {
    this._tooltipRef = this._createTooltip(content, placement);
    this._mountTooltip(this._tooltipRef);
    this._tooltipRef.instance.show(target);
  }

  /**
   * A helper method used to create new tooltip component refs
   *
   * @param content Tooltip's body's content, it can contain HTML
   * @param placement Where the tooltip should be anchored at
   * @returns
   */
  private _createTooltip(content: string, placement: 'top' | 'right' | 'bottom' | 'left'): ComponentRef<TooltipComponent> {
    const componentRef = this._tooltipComponentFactory.create(this._injector);

    componentRef.instance.content = content;
    componentRef.instance.placement = placement;
    componentRef.instance.runAfterClosed(() => {
      this._applicationRef.detachView(componentRef.hostView);
      componentRef.hostView.destroy();
    });
    return componentRef;
  }

  /**
   * Mount `tooltipRef` and make its host element a direct child of `document.body`
   *
   * @param tooltipRef
   */
  private _mountTooltip(tooltipRef: ComponentRef<TooltipComponent>) {
    this._applicationRef.attachView(tooltipRef.hostView);
    document.body.appendChild(tooltipRef.location.nativeElement);
  }

  /**
   * Show tooltip at a specific x/y location
   *
   * @param x The x location
   * @param y The y location
   * @param content Tooltip's body's content, it can contain HTML
   * @param placement Where the tooltip should be anchored at, `bottom` is the default
   */
  showAt(x: number, y: number, content: string, placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom') {
    this._tooltipRef = this._createTooltip(content, placement);
    this._mountTooltip(this._tooltipRef);
    this._tooltipRef.instance.showAt(x, y);
  }

  /**
   * Hide the currently active tooltip
   */
  hide() {
    if (this._tooltipRef) {
      this._tooltipRef.instance.hide();
      this._tooltipRef = null;
    }
  }

}
