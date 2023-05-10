import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteModeComponent } from './infinite-mode.component';

describe('InfiniteModeComponent', () => {
  let component: InfiniteModeComponent;
  let fixture: ComponentFixture<InfiniteModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfiniteModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfiniteModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
