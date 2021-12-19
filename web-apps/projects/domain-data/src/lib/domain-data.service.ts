import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export const WS_ENDPOINT = "ws://localhost:3000/websockets";
export const RECONNECT_INTERVAL = 30;

@Injectable({
  providedIn: 'root'
})
export class DomainDataService {

  private socket$?: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<Observable<any>>();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));;

  constructor() {
  }

  /**
   * Creates a new WebSocket subject and send it to the messages subject
   * @param cfg if true the observable will be retried.
   */
  public connect(cfg: {queryString: string, reconnect?: boolean} = { queryString: '', reconnect: false }): void {

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(cfg.queryString);
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : (o: any) => o,
        tap({
          
          error: error => console.log(error),
        }), catchError(_ => EMPTY))
      //toDO only next an observable if a new subscription was made double-check this
      this.messagesSubject$.next(messages);
    }
  }

  public submitDeliveryLocationChanged(delivery_id: string, latitude: number, longitude: number) {
    let data = {event: 'location_changed', delivery_id: delivery_id, location: {lat: latitude, lng: longitude}};
    this.sendMessage(data);
  }

  public submitDeliveryStatusChanged(delivery_id: string, status: string) {
    let data = {event: 'status_changed', delivery_id: delivery_id, status: status};
    this.sendMessage(data);
  }
  /**
   * Retry a given observable by a time span
   * @param observable the observable to be retried
   */
  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }

  close() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = undefined;
    }
  }

  sendMessage(msg: any) {
    if (this.socket$) {
      this.socket$.next(msg);
    }
  }

  /**
   * Return a custom WebSocket subject which reconnects after failure
   */
  private getNewWebSocket(queryString: string) {
    let url = queryString ? WS_ENDPOINT + '?' + queryString : WS_ENDPOINT;
    return webSocket({
      url: url,
      openObserver: {
        next: () => {
          console.log('[DataService]: connection ok');
        }
      },
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true, queryString: queryString });
        }
      },

    });
  }
}
