import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShopService } from '../shop.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  name = new FormControl('');

  constructor(
    private shopService: ShopService,
    private router: Router,
    private location: Location
  ) { }

  createShop() {
    if(!this.name.value) {
      return;
    }
    this.shopService.createShop(this.name.value).subscribe((data) => {
      this.router.navigate([data._id]);
    });
  }

  back() {
    this.location.back();
  }
}
