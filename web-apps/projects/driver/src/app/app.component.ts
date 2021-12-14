import {Component, OnInit} from '@angular/core';
import {Delivery, Package, transformToDelivery} from "projects/domain-data/src/lib/gz-common";
import {DeliveryService} from "projects/domain-data/src/lib/delivery.service";
import {PackageService} from "projects/domain-data/src/lib/package.service";
import {WebSocketDataService} from "projects/domain-data/src/lib/web-socket-data.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebSocketDataService]
})
export class AppComponent implements OnInit {
  delivery?: Delivery;
  package?: Package;
  deliveryId: any
  formSubmitted = false;

  pickedUpButtonEnabled = false;
  inTransitButtonEnabled = false;
  deliveredButtonEnabled = false;
  failedButtonEnabled = false;

  mapCenter: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  mapMarkers: google.maps.MarkerOptions[] = [];

  constructor(private deliveryService: DeliveryService,
              private packageService: PackageService,
              private websocketDataService: WebSocketDataService) {

  }

  ngOnInit() {
    this.initMap();

    this.websocketDataService.connect('').subscribe(
      msg => {
        this.updateDelivery(msg);
      }
    )


    setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.updateDeliveryLocation(lat, lng);

      })
    }, 20000)
  }


  onSubmit() {
    this.formSubmitted = true;
    this.deliveryService.getDelivery(this.deliveryId).subscribe(
      delivery => {
        this.delivery = delivery;

        this.updateButtonState(this.delivery.status);
        this.packageService.getPackage(this.delivery.package_id).subscribe(
          pkg => {
            this.package = pkg;
            this.refreshMap();
          });
      });

  }

  onStatusChanged(status: string) {
    console.log('status changed: ' + status);
    if (this.delivery) {
      this.delivery.status = status;
      this.updateButtonState(status);
      this.websocketDataService.submitDeliveryStatusChanged(this.delivery.delivery_id, status);
    }
  }

  updateButtonState(currentStatus: string) {
    if (currentStatus.toLowerCase() === 'open') {
      this.pickedUpButtonEnabled = true;
      this.inTransitButtonEnabled = false;
      this.deliveredButtonEnabled = false;
      this.failedButtonEnabled = false;
      return;
    }

    if (currentStatus.toLowerCase() === 'picked-up') {
      this.pickedUpButtonEnabled = false;
      this.inTransitButtonEnabled = true;
      this.deliveredButtonEnabled = false;
      this.failedButtonEnabled = false;
      return;
    }

    if (currentStatus.toLowerCase() === 'in-transit') {
      this.pickedUpButtonEnabled = false;
      this.inTransitButtonEnabled = false;
      this.deliveredButtonEnabled = true;
      this.failedButtonEnabled = true;
      return;
    }

    if (currentStatus.toLowerCase() === 'delivered' || currentStatus.toLowerCase() === 'failed') {
      this.pickedUpButtonEnabled = false;
      this.inTransitButtonEnabled = false;
      this.deliveredButtonEnabled = false;
      this.failedButtonEnabled = false;
      return;
    }

  }

  initMap() {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      this.mapCenter = {lat: lat, lng: lng};
      this.mapMarkers.push({
        position: {
          lat: lat,
          lng: lng,
        },
        label: {
          color: 'red',
          text: 'Driver',
        },
        title: 'Driver',
        animation: google.maps.Animation.BOUNCE
      })

    });
  }

  refreshMap() {
    if (this.package && this.delivery) {
      this.mapCenter = {
        lat: this.delivery.location_lat,
        lng: this.delivery.location_lng,
      }

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

  updateDeliveryLocation(lat: number, lng: number) {
    console.log('Calling updateDeliveryLocation with lat:' + lat + ' lng:' + lng);
    if (this.delivery && this.delivery.status !== 'delivered' && this.delivery.status !== 'failed') { // omits when delivered or failed
      this.delivery.location_lng = lat;
      this.delivery.location_lat = lng;
      this.websocketDataService.submitDeliveryLocationChanged(this.delivery.delivery_id, lat, lng);
    }
  }

  private updateDelivery(msg: any) {
    console.log('ws messages on driver: ' + JSON.stringify(msg.data));
    console.log(msg.data?.event);
    if (msg.data?.event && msg.data?.event === 'delivery_updated' && msg.data?.delivery_object && msg.data.delivery_object.delivery_id === this.delivery?.delivery_id) {
      this.delivery = transformToDelivery(msg.data.delivery_object);
      this.updateButtonState(this.delivery.status);
      this.refreshMap();
    }
  }
}
