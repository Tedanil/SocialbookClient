import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor(@Inject("baseSignalRUrl") private baseSignalRUrl: string) { }

  start(hubUrl: string): Promise<HubConnection> {
    hubUrl = this.baseSignalRUrl + hubUrl;

    const builder: HubConnectionBuilder = new HubConnectionBuilder();

    const hubConnection: HubConnection = builder.withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    return hubConnection.start()
      .then(() => {
          console.log("Connected");
          return hubConnection;
      })
      .catch(error => {
          console.log("Error connecting, retrying in 2 seconds...");
          return new Promise((resolve, reject) => {
              setTimeout(() => this.start(hubUrl).then(resolve).catch(reject), 2000)
          });
      });
}



async invoke(hubUrl: string, procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {
  const hubConnection = await this.start(hubUrl);
  hubConnection.invoke(procedureName, message)
    .then(successCallBack)
    .catch(errorCallBack);
}


  on(procedureName: string, callBack: (...message: any) => void) {
    if (this.hubConnection) {
      this.hubConnection.on(procedureName, callBack);
    } else {
      console.error('HubConnection is not established. You need to call start() before subscribing to a method.');
    }
  }
}
