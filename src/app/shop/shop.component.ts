import { Component } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  kitchen = 'K1.3'
  showProfile = false;

  current_section = 0;
  // 0: Select beverages
  // 1: Select user
  // 2: Confirm
  beverages: any[] = [];
  users: any[] = [];

  selectedBeverages: any[] = [];
  totalPrice = 0;
  selectedUser: any = {};

  user: any = {};
  loggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.kitchen = this.route.snapshot.paramMap.get('kitchen')!;
    this.getBeverages();
    this.getUsers();
    this.reloadAuthenticated();
  }

  reloadAuthenticated() {
    this.authService.isAuthenticated().subscribe((data) => {
      this.loggedIn = true;
      this.user = data;
      this.selectedUser = data;
    });
  }

  getBeverages() {
    this.shopService.getBeverages().subscribe((data) => {
      this.beverages = data.map((beverage: any) => {
        beverage.amount = 0;
        return beverage;
      });
    });
  }

  getAllBeverages() {
    this.shopService.getBeverages().subscribe((data) => {
      this.beverages = data.map((beverage: any) => {
        beverage.amount = 0;
        return beverage;
      });
    });
  }

  getUsers() {
    this.shopService.getUsers().subscribe((data) => {
      this.users = data;
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
    this.selectedBeverages = this.beverages.filter((beverage: any) => beverage.amount > 0);
    if(this.selectedBeverages.length == 0) {
      return;
    }
    this.totalPrice = this.selectedBeverages.reduce((total: number, beverage: any) => total + beverage.amount * beverage.price, 0);
    this.reloadAuthenticated();
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
    this.shopService.buyBeverages(this.selectedUser._id, this.selectedBeverages).subscribe((data) => {
      this.getBeverages();
      this.selectedBeverages = [];
      this.selectedUser = {};
      this.current_section = 0;
    });
  }

  logout() {
    this.authService.logout()
  }
}
