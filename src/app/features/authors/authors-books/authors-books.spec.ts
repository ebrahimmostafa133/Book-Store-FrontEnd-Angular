import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsBooks } from './authors-books';

describe('AuthorsBooks', () => {
  let component: AuthorsBooks;
  let fixture: ComponentFixture<AuthorsBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
