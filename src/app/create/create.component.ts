import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShopService } from '../shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  name = new FormControl('');

  constructor(
    private shopService: ShopService,
    private router: Router
  ) { }

  createKitchen() {
    console.log("Create Kitchen " + this.name.value)
    if(!this.name.value) {
      return;
    }
    this.shopService.createKitchen(this.name.value).subscribe((data) => {
      this.router.navigate([data.name]);
    });
  }
}
