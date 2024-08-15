import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { OlympicService } from './olympic.service';
import { Olympic } from '../models/Olympic';
import { AppModule } from 'src/app/app.module';

describe('OlympicService', () => {
  let service: OlympicService;
  let httpMock: HttpTestingController;
  const mockOlympicData: Olympic[] = [
    {
      id: 1,
      country: 'USA',
      participations: [
        { id: 1, year: 2000, city: "Sydney", medalsCount: 10, athleteCount: 300 },
        { id: 2, year: 2004, city: "Athènes", medalsCount: 15, athleteCount: 350 },
      ],
    },
    {
      id: 2,
      country: 'France',
      participations: [
        { id: 3, year: 2000, city: "Sydney", medalsCount: 8, athleteCount: 250 },
        { id: 4, year: 2004, city: "Athènes", medalsCount: 12, athleteCount: 280 },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [OlympicService,provideHttpClientTesting()],
    });
    service = TestBed.inject(OlympicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial data', () => {
    service.loadInitialData().subscribe(() => {
      const olympics = service.getOlympicsValue();
      expect(olympics.length).toBe(2);
      expect(olympics).toEqual(mockOlympicData);
    });

    const req = httpMock.expectOne('./assets/mock/olympic.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockOlympicData);
  });

  it('should return Olympic data for a specific country by id', () => {
    service['olympics$'].next(mockOlympicData);

    service.getOlympicByCountryId(1).subscribe((olympic) => {
      expect(olympic).toEqual(mockOlympicData[0]);
    });
  });

  it('should return an error if Olympic data for a specific country by id is not found', () => {
    service['olympics$'].next(mockOlympicData);

    service.getOlympicByCountryId(3).subscribe(
      () => fail('Expected an error'),
      (error) => {
        expect(error.message).toBe('Could not find Olympic with country 3');
      }
    );
  });

  it('should calculate total medals correctly', () => {
    const totalMedals = service.getTotalMedalsPerOlympic(mockOlympicData[0]);
    expect(totalMedals).toBe(25);
  });

  it('should calculate total athletes correctly', () => {
    const totalAthletes = service.getTotalAthletesPerOlympic(mockOlympicData[0]);
    expect(totalAthletes).toBe(650);
  });

  it('should return the correct number of unique years for JO', () => {
    service['olympics$'].next(mockOlympicData);
    const numberOfJOs = service.getNumberOfJOs();
    expect(numberOfJOs).toBe(2); // 2000 and 2004
  });

  it('should return the correct number of unique countries', () => {
    service['olympics$'].next(mockOlympicData);
    const numberOfCountries = service.getNumberOfCountries();
    expect(numberOfCountries).toBe(2); // USA and France
  });
});
