import { Component } from '@angular/core';
import { ShopService } from '../shop.service';
import { Chart, ChartEvent, ActiveElement, ChartData } from 'chart.js/auto';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shop, User } from '../models';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: User | null = null;
  shop: Shop = {
    _id: '',
    link: '',
    name: '',
    items: [],
    users: [],
    managers: []
  };

  name = new FormControl();
  link = new FormControl();
  newManagerMail = new FormControl();

  chart: any;
  item = {
    name: new FormControl(),
    price: new FormControl()
  }

  selectedItem: any

  selectedUser: any | null = null;
  moneyAmount: FormControl<number> = new FormControl();

  confirmDeletaion = false;


  constructor(
    private shopService: ShopService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    // Get logged in user
    this.authService.me().subscribe((user) => {
      this.user = user;
    });
    // Get shop
    this.shopService.getShop(this.route.snapshot.paramMap.get('shop_id')!).subscribe((data) => {
      // Unpack the user in the users array
      data.users = data.users.map((u: any) => {
        var user = u.user
        user.balance = u.balance
        user.hide = u.hide
        return user
      });

      this.shop = data;

      this.createChart();
    });
  }

  update() {
    this.shopService.updateShop(this.shop).subscribe((data: any) => {
      this.item.name.reset();
      this.item.price.reset();
      this.chart.destroy();
      this.load();
    });
  }

  editLink() {
    this.shop.link = this.link.value;
    this.update();
  }

  createItem() {
    if(!this.item.name.value || !this.item.price.value) {
      return
    }
    this.shop.items.push({
      name: this.item.name.value,
      price: this.item.price.value,
      active: true
    });
    this.update();
  }

  selectItem(item: any) {
    if(this.selectedItem != item) {
      this.selectedItem = item
      this.item.name.setValue(item.name)
      this.item.price.setValue(item.price)
    } else {
      this.selectedItem = null
      this.item.name.reset();
      this.item.price.reset();
    }
  }

  updateItem() {
    if(!this.item.name.value || !this.item.price.value) {
      return
    }
    this.shop.items = this.shop.items.map((item: any) => {
      if (item._id === this.selectedItem._id) {
        item.name = this.item.name.value;
        item.price = this.item.price.value;
      }
      return item;
    });
    this.update();
  }

  toggleItem() {
    this.shop.items = this.shop.items.map((item: any) => {
      if (item._id === this.selectedItem._id) {
        item.active = !item.active;
      }
      return item;
    });
    this.update();
  }

  deleteItem() {
    this.shop.items = this.shop.items.filter((item: any) => {
      return item._id !== this.selectedItem._id;
    });
    this.update();
  }

  promote(user: any) {
    if(!user) return
    this.shop.managers.push(user);
    this.update();
  }

  demote(user: any) {
    if(!user) return
    if(this.shop.managers.length === 1) {
      return
    }
    this.shop.managers = this.shop.managers.filter((manager: any) => {
      return manager._id !== user._id;
    });
    this.update();
  }

  deleteUser(user: any) {
    if(!user) return
    this.shop.users = this.shop.users.filter((u: any) => {
      return u.user._id !== user._id;
    });
    this.update();
  }

  isManager(user: User) {
    if(!user) {
      return false;
    }
    return this.shop.managers.map(u => u._id).includes(user._id);
  }

  selectUser(user: any) {
    if(this.selectedUser != user) {
      this.selectedUser = user
    } else {
      this.selectedUser = null
    }
  }

  createChart(){
    const chartData: ChartData = {// values on X-Axis
      labels: this.shop.users.map((user: any) => user.firstName + " " + user.lastName),
       datasets: [
        {
          label: "Bilance",
          data: this.shop.users.map((user: any) => user.balance.toFixed(2)),
          backgroundColor: this.shop.users.map((user: any) => user.balance < 0 ? "rgba(241, 131, 131, 0.2)" : "rgba(154, 226, 130, 0.2)"),
          borderColor: this.shop.users.map((user: any) => user.balance < 0 ? "#FF6384" : "#9AE282"),
          borderWidth: 2
        }
      ]
    }

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes the type of chart
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onHover: (
          event: ChartEvent,
          elements: ActiveElement[],
          chart: Chart<'bar'>
        ) => {
          chart.canvas.style.cursor = elements.length !==0 ? 'pointer' : 'default';
        },
        onClick: (
          event: ChartEvent,
          elements: ActiveElement[],
          chart: Chart<'bar'>
        ) => {
          if (elements[0]) {
            if(this.selectedUser == this.shop.users[elements[0].index]) {
              this.selectedUser = null;
              return
            }
            this.selectedUser = this.shop.users[elements[0].index];
          }
        },
      }
    });
  }

  pay() {
    if(this.moneyAmount.value === null || this.moneyAmount.value === undefined || this.moneyAmount.value === 0) {
      return
    }
    this.shopService.pay(this.shop._id, this.selectedUser._id, this.moneyAmount.value).subscribe((data) => {
      this.chart.destroy();
      this.load();
      this.selectedUser = null;
      this.moneyAmount.reset();
    }
    );
  }

  deleteShop() {
    this.shopService.deleteShop(this.shop._id).subscribe((data) => {
      this.router.navigate(['./'])
    });
  }
}
