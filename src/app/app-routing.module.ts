import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RestrictedGuard } from './restricted.guard';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RestrictedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
