import { Component } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Shop } from '../models';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  shop: Shop = {
    _id: '',
    link: '',
    name: '',
    items: [],
    users: [],
    managers: []
  };
  user: User | null = null;

  current_section = 0;
  // 0: Select beverages
  // 1: Select user
  // 2: Confirm

  selectedItems: any[] = [];
  totalPrice = 0;
  selectedUsers: User[] = [];

  threshold = -10; // TODO put in shop model
  multiSelect = false;

  errorMessages: String[] = [];
  success = false;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: ShopService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe((user) => {
      user.balance = 0;
      user.hide = false;

      this.user = user;
    });
    this.loadShop();
  }

  loadShop() {
    var shop_id = this.route.snapshot.paramMap.get('shop_id')!;
    this.shopService.getShop(shop_id).subscribe((data) => {
      // Filter out inactive items
      data.items = data.items
        .filter((item: any) => item.active)
        .map((item: any) => {
          item.amount = 0;
          return item;
        });
      // Push forward the user objects
      data.users = data.users.map((u: any) => {
        let user = u.user;
        user.balance = u.balance;
        user.hide = u.hide;
        return user;
      });

      // Make sure the user is in the list
      data.users.forEach((u: User) => {
        if(u._id == this.user!._id) {
          this.user!.balance = u.balance;
          this.user!.hide = false;
        }
      });
      data.users = data.users.filter((u: User) => u._id != this.user!._id)
      data.users.push(this.user);

      // Tests if user is manager
      if(this.user) {
        this.shopService.isManager(data._id).subscribe((isManager) => {
          this.user!.isManager = isManager;
          if(!isManager) {
            data.users = data.users.filter((u: any) => !u.hide || u._id == this.user!._id);
          }
          this.shop = data;
         this.selectedUsers = [this.user!];
        });
      }
      this.loading = false;
    }, (error) => {
      this.router.navigate(['']);
    });
  }

  stepBack() {
    if(this.current_section == 2) {
      this.selectedUsers = [];
    }
    this.current_section--;
  }

  addItem(item: any) {
    item.amount++;
  }

  selectBeverages() {
    this.selectedItems = this.shop.items.filter((item: any) => item.amount > 0);
    if(this.selectedItems.length == 0) {
      return;
    }
    this.totalPrice = this.selectedItems.reduce((total: number, beverage: any) => total + beverage.amount * beverage.price, 0);
    this.current_section++;
  }

  selectUser(user: User) {
    if(this.selectedUsers.includes(user)) {
      this.selectedUsers = this.selectedUsers.filter((u) => u._id != user._id);
      return;
    } else if(!this.multiSelect) {
      this.selectedUsers = [user];
      this.current_section++;
    } else {
      this.selectedUsers.push(user);
    }
  }

  confirm() {
    if(this.selectedUsers == null) {
      return;
    }
    this.shopService.buy(this.shop._id, this.selectedUsers, this.selectedItems).subscribe((data) => {
      this.ngOnInit();
      this.current_section = 0;
      this.success = true;
      this.multiSelect = false;
    }, (error) => {
      this.errorMessages.push(error.error);
    });
  }
}
