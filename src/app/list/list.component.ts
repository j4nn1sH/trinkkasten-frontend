import { Component } from '@angular/core';
import { ShopService } from '../shop.service';
import { AuthenticationService } from '../authentication.service';
import { User } from '../models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  user: User | null = null;

  list: {
    _id: String,
    name: String,
  }[] = [];

  constructor(
    private shopService: ShopService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.me().subscribe((user: User) => {
      this.user = user;
    });

    this.shopService.getShopList().subscribe((list: {_id: String, name: String}[]) => {
      this.list = list;
    });
  }
}
