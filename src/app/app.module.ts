import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {RouterModule, RouterOutlet} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OlympicService} from "./core/services/olympic.service";
import {JsonPipe} from "@angular/common";
import {BarChartModule, NgxChartsModule, PieChartModule} from "@swimlane/ngx-charts";
import {AppRoutingModule} from "./app-routing.module";
import {CountryDetailsComponent} from "./pages/country-details/country-details.component"; // Ensure this is imported


@NgModule({
  declarations: [AppComponent,HomeComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule,BrowserAnimationsModule,RouterModule, RouterOutlet,
    JsonPipe, PieChartModule,BarChartModule,HttpClientModule,CountryDetailsComponent,NgxChartsModule],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
