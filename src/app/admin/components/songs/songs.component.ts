import { Component, OnInit, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';
import { Song } from 'src/app/contracts/song';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor() { }

  @ViewChild(ListComponent) ListComponents: ListComponent
  
  ngOnInit(): void {
  }
  createdSong(song: Song) {
    this.ListComponents.getSongs();

  }

}
