import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Song } from 'src/app/contracts/song';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { SongService } from 'src/app/services/common/song.service';
import { YoutubeService } from 'src/app/services/common/youtube.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  songName: string;
  videoData = {};

  constructor(spinner:NgxSpinnerService,  private songService: SongService,
     private toastrService: CustomToastrService, private youtubeService: YoutubeService,) {
    super(spinner)
   }

  ngOnInit(): void {
  }
  @Output() createdSong: EventEmitter<Song> = new EventEmitter;
  create(videoId: HTMLInputElement, genre: HTMLInputElement) {
    if(videoId.value == "" || genre.value == "" ){
      this.hideSpinner(SpinnerType.BallElasticDot);
      this.toastrService.message("VideoId veya Genre boş olamaz!.", "hata", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return;
    }
    this.showSpinner(SpinnerType.BallElasticDot)
    const song: Song = new Song();

    this.youtubeService.getVideoInfo(videoId.value).subscribe((res: any) => {

      if(res.items.length === 0){
        this.hideSpinner(SpinnerType.BallElasticDot);
        this.toastrService.message("Geçersiz VideoId", "hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      return;
      }

      this.videoData[videoId.value] = {
        title: res.items[0].snippet.title,
        thumbnail: res.items[0].snippet.thumbnails.medium.url,
      };
    song.videoId = videoId.value;
    song.genre = genre.value;
    song.name = this.videoData[videoId.value]?.title;

    this.songService.create(song, () => {
      this.hideSpinner(SpinnerType.BallElasticDot);
      this.toastrService.message("Video başarıyla eklenmiştir.", "video", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      this.createdSong.emit(song);
      videoId.value = '';
      genre.value = '';
    });
    });

    
  }

}
