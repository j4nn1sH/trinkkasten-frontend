import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shop, User } from './models';

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

  // Shop
  createShop(name: String): Observable<any> {
    return this.http.post(API_URL + '/shop', {
      name: name
    }, httpOptions);
  }

  getShopList(): Observable<any> {
    return this.http.get(API_URL + '/shop');
  }

  getShop(shop_id: String): Observable<any> {
    return this.http.get(API_URL + '/shop/' + shop_id);
  }

  updateShop(shop: Shop) {
    return this.http.put(API_URL + '/shop/' + shop._id, {
      shop: shop
    }, httpOptions);
  }

  deleteShop(shop_id: String): Observable<any> {
    return this.http.delete(API_URL + '/shop/' + shop_id);
  }

  // Buy / Pay
  buy(shop_id: String, users: User[], items: any[]): Observable<any> {
    return this.http.post(API_URL + '/shop/' + shop_id, {
      users: users,
      items: items
    }, httpOptions);
  }

  pay(shop_id: String, user_id: String, amount: Number): Observable<any> {
    return this.http.post(API_URL + '/shop/' + shop_id +'/pay', {
      user_id: user_id,
      amount: amount
    }, httpOptions);
  }


  // Profile
  getBalanceList(): Observable<any> {
    return this.http.get(API_URL + '/user/balances');
  }

  getHistory(shop_id: String) {
    return this.http.get(API_URL + '/user/' + shop_id + '/history')
  }

  toggleHide(shop_id: String): Observable<any> {
    return this.http.put(API_URL + '/user/' + shop_id + '/toggleHide', httpOptions);
  }

  // Users
  isManager(shop_id: String): Observable<any> {
    return this.http.get(API_URL + '/shop/' + shop_id + '/isManager');
  }
}
