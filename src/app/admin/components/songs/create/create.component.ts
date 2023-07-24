import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Song } from 'src/app/contracts/song';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { SongService } from 'src/app/services/common/song.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner:NgxSpinnerService,  private songService: SongService, private toastrService: CustomToastrService) {
    super(spinner)
   }

  ngOnInit(): void {
  }
  @Output() createdSong: EventEmitter<Song> = new EventEmitter;
  create(videoId: HTMLInputElement, genre: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallElasticDot)
    const song: Song = new Song();
    song.videoId = videoId.value;
    song.genre = genre.value;

    this.songService.create(song, () => {
      this.hideSpinner(SpinnerType.BallElasticDot);
      this.toastrService.message("Ürün başarıyla eklenmiştir.", "ürün", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      this.createdSong.emit(song);
    });
  }

}
