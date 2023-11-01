import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { OlympicService, ThemeService } from '@core/services/index.services';
import {
  OlympicData,
  MedalCountryItem,
  Participation,
} from '@core/models/olympic-data.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<OlympicData>;
  public olympicsSubscription$: Subscription | undefined;

  public isLoading$!: Observable<boolean>;
  public colorScheme!: string;

  public medalsArray!: MedalCountryItem[];
  public totalParticipations!: number;
  public numberOfCountries!: number;
  public themeSubscription$!: Subscription;
  public arrayOfIndicators: { title: string; value: number }[] = [];

  constructor(
    private olympicService: OlympicService,
    private routerService: Router,
    private themeService: ThemeService,
    private titleMetaTagService: Title,
    private otherMetaTagsService: Meta
  ) {}

  ngOnInit(): void {
    this.titleMetaTagService.setTitle('Home page');

    this.olympics$ = this.olympicService.getOlympics();
    this.isLoading$ = this.olympicService.getIsLoading();

    this.medalsArray = [];

    this.olympicsSubscription$ = this.olympics$.subscribe(
      (olympicCountryData: OlympicData) => {
        const hasNoCountriesToDisplay: boolean = olympicCountryData.length < 1;
        if (hasNoCountriesToDisplay) {
          return;
        }
        this.setMedalsArray(olympicCountryData);
        this.setInfosCardValues(olympicCountryData);
      }
    );

    // Subscribe to the theme changes
    this.themeSubscription$ = this.themeService
      .getColorScheme()
      .subscribe((theme) => {
        this.colorScheme = theme;
      });
  }

  ngOnDestroy(): void {
    this.olympicsSubscription$?.unsubscribe();

    this.themeSubscription$?.unsubscribe();
  }

  setMedalsArray(olympicData: OlympicData): void {
    this.medalsArray = olympicData.map((countryOlympicData) => {
      const { id, country, participations } = countryOlympicData;
      return {
        id: id,
        name: country,
        value: participations.reduce((acc, cur: Participation) => {
          return acc + cur.medalsCount;
        }, 0),

        extra: {
          id,
        },
      };
    });
  }

  setInfosCardValues(olympicData: OlympicData): void {
    // Calculate the total number of participations
    const totalParticipations: number = olympicData.reduce(
      (acc, cur) => acc + cur.participations.length,
      0
    );

    // Calculate the number of countries that participated
    const numberOfCountries: number = olympicData.length;

    console.log({ totalParticipations, numberOfCountries });

    this.arrayOfIndicators = [
      { title: 'Total participations', value: totalParticipations },
      { title: 'Number of countries', value: numberOfCountries },
    ];
  }

  selectCountryById(e: MedalCountryItem<{ id: string }>): void {
    if (!e.extra) {
      return;
    }
    const { id } = e.extra;

    this.routerService.navigateByUrl(`/details/${id}`);
  }
}
