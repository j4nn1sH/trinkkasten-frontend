import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';
import { Location } from '@angular/common';
import { User } from '../models';

type Balance = {
  shop_id: String,
  name: String,
  balance: Number,
  link: String | null,
  hide: boolean,
  history?: any
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {


  user: User | null = null

  balanceList: Balance[] = []
  selectedBalance: Balance | null = null

  constructor(
    private shopService: ShopService, // bad practice
    private authService: AuthenticationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((data) => {
      this.user = data;
      this.getBalanceList();
    });
  }

  logout() {
    this.user = null;
    this.authService.logout();
  }

  getBalanceList() {
    this.shopService.getBalanceList().subscribe((data) => {
      this.balanceList = data;
    });
  }

  selectBalance(balance: any) {
    if(this.selectedBalance == balance) {
      this.selectedBalance = null;
      return;
    }
    this.selectedBalance = balance;
    this.shopService.getHistory(balance.shop_id).subscribe((data) => {
      this.selectedBalance!.history = data;
    })
  }

  toggleHide(shop_id: String) {
    this.shopService.toggleHide(shop_id).subscribe(() => {
      this.selectedBalance!.hide = !this.selectedBalance!.hide
    });
  }

  back() {
    this.location.back();
  }
}
