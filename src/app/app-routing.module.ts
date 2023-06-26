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
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: ':kitchen', component: ShopComponent },
  { path: ':kitchen/statistics', component: StatisticsComponent },
  { path: ':kitchen/dashboard', component: DashboardComponent, canActivate: [RestrictedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
