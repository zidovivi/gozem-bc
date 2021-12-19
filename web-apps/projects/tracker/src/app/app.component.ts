import {Component, OnInit} from '@angular/core';
import {Delivery, Package, transformToDelivery} from "projects/domain-data/src/lib/gz-common";
import {DeliveryService} from "projects/domain-data/src/lib/delivery.service";
import {PackageService} from "projects/domain-data/src/lib/package.service";
import {WebSocketDataService} from "projects/domain-data/src/lib/web-socket-data.service";
import { DomainDataService } from 'projects/domain-data/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebSocketDataService]
})
export class AppComponent implements OnInit {
  title = 'tracker';
  packageId: any;
  package?: Package;
  delivery?: Delivery;
  formSubmitted = false;

  mapCenter: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  mapMarkers: google.maps.MarkerOptions[] = [];

  constructor(private deliveryService: DeliveryService,
              private packageService: PackageService,
              private wsDataService: WebSocketDataService,
              private domainSvc: DomainDataService) {

  }

  ngOnInit(): void {
    this.domainSvc.messages$.subscribe(
      msg => {
        this.updateDelivery(msg);
      }
    )
  }

  onSubmit() {
    this.formSubmitted = true;
    this.package = undefined;
    this.delivery = undefined;
    this.resetMap();

    this.packageService.getPackage(this.packageId).subscribe(
      pkg => {
        this.package = pkg;
        if (this.package && this.package.active_delivery_id) {
          this.deliveryService.getDelivery(this.package.active_delivery_id).subscribe(
            delivery => {
              this.delivery = delivery;
              this.refreshMap();
              if(this.delivery)this.domainSvc.connect({queryString: 'delivery_id=' + this.delivery.delivery_id});
              
            });  
        }
      }
    );

  }

  resetMap() {
    this.mapCenter = {lat: 0, lng: 0};
    this.mapMarkers = [];
  }
  refreshMap() {
    if (this.package && this.delivery) {
      this.mapCenter = {lat: this.delivery.location_lat, lng: this.delivery.location_lng};
      this.mapMarkers = [];
      // set start
      this.mapMarkers.push({
        position: {
          lat: this.package.from_location_lat,
          lng: this.package.from_location_lng,
        },
        label: {
          color: 'blue',
          text: 'From',
        },
        title: 'From',
        animation: null
      })
      // set current
      //if (this.delivery.status !== 'delivered' && this.delivery.status !== 'failed') {
      this.mapMarkers.push({
        position: {
          lat: this.delivery.location_lat,
          lng: this.delivery.location_lng,
        },
        label: {
          color: 'red',
          text: 'Driver',
        },
        title: 'Driver',
        animation: google.maps.Animation.BOUNCE
      })
      //}
      // set end
      this.mapMarkers.push({
        position: {
          lat: this.package.to_location_lat,
          lng: this.package.to_location_lng,
        },
        label: {
          color: 'green',
          text: 'Destination',
        },
        title: 'Destination',
        animation: null
      });
    }

  }

  private updateDelivery(msg: any) {
    //console.log('ws messages on tracker: ' + JSON.stringify(msg.data));
    if (msg.data?.event && msg.data?.event === 'delivery_updated' && msg.data?.delivery_object && msg.data.delivery_object.delivery_id === this.delivery?.delivery_id) {
      this.delivery = transformToDelivery(msg.data.delivery_object);
      this.refreshMap();
      if (['delivered', 'failed'].includes(this.delivery.status)) {
        this.domainSvc.close();
      }
    }
  }

}
