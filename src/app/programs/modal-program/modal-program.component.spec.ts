import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProgramComponent } from './modal-program.component';

describe('ModalProgramComponent', () => {
  let component: ModalProgramComponent;
  let fixture: ComponentFixture<ModalProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProgramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
