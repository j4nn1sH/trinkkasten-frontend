import { Component } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  kitchen: any = {};

  current_section = 0;
  // 0: Select beverages
  // 1: Select user
  // 2: Confirm
  users: any[] = [];

  selectedBeverages: any[] = [];
  totalPrice = 0;
  selectedUser: any = {};

  user: any = {};
  loggedIn = false;

  threshold = -10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: ShopService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadAuthenticated();
    this.getKitchen();
  }

  getKitchen() {
    this.shopService.getKitchen(this.route.snapshot.paramMap.get('kitchen')!).subscribe((data) => {
      data.beverages = data.beverages
        .filter((beverage: any) => beverage.active)
        .map((beverage: any) => {
          beverage.amount = 0;
          return beverage;
        });
      this.kitchen = data;
      this.users = data.users
      .filter((user: any) => !user.hide)
      .map(
        (user: any) => {
          var balance = user.balance.toFixed(2);
          user = user.user
          user.balance = balance;
          if(user._id == this.user._id) {
            this.user = user;
          }
          return user;
        });
    }, (error) => {
      this.router.navigate(['']);
    });
  }

  loadAuthenticated() {
    this.authService.isAuthenticated().subscribe((data) => {
      this.loggedIn = true;
      this.user = data;
      this.selectedUser = data;
    });
  }

  back() {
    if(this.current_section == 2 && this.loggedIn) {
      this.current_section--;
    }
    this.current_section--;
  }

  addBeverage(beverage: any) {
    //if(beverage.amount < beverage.stock) {
      beverage.amount++;
    //}
  }

  selectBeverages() {
    this.selectedBeverages = this.kitchen.beverages.filter((beverage: any) => beverage.amount > 0);
    if(this.selectedBeverages.length == 0) {
      return;
    }
    this.totalPrice = this.selectedBeverages.reduce((total: number, beverage: any) => total + beverage.amount * beverage.price, 0);
    this.loadAuthenticated();
    if(this.loggedIn) {
      this.current_section++;
    }
    this.current_section++;
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.current_section++;
  }

  confirm() {
    this.current_section = 0;
    this.ngOnInit();
    this.shopService.buyBeverages(this.kitchen.name, this.selectedUser._id, this.selectedBeverages).subscribe((data) => {
      this.ngOnInit();
      this.selectedBeverages = [];
      this.selectedUser = {};
      this.current_section = 0;
    });
  }

  logout() {
    this.authService.logout()
  }
}
