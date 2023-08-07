import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RestrictedGuard } from './restricted.guard';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: ':shop_id', component: ShopComponent, canActivate: [AuthGuard] },
  { path: ':shop_id/statistics', canActivate: [AuthGuard], component: StatisticsComponent },
  { path: ':shop_id/dashboard', component: DashboardComponent, canActivate: [RestrictedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
