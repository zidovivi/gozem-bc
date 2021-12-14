import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainDataComponent } from './domain-data.component';

describe('DomainDataComponent', () => {
  let component: DomainDataComponent;
  let fixture: ComponentFixture<DomainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
