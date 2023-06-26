import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private http: HttpClient,
  ) { }

  createKitchen(name: String): Observable<any> {
    return this.http.post(API_URL + '/shop', {
      name: name
    }, httpOptions);
  }

  getKitchen(name: String): Observable<any> {
    return this.http.get(API_URL + '/shop/' + name);
  }

  updateKitchen(kitchen: any) {
    return this.http.put(API_URL + '/shop/' + kitchen.name, {
      kitchen
    }, httpOptions);
  }

  getKitchenList(): Observable<any> {
    return this.http.get(API_URL + '/shop');
  }

  addBeverage(kitchenName: String, name: String, price: Number): Observable<any> {
    return this.http.post(API_URL + '/shop/' + kitchenName, {
      name: name,
      price: price,
      active: true
    }, httpOptions);
  }

  updateBeverage(kitchenName: String, beverageId: String, name: String, price: Number): Observable<any> {
    return this.http.put(API_URL + '/shop/' + kitchenName + '/' + beverageId, {
      name: name,
      price: price
    }, httpOptions);
  }

  deleteBeverage(kitchenName: String, beverageId: String): Observable<any> {
    return this.http.delete(API_URL + '/shop/' + kitchenName + '/' + beverageId, httpOptions);
  }

  getBeverages(): Observable<any> {
    return this.http.get(API_URL + '/shop/beverages');
  }

  getAllBeverages(): Observable<any> {
    return this.http.get(API_URL + '/shop/beverages/all');
  }

  buyBeverages(kitchenName: String, user_id: String, beverages: Object[]): Observable<any> {
    return this.http.post(API_URL + '/shop/' + kitchenName, {
      user_id: user_id,
      beverages: beverages
    }, httpOptions);
  }

  getUserHistory(kitchenName: String) {
    return this.http.get(API_URL + '/user/history/' + kitchenName)
  }

  getUsers(): Observable<any> {
    return this.http.get(API_URL + '/user');
  }

  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/user/all');
  }

  getUserBalances(): Observable<any> {
    return this.http.get(API_URL + '/user/balances');
  }

  pay(kitchen_id: String, user_id: String, amount: Number): Observable<any> {
    return this.http.post(API_URL + '/shop/' + kitchen_id +'/pay', {
      user_id: user_id,
      amount: amount
    }, httpOptions);
  }

  toggleHide(): Observable<any> {
    return this.http.put(API_URL + '/user/toggleHide', httpOptions);
  }

  toggleActive(beverageId: String): Observable<any> {
    return this.http.put(API_URL + '/shop/beverages/' + beverageId + "/toggleActive", httpOptions);
  }

  getPayLink(): Observable<any> {
    return this.http.get(API_URL + '/shop/link', httpOptions);
  }

  isManager(kitchenName: String): Observable<any> {
    return this.http.get(API_URL + '/shop/' + kitchenName + '/isManager');
  }
}
