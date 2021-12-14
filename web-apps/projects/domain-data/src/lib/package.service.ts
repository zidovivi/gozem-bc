import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Package} from "./gz-common";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = "https://gozem-bc.herokuapp.com/api/package";

  constructor(private http: HttpClient) {
  }

  list(): Observable<Package[]> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        map(d => {
          return this.transformToPackages(d)
        }),
        catchError(this.handleError<Package[]>('listPackages'))
      );
  }

  getPackage(package_id: String): Observable<Package> {
    const url = `${this.apiUrl}/${package_id}`;
    return this.http.get<any>(url)
      .pipe(
        map(pkg => {
          return this.transformToPackage(pkg)
        }),
        catchError(this.handleError<Package>(`getPackage id=${package_id}`))
      );
  }

  addPackage(pkg: Package): Observable<Package> {
    return this.http.post<any>(this.apiUrl, pkg)
      .pipe(
        map(d => {
          return this.transformToPackage(d)
        }),
        catchError(this.handleError<Package>('addPackage'))
      );
  }

  transformToPackages(data: { package_id: any; active_delivery_id: any; description: any; weight: any; width: any; height: any; depth: any; from_name: any; from_address: any; from_location: { lat: any; lng: any; }; to_name: any; to_address: any; to_location: { lat: any; lng: any; }; }[]) {
    let pkgs: Package[] = [];
    data.forEach((d: { package_id: any; active_delivery_id: any; description: any; weight: any; width: any; height: any; depth: any; from_name: any; from_address: any; from_location: { lat: any; lng: any; }; to_name: any; to_address: any; to_location: { lat: any; lng: any; }; }) => pkgs.push(this.transformToPackage(d)));
    return pkgs;
  }

  transformToPackage(data: { package_id: any; active_delivery_id: any; description: any; weight: any; width: any; height: any; depth: any; from_name: any; from_address: any; from_location: { lat: any; lng: any; }; to_name: any; to_address: any; to_location: { lat: any; lng: any; }; }): Package {
    return {
      package_id: data.package_id,
      active_delivery_id: data.active_delivery_id,
      description: data.description,
      weight: data.weight,
      width: data.width,
      height: data.height,
      depth: data.depth,
      from_name: data.from_name,
      from_address: data.from_address,
      from_location_lat: data.from_location.lat,
      from_location_lng: data.from_location.lng,
      to_name: data.to_name,
      to_address: data.to_address,
      to_location_lat: data.to_location.lat,
      to_location_lng: data.to_location.lng,
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      return of(result as T);
    };
  }
}
