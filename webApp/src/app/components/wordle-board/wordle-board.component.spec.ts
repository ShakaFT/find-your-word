import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleBoardComponent } from './wordle-board.component';

describe('WordleBoardComponent', () => {
  let component: WordleBoardComponent;
  let fixture: ComponentFixture<WordleBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WordleBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordleBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
