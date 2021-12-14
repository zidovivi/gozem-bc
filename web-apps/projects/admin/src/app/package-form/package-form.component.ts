import {Component, OnInit} from '@angular/core';
import {PackageService} from "projects/domain-data/src/lib/package.service";
import {Package} from "projects/domain-data/src/lib/gz-common";
import {Location} from "@angular/common";


@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css']
})
export class PackageFormComponent implements OnInit {

  model: Package = {
    description: '',
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
    from_name: '',
    from_address: '',
    from_location_lat: 0,
    from_location_lng: 0,
    to_name: '',
    to_address: '',
    to_location_lat: 0,
    to_location_lng: 0};

  constructor(private packageService: PackageService,
              private _location: Location) {
  }

  ngOnInit(): void {
  }

  onSubmit() {

    this.packageService.addPackage(this.model).subscribe(
      pkg => {
        console.log('created package: ' + pkg);
        this._location.back();
      })
  }

  newPackage() {
    this.model = {
      description: '',
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      from_name: '',
      from_address: '',
      from_location_lat: 0,
      from_location_lng: 0,
      to_name: '',
      to_address: '',
      to_location_lat: 0,
      to_location_lng: 0};
  }

}
