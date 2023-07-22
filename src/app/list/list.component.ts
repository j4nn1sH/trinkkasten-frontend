import { Component } from '@angular/core';
import { ShopService } from '../shop.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  names: any[] = [];

  loggedIn = false;
  user: any = {};

  constructor(
    private shopService: ShopService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((data) => {
      this.loggedIn = true;
      this.user = data;
    });

    this.shopService.getKitchenList().subscribe((data) => {
      this.names = data;
    });
  }
}
