import { Component, DebugElement, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipService } from './tooltip.service';


@Component({
  selector: 'kun-test',
  template: `
    <button #button>Hover over me!!!</button>
  `
})
class TestComponent {

  @ViewChild('button', { read: ElementRef })
  anchorRef: ElementRef<any>;

  constructor(readonly service: TooltipService) {

  }

  showTooltip(content: string) {
    this.service.show(this.anchorRef.nativeElement, content);
  }

  hideTooltip() {
    this.service.hide();
  }

}

describe('TooltipService', () => {
  const classPrefix = '.kun-tooltip';
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [TooltipService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. #show should create one and only one tooltip', () => {
    component.showTooltip('');
    fixture.detectChanges();
    expect(document.querySelectorAll(`${classPrefix}`).length).toEqual(1);
  });

  it('2. #show should show a tooltip with content "Hello World"', () => {
    component.showTooltip('Hello World');
    fixture.detectChanges();
    expect(document.querySelector(`${classPrefix}__content`).textContent).toBe('Hello World');
  });

  it('3. #show should render HTML content with innerHTML of <span>Hello World</span>', () => {
    component.showTooltip('<span>Hello World</span>');
    fixture.detectChanges();
    expect(document.querySelector(`${classPrefix}__content`).innerHTML).toBe('<span>Hello World</span>');
  });

  it('4. #show should open tooltip with an entering animation', () => {
    component.showTooltip('');
    fixture.detectChanges();
    expect(document.querySelector(`${classPrefix}`)).not.toBeNull();
    expect(document.querySelector(`${classPrefix}.enter`)).not.toBeNull();
  });

  it('5. #hide should cause last opened tooltip to perform a leaving animation', () => {
    component.showTooltip('');
    fixture.detectChanges();
    component.hideTooltip();
    fixture.detectChanges();
    expect(document.querySelector(`${classPrefix}`)).not.toBeNull();
    expect(document.querySelector(`${classPrefix}.enter`)).toBeNull();
    expect(document.querySelector(`${classPrefix}.leave`)).not.toBeNull();
  });

});
