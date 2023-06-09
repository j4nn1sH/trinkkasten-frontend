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
    private http: HttpClient
  ) { }

  addBeverage(name: String, price: Number): Observable<any> {
    return this.http.post(API_URL + '/shop/beverages', {
      name: name,
      price: price,
      active: true
    }, httpOptions);
  }

  updateBeverage(beverageId: String, name: String, price: Number): Observable<any> {
    return this.http.put(API_URL + '/shop/beverages/' + beverageId, {
      name: name,
      price: price
    }, httpOptions);
  }

  deleteBeverage(beverageId: String): Observable<any> {
    return this.http.delete(API_URL + '/shop/beverages/' + beverageId, httpOptions);
  }

  getBeverages(): Observable<any> {
    return this.http.get(API_URL + '/shop/beverages');
  }

  getAllBeverages(): Observable<any> {
    return this.http.get(API_URL + '/shop/beverages/all');
  }

  buyBeverages(user_id: String, beverages: Object[]): Observable<any> {
    return this.http.post(API_URL + '/shop/buy', {
      user_id: user_id,
      beverages: beverages
    }, httpOptions);
  }

  getUsers(): Observable<any> {
    return this.http.get(API_URL + '/user');
  }

  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/user/all');
  }

  addMoney(user_id: String, amount: Number): Observable<any> {
    return this.http.put(API_URL + '/user/' + user_id +'/add', {
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
}
