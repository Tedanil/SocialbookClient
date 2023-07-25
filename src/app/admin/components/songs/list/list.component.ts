import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Song } from 'src/app/contracts/songs/list_song';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { SongService } from 'src/app/services/common/song.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  length: number;
  pageSize: number;
  pageIndex: number;

  constructor(spinner: NgxSpinnerService,
    private songService:  SongService,
    private toastrService: CustomToastrService,
    ) {
    super(spinner)
  }


  displayedColumns: string[] = ['videoId', 'genre'];
  dataSource: MatTableDataSource<List_Song> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getSongs() {

    this.showSpinner(SpinnerType.Pacman);
    const allSongs: { totalSongCount: number;   songs: List_Song[]  } = await this.songService
      .getSongs(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5,
        () => this.hideSpinner(SpinnerType.Pacman), errorMessage => 
         this.toastrService.message(errorMessage, "hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }))
    this.dataSource = new MatTableDataSource<List_Song>(allSongs.songs);

    this.paginator.length = allSongs.totalSongCount;
    

  }


  async ngOnInit() {

    await this.getSongs();

  }

  async handlePageEvent() {

    await this.getSongs();

  }



}