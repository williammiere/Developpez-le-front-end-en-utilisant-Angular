import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

/**
 * @Component Not found page
 * @description User is redirected to this page since he tries to access an unknown path.
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrls: ['./not-found.component.scss'],
  imports: [RouterLink, Button],
})
export class NotFoundComponent {

  constructor(private router: Router) {
  }

    /**
     * Navigate to home page
     */
  nagivateToHome() {
    this.router.navigate(['/']);
  }
}
