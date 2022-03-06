import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipModule } from './tooltip.module';


@Component({
  selector: 'kun-test',
  template: `
    <button #tooltipTrigger kunTooltip='Hello World' tabindex="1">Hello World</button>
  `
})
class TestComponent {

  @ViewChild('tooltipTrigger', { read: ElementRef })
  tooltipTrigger: ElementRef<HTMLButtonElement>;

}

describe('TooltipDirective', () => {
  const classPrefix = '.kun-tooltip';
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TooltipModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. should trigger tooltip with content "Hello World"', fakeAsync(() => {
    component.tooltipTrigger.nativeElement.dispatchEvent(new Event('mouseover'));
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}__content`).textContent).toEqual('Hello World');
  }));

  it('2. should trigger tooltip on mouseover', fakeAsync(() => {
    component.tooltipTrigger.nativeElement.dispatchEvent(new Event('mouseover'));
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(classPrefix)).not.toBeNull();
  }));

  it('3. should hide tooltip on mouseout', fakeAsync(() => {
    component.tooltipTrigger.nativeElement.dispatchEvent(new Event('mouseover'));
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}.enter`)).not.toBeNull();
    component.tooltipTrigger.nativeElement.dispatchEvent(new Event('mouseout'));
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}.leave`)).not.toBeNull();
  }));

  it('4. should trigger tooltip on focus by using tab key', fakeAsync(() => {
    const event = Object.assign(new Event('keyup'), { key: 'Tab' });
    component.tooltipTrigger.nativeElement.focus();
    component.tooltipTrigger.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}.enter`)).not.toBeNull();
  }));

  it('5. should hide tooltip on blur after being focused on by using tab key', fakeAsync(() => {
    const event = Object.assign(new Event('keyup'), { key: 'Tab' });
    component.tooltipTrigger.nativeElement.focus();
    component.tooltipTrigger.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}.enter`)).not.toBeNull();
    component.tooltipTrigger.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    tick(1000);
    expect(document.body.querySelector(`${classPrefix}.leave`)).not.toBeNull();
  }));

});
