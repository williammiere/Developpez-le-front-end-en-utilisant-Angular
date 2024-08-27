import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrls: ['./not-found.component.scss'],
  imports: [RouterLink],
})
export class NotFoundComponent {}
