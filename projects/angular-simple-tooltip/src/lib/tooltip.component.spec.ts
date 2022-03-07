import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. should contain "Hello World" in body', fakeAsync(() => {
    component.content = 'Hello World';
    fixture.detectChanges();
    component.show(document.createElement('div'));
    tick(200);
    expect(fixture.debugElement.query(By.css('.kun-tooltip__content')).nativeElement.textContent).toEqual('Hello World');
  }));

  it('2. should be placed at bottom of anchor by default', fakeAsync(() => {
    fixture.detectChanges();
    component.show(document.createElement('div'));
    tick(200);
    expect(fixture.debugElement.children[0].classes['bottom']).toBeTrue();
  }));

  it('3. should have "enter" in class attribute', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'left:200px'].join(';'));
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    fixture.detectChanges();
    tick(200);
    expect(fixture.debugElement.children[0].classes['enter']).toBeTrue();
  }));

  it('4. should be placed on the left when placement is "left"', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'left:200px'].join(';'));

    component.placement = 'left';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    fixture.detectChanges();
    tick(200);
    expect(fixture.debugElement.children[0].classes['left']).toBeTrue();
  }));

  it('5. should be placed on the right when it overflows the left edge of viewport', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'left:0'].join(';'));
    component.placement = 'left';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    tick(200);
    expect(fixture.debugElement.children[0].classes['left']).toBeUndefined();
    expect(fixture.debugElement.children[0].classes['right']).toBeTrue();
  }));

  it('6. should be placed on the left when it overflows the right edge of viewport', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'right:0'].join(';'));
    component.placement = 'right';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    tick(200);
    expect(fixture.debugElement.children[0].classes['right']).toBeUndefined();
    expect(fixture.debugElement.children[0].classes['left']).toBeTrue();
  }));

  it('7. should be placed at the bottom when it overflows the top edge of viewport', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'top:0'].join(';'));
    component.placement = 'top';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    tick(200);
    expect(fixture.debugElement.children[0].classes['top']).toBeUndefined();
    expect(fixture.debugElement.children[0].classes['bottom']).toBeTrue;
  }));

  it('8. should be placed at the top when it overflows the bottom edge of viewport', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'bottom:0'].join(';'));
    component.placement = 'bottom';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    tick(200);
    expect(fixture.debugElement.children[0].classes['bottom']).toBeUndefined();
    expect(fixture.debugElement.children[0].classes['top']).toBeTrue();
  }));

  it('9. should hide tooltip', fakeAsync(() => {
    const anchor = document.createElement('div');

    anchor.setAttribute('style', ['position:absolute', 'bottom:0'].join(';'));
    component.placement = 'bottom';
    fixture.detectChanges();
    document.body.appendChild(anchor);
    component.show(anchor);
    tick(200);
    component.hide();
    tick(200);
    expect(fixture.debugElement.children[0].classes['leave']).toBeTrue();
  }));

});
