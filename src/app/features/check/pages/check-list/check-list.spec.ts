import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListComponent } from './check-list';

describe('CheckListComponent', () => {
  let component: CheckListComponent;
  let fixture: ComponentFixture<CheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
