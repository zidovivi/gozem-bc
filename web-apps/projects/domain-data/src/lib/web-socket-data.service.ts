import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {catchError, EMPTY, map, Subject, switchAll, tap} from "rxjs";

export const WS_ENDPOINT = "ws://localhost:3000/websockets";

@Injectable({
  providedIn: 'root'
})
export class WebSocketDataService {
  private socket$?: WebSocketSubject<any>;

  constructor() {}

  public connect(queryString:string): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      let url = queryString ? WS_ENDPOINT + '?' + queryString : WS_ENDPOINT;
      console.log('WebSocketDataService url: ' + url);
      this.socket$ = webSocket(url);
    }
    return this.socket$;
  }

  public dataUpdates$(queryString: string) {
    return this.connect(queryString).asObservable();
  }

  closeConnection() {
    if(this.socket$ && !this.socket$.closed) {
      this.socket$.complete();
    }

  }

  sendMessage(msg: any) {
    if (this.socket$){
      this.socket$.next(msg);
    } else {
      console.log('Not connected to websocket');
    }

  }

  submitDeliveryLocationChanged(delivery_id: string, latitude: number, longitude: number) {
    let data = {event: 'location_changed', delivery_id: delivery_id, location: {lat: latitude, lng: longitude}};
    this.sendMessage(data);
  }

  submitDeliveryStatusChanged(delivery_id: string, status: string) {
    let data = {event: 'status_changed', delivery_id: delivery_id, status: status};
    this.sendMessage(data);
  }
}
