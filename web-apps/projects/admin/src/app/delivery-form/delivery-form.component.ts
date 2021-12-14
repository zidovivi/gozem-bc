import {Component, OnInit} from '@angular/core';
import {DeliveryService} from "projects/domain-data/src/lib/delivery.service";
import {CreateDelivery, Package} from "projects/domain-data/src/lib/gz-common";
import {PackageService} from "projects/domain-data/src/lib/package.service";
import {Location} from "@angular/common";


class DeliveryForm {
  constructor(
    public package_id: string,
    public location_lat: number,
    public location_lng: number,
    public delivery_id?: string,
    public pickup_time?: Date,
    public start_time?: Date,
    public end_time?: Date,
    public status?: string
  ) {
  }
}

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.css']
})
export class DeliveryFormComponent implements OnInit {

  packages?: Package[];
  package_id?: string;

  constructor(private deliveryService: DeliveryService,
              private packageService: PackageService, private _location: Location) {
  }

  ngOnInit(): void {
    this.getPackages();
  }

  getPackages() {
    this.packageService.list().subscribe(pkgs => {
      this.packages = pkgs;
    });
  }

  onSubmit() {
    this.deliveryService.addDelivery(this.package_id).subscribe(
      delivery => {
        console.log('created delivery: ' + delivery);
        this._location.back();
      })
  }

  newDelivery() {
    this.package_id = undefined;
  }


}
