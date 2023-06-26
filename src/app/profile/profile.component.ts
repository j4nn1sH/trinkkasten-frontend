import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = {};
  loggedIn = false;
  payPalLink = ''
  selectedBalance: any = {};
  history: any = []

  constructor(
    private shopService: ShopService, // bad practice
    private authService: AuthenticationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.reloadAuthenticated();
    this.getBalances();
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

  getBalances() {
    this.shopService.getUserBalances().subscribe((data) => {
      this.user.balances = data;
      console.log(data)
    });
  }

  selectBalance(balance: any) {
    if(this.selectedBalance == balance) {
      this.selectedBalance = null;
      return;
    }
    this.shopService.getUserHistory(balance.kitchen).subscribe((data) => {
      this.history = data
      this.selectedBalance = balance;
    })
  }

  back() {
    this.location.back();
  }
}
