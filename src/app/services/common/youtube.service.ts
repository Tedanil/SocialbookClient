import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  getVideoInfo(videoId: string) {
    return this.http.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyC2eC8F6AKnTYkj4yDbl_MehUfdcJfQbn0`
    );
  }
}
