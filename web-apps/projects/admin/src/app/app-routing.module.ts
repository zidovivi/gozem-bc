import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "projects/admin/src/app/home-page/home-page.component";
import {PackageFormComponent} from "projects/admin/src/app/package-form/package-form.component";
import {DeliveryFormComponent} from "projects/admin/src/app/delivery-form/delivery-form.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'packages/new', component: PackageFormComponent},
  {path: 'deliveries/new', component: DeliveryFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
