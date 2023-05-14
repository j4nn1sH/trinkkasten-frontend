import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = {};
  loggedIn = false;
  payPalLink = ''

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService, // bad practice
    private authService: AuthenticationService
  ) {
    this.getPayLink()
    this.reloadAuthenticated();
  }

  reloadAuthenticated() {
    this.authService.isAuthenticated().subscribe((data) => {
      this.loggedIn = true;
      this.user = data;
    });
  }


  logout() {
    this.authService.logout();
    this.loggedIn = false;
    this.reloadAuthenticated();
  }

  toggleHide() {
    this.shopService.toggleHide().subscribe((data) => {
      this.user = data;
    });
  }

  getPayLink() {
    this.shopService.getPayLink().subscribe((data) => {
      this.payPalLink = data.link;
    });
  }
}
