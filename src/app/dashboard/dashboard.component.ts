import { Component } from '@angular/core';
import { ShopService } from '../shop.service';
import { Chart, ChartEvent, ActiveElement, ChartData } from 'chart.js/auto';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  kitchen: any = {};
  name = new FormControl();
  link = new FormControl();
  newManagerMail = new FormControl();

  chart: any;
  beverageName = new FormControl();
  beveragePrice = new FormControl();

  selectedBeverage: any

  selectedUser: any;
  moneyAmount: FormControl<number> = new FormControl();


  constructor(
    private location: Location,
    private shopService: ShopService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getKitchen();
  }

  getKitchen() {
    this.shopService.getKitchen(this.route.snapshot.paramMap.get('kitchen')!).subscribe((data) => {
      this.kitchen = data;
      this.name.setValue(this.kitchen.name);
      this.link.setValue(this.kitchen.link);
      this.createChart();
      console.log(this.kitchen)
    });
  }

  update() {
    console.log(this.kitchen)
    this.shopService.updateKitchen(this.kitchen).subscribe((data) => {
      this.kitchen = data;
      this.beverageName.reset();
      this.beveragePrice.reset();
    });
  }

  editLink() {
    this.kitchen.link = this.link.value;
    this.update();
  }

  createBeverage() {
    if(this.beverageName.value === null || this.beverageName.value === undefined || this.beverageName.value === '') {
      return
    }
    if(this.beveragePrice.value === null || this.beveragePrice.value === undefined || this.beveragePrice.value === 0) {
      return
    }
    this.kitchen.beverages.push({
      name: this.beverageName.value,
      price: this.beveragePrice.value,
      active: true
    });
    this.update();
  }

  selectBeverage(beverage: any) {
    if(this.selectedBeverage != beverage) {
      this.selectedBeverage = beverage
      this.beverageName.setValue(beverage.name)
      this.beveragePrice.setValue(beverage.price)
    } else {
      this.selectedBeverage = null
      this.beverageName.reset();
      this.beveragePrice.reset();
    }
  }

  updateBeverage() {
    if(this.beverageName.value === null && this.beveragePrice.value === null) {
      return
    }
    this.kitchen.beverages = this.kitchen.beverages.map((beverage: any) => {
      if (beverage._id === this.selectedBeverage._id) {
        beverage.name = this.beverageName.value;
        beverage.price = this.beveragePrice.value;
      }
      return beverage;
    });
    this.update();
  }

  toggleActive() {
    this.kitchen.beverages = this.kitchen.beverages.map((beverage: any) => {
      if (beverage._id === this.selectedBeverage._id) {
        beverage.active = !beverage.active;
      }
      return beverage;
    });
    this.update();
  }

  deleteBeverage() {
    this.kitchen.beverages = this.kitchen.beverages.filter((beverage: any) => {
      return beverage._id !== this.selectedBeverage._id;
    });
    this.update();
  }

  promote(user: any) {
    if(!user) return
    this.kitchen.managers.push(user._id);
    this.update();
  }

  demote(user: any) {
    if(!user) return
    if(this.kitchen.managers.length === 1) {
      return
    }
    this.kitchen.managers = this.kitchen.managers.filter((manager: any) => {
      return manager !== user._id;
    });
    this.update();
  }

  deleteUser(user: any) {
    if(!user) return
    this.kitchen.users = this.kitchen.users.filter((u: any) => {
      return u.user._id !== user._id;
    });
    this.update();
  }

  isManager(u: any) {
    if(!u) {
      return false;
    }
    return this.kitchen.managers.includes(u._id);
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
      labels: this.kitchen.users.map((user: any) => user.user.firstName + " " + user.user.lastName),
       datasets: [
        {
          label: "Bilance",
          data: this.kitchen.users.map((user: any) => user.balance.toFixed(2)),
          backgroundColor: this.kitchen.users.map((user: any) => user.balance < 0 ? "rgba(241, 131, 131, 0.2)" : "rgba(154, 226, 130, 0.2)"),
          borderColor: this.kitchen.users.map((user: any) => user.balance < 0 ? "#FF6384" : "#9AE282"),
          borderWidth: 2
        }
      ]
    }

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onHover: (
          event: ChartEvent,
          elements: ActiveElement[],
          chart: Chart<'bar'>
        ) => {
          chart.canvas.style.cursor= elements.length !==0 ? 'pointer' : 'default';
        },
        onClick: (
          event: ChartEvent,
          elements: ActiveElement[],
          chart: Chart<'bar'>
        ) => {
          if (elements[0]) {
            this.selectedUser = this.kitchen.users[elements[0].index];
          }
        },
      }
    });
  }

  pay() { // TODO Description mit anhängen
    if(this.moneyAmount.value === null || this.moneyAmount.value === undefined || this.moneyAmount.value === 0) {
      return
    }
    this.shopService.pay(this.kitchen.name, this.selectedUser.user, this.moneyAmount.value).subscribe((data) => {
      this.chart.destroy();
      this.getKitchen();
      this.selectedUser = null;
      this.moneyAmount.reset();
    }
    );
  }

  back() {
    this.location.back();
  }
}
