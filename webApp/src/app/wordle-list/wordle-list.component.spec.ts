import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleListComponent } from './wordle-list.component';

describe('WordleListComponent', () => {
  let component: WordleListComponent;
  let fixture: ComponentFixture<WordleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
