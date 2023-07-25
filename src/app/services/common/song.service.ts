import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Song } from 'src/app/contracts/song';
import { VideoIdAndTime } from 'src/app/contracts/videoIdAndTime';
import { List_Song } from 'src/app/contracts/songs/list_song';
import { HttpErrorResponse } from '@angular/common/http';

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

  async getSongs(page: number = 0, size: number = 5, successCallBack?: () => void,
   errorCallBack?: (errorMessage: string) => void): Promise<{totalSongCount: number;   songs: List_Song[] }> {
    const promiseData: Promise<{totalSongCount: number;   songs: List_Song[]}> = this.httpClientService.get< {totalSongCount: number;   songs: List_Song[] }>({
      controller: "songs",
      action: "getSongs",
      queryString: `page=${page}&size=${size}`
      

    },).toPromise();

    promiseData.then(d => successCallBack())
       .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
       
       
    return await promiseData;
     
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

  postVideoIds(videoIds: string[], successCallBack?: any) {
    this.httpClientService.post<string[]>({
      controller: "songs",
      action: "videoIds"
    }, videoIds)
      .subscribe(result => {
        if (successCallBack) {
          successCallBack(result);
        }
      });
  }

  updatePostVideoIds(videoIds: string[], successCallBack?: any) {
    this.httpClientService.post<string[]>({
      controller: "songs",
      action: "updateVideoIds"
    }, videoIds)
      .subscribe(result => {
        if (successCallBack) {
          successCallBack(result);
        }
      });
  }

  updateCurrentVideoId(videoIdAndTime: VideoIdAndTime, successCallBack?: any) {
    this.httpClientService.post<any>({
      controller: "songs",
      action: "updateCurrentVideoId"
    }, videoIdAndTime) // videoId and videoTime as an object
      .subscribe(result => {
        if (successCallBack) {
          successCallBack(result);
        }
      });
  }

  getCurrentVideoId(successCallBack?: any) {
    this.httpClientService.get<VideoIdAndTime>({
      controller: "songs",
      action: "getCurrentVideoId"
    })
      .subscribe(result => {
        if (successCallBack) {
          successCallBack(result);
        }
      });
  }
  



}