import { Component } from '@angular/core';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  names: any[] = [];

  constructor(
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {
    this.shopService.getKitchenList().subscribe((data) => {
      this.names = data;
    });
  }
}
