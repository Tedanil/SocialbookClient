import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Song } from 'src/app/contracts/song';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private httpClientService: HttpClientService) { }

  create(song: Song, successCallBack?: any) {
    this.httpClientService.post({
      controller: "songs"
    }, song)
      .subscribe(result => {
        successCallBack();
      });
  }

  getVideoIds(successCallBack?: any) {
    this.httpClientService.get<string[]>({
      controller: "songs"
    })
    .subscribe(result => {
      if (successCallBack) {
        successCallBack(result);
      }
    });
  }
  
}