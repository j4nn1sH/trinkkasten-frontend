import { Component } from '@angular/core';
import { ShopService } from '../shop.service';
import { AuthenticationService } from '../authentication.service';
import { Chart, ChartEvent, ActiveElement, ChartData } from 'chart.js/auto';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  beverages: any[] = [];
  users: any[] = ["Hilfe"];
  chart: any;
  beverageName = new FormControl();
  beveragePrice = new FormControl();

  selectedUser: any;
  moneyAmount: FormControl<number> = new FormControl();

  constructor(
    private shopService: ShopService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getBeverages();
    this.getUsers();
  }

  addBeverage() {
    if(this.beverageName.value === null || this.beverageName.value === undefined || this.beverageName.value === '') {
      return
    }
    if(this.beveragePrice.value === null || this.beveragePrice.value === undefined || this.beveragePrice.value === 0) {
      return
    }
    this.shopService.addBeverage(this.beverageName.value, this.beveragePrice.value).subscribe((data) => {
      this.beverages = data
      this.beverageName.reset();
      this.beveragePrice.reset();
    }
    );
  }

  getUsers() {
    this.shopService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.createChart();
    });
  }

  getBeverages() {
    this.shopService.getAllBeverages().subscribe((data) => {
      this.beverages = data.map((beverage: any) => {
        beverage.amount = 0;
        return beverage;
      });
    });
  }

  createChart(){
    const chartData: ChartData = {// values on X-Axis
      labels: this.users.map((user: any) => user.firstName),
       datasets: [
        {
          label: "Bilanz",
          data: this.users.map((user: any) => user.balance.toFixed(2)),
          backgroundColor: this.users.map((user: any) => user.balance < 0 ? "rgba(241, 131, 131, 0.2)" : "rgba(154, 226, 130, 0.2)"),
          borderColor: this.users.map((user: any) => user.balance < 0 ? "#FF6384" : "#9AE282"),
          borderWidth: 2
        }
      ]
    }

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
      data: chartData,
      options: {
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
            this.selectedUser = this.users[elements[0].index];
          }
        },
      }
    });
  }

  toggleActive(beverageId: string) {
    this.shopService.toggleActive(beverageId).subscribe((data) => {
      this.beverages = this.beverages.map((beverage: any) => {
        if (beverage._id === beverageId) {
          beverage = data;
        }
        return beverage;
      });
    });
  }

  addMoney() {
    if(this.moneyAmount.value === null || this.moneyAmount.value === undefined || this.moneyAmount.value === 0) {
      return
    }
    this.shopService.addMoney(this.selectedUser._id, this.moneyAmount.value).subscribe((data) => {
      this.selectedUser = data;
      this.users = this.users.map((user: any) => {
        if (user._id === this.selectedUser._id) {
          user = this.selectedUser;
        }
        return user;
      });
      this.moneyAmount.reset();
      this.chart.destroy();
      this.createChart();
    }
    );
  }
}
