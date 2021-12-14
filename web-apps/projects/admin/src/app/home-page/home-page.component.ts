import { Component, OnInit } from '@angular/core';
import {Delivery, Package} from "projects/domain-data/src/lib/gz-common";
import {DeliveryService} from "projects/domain-data/src/lib/delivery.service";
import {PackageService} from "projects/domain-data/src/lib/package.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  packages?: Package[];
  deliveries?: Delivery[];

  constructor(private deliveryService: DeliveryService,
              private packageService: PackageService) {
  }

  ngOnInit(): void {
    this.packageService.list().subscribe(pkgs => {
      this.packages = pkgs;
    });
    this.deliveryService.list().subscribe(deliveries => {
      this.deliveries = deliveries;
    });
  }

}
