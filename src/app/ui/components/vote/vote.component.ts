import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SongService } from 'src/app/services/common/song.service';
import { YoutubeService } from 'src/app/services/common/youtube.service';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {
  videos = [];
  videoData = {};
  videoVotes = {};

  constructor(private youtubeService: YoutubeService, private songService: SongService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    interval(60000)
      .pipe(
        startWith(0),  // ensures that the first update happens immediately
        switchMap(() => new Promise(resolve => {
          this.songService.getVideoIds((videoIds) => {
            this.videos = this.getRandomSubarray(videoIds, 3);
            for (let video of this.videos) {
              this.youtubeService.getVideoInfo(video).subscribe((res: any) => {
                this.videoData[video] = {
                  title: res.items[0].snippet.title,
                  thumbnail: res.items[0].snippet.thumbnails.medium.url,
                };
              });
            }
            resolve(null);
          });
        }))
      )
      .subscribe();
  }

  getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

  vote(video: string) {
    if (!this.videoData[video].votes) {
      this.videoData[video].votes = 0;
    }
    this.videoData[video].votes++;
    console.log(`User voted for video: ${video}`);
  }
  
  getVotePercentage(video: string) {
    const totalVotes = Object.values(this.videoData).reduce((total: number, videoData: any) => total + (videoData.votes || 0), 0);
    return totalVotes ? Math.round((this.videoData[video].votes || 0) / Number(totalVotes) * 1000) / 1000 : 0;
  }
  
  getBackgroundGradient(percentage: number) {
    return `linear-gradient(to right, #0000ff ${percentage}%, #ffffff ${percentage}%)`;
  }
  
  
  

  
}
