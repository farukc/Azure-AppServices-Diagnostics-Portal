import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplensDocSectionComponent } from './applens-doc-section.component';

describe('ApplensDocSectionComponent', () => {
  let component: ApplensDocSectionComponent;
  let fixture: ComponentFixture<ApplensDocSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplensDocSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplensDocSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
