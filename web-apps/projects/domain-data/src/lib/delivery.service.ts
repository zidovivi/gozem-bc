import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Delivery} from "./gz-common";
import {catchError, map, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = "http://localhost:3000/api/delivery";

  constructor(private http: HttpClient) {
  }

  list(): Observable<Delivery[]> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        map(d => {
          return this.transformToDeliveries(d)
        }),
        catchError(this.handleError<Delivery[]>('listDeliveries'))
      );
  }

  addDelivery(package_id?: string): Observable<Delivery> {
    return this.http.post<any>(this.apiUrl, {package_id: package_id})
      .pipe(
        map(d => {
          return this.transformToDelivery(d)
        }),
        catchError(this.handleError<Delivery>('addPackage'))
      );
  }

  getDelivery(delivery_id: String): Observable<Delivery> {
    const url = `${this.apiUrl}/${delivery_id}`;
    return this.http.get<any>(url)
      .pipe(
        map(d => {
          if(!d) throw new Error('delivery not found');
          return this.transformToDelivery(d)
        }),
        catchError(this.handleError<Delivery>(`getDelivery id=${delivery_id}`))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      return of(result as T);
    };
  }


  transformToDelivery(data: {
    delivery_id: any; package_id: any; pickup_time: any; start_time: any; end_time: any; location: {
      lng: any;
      lat: any;
    }; status: any;
  }): Delivery {
    return {
      delivery_id: data.delivery_id,
      package_id: data.package_id,
      pickup_time: data.pickup_time,
      start_time: data.start_time,
      end_time: data.end_time,
      location_lat: data.location?.lat,
      location_lng: data.location?.lng,
      status: data.status
    }
  }

  transformToDeliveries(data: { delivery_id: any; package_id: any; pickup_time: any; start_time: any; end_time: any; location: { lng: any; lat: any; }; status: any; }[]): Delivery[] {
    let deliveries: Delivery[] = [];
    data.forEach((d: { delivery_id: any; package_id: any; pickup_time: any; start_time: any; end_time: any; location: { lng: any; lat: any; }; status: any; }) => deliveries.push(this.transformToDelivery(d)));
    return deliveries;
  }
}
