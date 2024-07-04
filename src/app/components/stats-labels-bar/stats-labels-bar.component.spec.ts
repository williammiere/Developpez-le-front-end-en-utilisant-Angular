import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsLabelsBarComponent } from './stats-labels-bar.component';

describe('StatsLabelsBarComponent', () => {
  let component: StatsLabelsBarComponent;
  let fixture: ComponentFixture<StatsLabelsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsLabelsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsLabelsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
