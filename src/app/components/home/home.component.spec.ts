import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome message', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Welcome to Balance Management System');
  });

  it('should have get started button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Get Started');
  });

  it('should have learn more button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.btn');
    expect(buttons[1].textContent).toBe('Learn More');
  });

  it('should call onGetStarted when get started button is clicked', () => {
    spyOn(component, 'onGetStarted');
    fixture.detectChanges();
    
    const getStartedBtn = fixture.nativeElement.querySelector('.btn');
    getStartedBtn?.click();
    
    expect(component.onGetStarted).toHaveBeenCalled();
  });

  it('should call onLearnMore when learn more button is clicked', () => {
    spyOn(component, 'onLearnMore');
    fixture.detectChanges();
    
    const learnMoreBtn = fixture.nativeElement.querySelectorAll('.btn')[1];
    learnMoreBtn?.click();
    
    expect(component.onLearnMore).toHaveBeenCalled();
  });

  it('should display feature list', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const featureList = compiled.querySelector('.features ul');
    expect(featureList).toBeTruthy();
    expect(featureList?.children.length).toBe(5);
  });

  it('should display info cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const infoCards = compiled.querySelectorAll('.info-cards .card');
    expect(infoCards.length).toBe(3);
  });
});
