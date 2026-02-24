import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesBooks } from './categories-books';

describe('CategoriesBooks', () => {
  let component: CategoriesBooks;
  let fixture: ComponentFixture<CategoriesBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
