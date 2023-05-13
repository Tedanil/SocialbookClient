import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { interval, startWith, switchMap } from 'rxjs';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { Song } from 'src/app/contracts/song';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { SignalRService } from 'src/app/services/common/signalr.service';
import { SongService } from 'src/app/services/common/song.service';
import { YoutubeService } from 'src/app/services/common/youtube.service';



@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('player', { static: false }) playerElement: ElementRef;
  @ViewChild('playButton', { static: false }) playButton: ElementRef; // Düğmeye erişmek için
  private player: any;
  private ytEvent: any;
  private videoId = 'X7eklUJ9eb8'; // İstediğiniz video ID'si ile değiştirin.
  videos = [];
  videoData = {};
  videoVotes = {};
  private videoDuration: number;
  private timer: any;
  public disableVote = false;
  public messages: string[] = [];


  constructor(private renderer: Renderer2, spinner: NgxSpinnerService, private songService: SongService,
    private toastrService: CustomToastrService, private youtubeService: YoutubeService, private cdRef: ChangeDetectorRef,
    private signalRService: SignalRService) {
    super(spinner)
  } // Renderer2'yi enjekte et

  ngAfterViewInit() {

    this.init();
  }

  async ngOnInit() {
    this.songService.getVideoIds((videoIds) => {
      this.videos = this.getRandomSubarray(videoIds, 3);
      this.songService.postVideoIds(this.videos, (response) => {
        // API'dan dönen cevapla ilgili işlemler
        this.videos = response;
        for (let video of this.videos) {
          this.youtubeService.getVideoInfo(video).subscribe((res: any) => {
            this.videoData[video] = {
              title: res.items[0].snippet.title,
              thumbnail: res.items[0].snippet.thumbnails.medium.url,
            };
            this.updateVoteListOnServer(); // her bir video bilgisi güncellendiğinde, oylama listesini sunucuda güncelle
          });
        }
      });

    });

    this.listenForMessages();
    //this.listenForVoteListUpdates(); // oylama listesi güncellemelerini dinle

    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window['onYouTubeIframeAPIReady'] = () => {
      this.init();
    };
  }



  init() {
    if (window['YT']) {
      this.startVideo();

    } else {
      window['onYouTubeIframeAPIReady'] = () => {

        this.startVideo();
      };
    }
  }

  startVideo() {
    this.player = new window['YT'].Player(this.playerElement.nativeElement, {
      videoId: this.videoId,
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),

      },
      playerVars: {
        'autoplay': 1,
        'controls': 0, // Kontrolleri devre dışı bırakın.
        'disablekb': 1, // Klavye kontrollerini devre dışı bırakın.
        'modestbranding': 1, // YouTube logosunu gizleyin.
        'rel': 0,
        'showinfo': 0 // Video başlığı ve yükleyici bilgilerini gizleyin.

      }
    });
  }

  onPlayerStateChange(event) {
    this.ytEvent = event.data;

    if (this.ytEvent === window['YT'].PlayerState.PLAYING) {
      this.videoDuration = this.player.getDuration();
      this.timer = setInterval(() => {
        const time = this.player.getCurrentTime();
        if (this.videoDuration - time <= 10) {
          clearInterval(this.timer);
          this.disableVote = true;
        }
      }, 1000);
    }

    if (this.ytEvent === window['YT'].PlayerState.PAUSED) {
      clearInterval(this.timer);
    }

    if (this.ytEvent === window['YT'].PlayerState.ENDED) {
      clearInterval(this.timer);
      this.disableVote = true;
      let maxVotes = -1;
      let nextVideoId: string;
      for (const video of this.videos) {
        const votes = this.videoData[video]?.votes || 0;
        if (votes > maxVotes) {
          maxVotes = votes;
          nextVideoId = video;
        }
      }

      if (nextVideoId) {
        this.videoId = nextVideoId;
        for (let video of this.videos) {
          this.videoData[video].votes = 0;
        }
        this.player.loadVideoById(this.videoId); // Bu satırı değiştirdik

        this.songService.getVideoIds((videoIds) => {
          this.videos = this.getRandomSubarray(videoIds, 3);
          let loadedVideos = 0; // Keep track of how many videos have loaded
          this.songService.updatePostVideoIds(this.videos, (response) => {
            this.videos = response;
            for (let video of this.videos) {
              this.youtubeService.getVideoInfo(video).subscribe((res: any) => {
                this.videoData[video] = {
                  title: res.items[0].snippet.title,
                  thumbnail: res.items[0].snippet.thumbnails.medium.url,
                  votes: 0 // initialize votes to 0
                };
                loadedVideos++;
                if (loadedVideos === this.videos.length) {
                  // Only call detectChanges() after all videos have loaded
                  this.cdRef.detectChanges();
                }
              });
            }
          });

        });
      }

    }
  }



  ngOnDestroy() {
    this.player.destroy();
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
    this.cdRef.detectChanges();  // Add this line
  }

  getVotePercentage(video: string) {
    const totalVotes = Object.values(this.videoData).reduce((total: number, videoData: any) => total + (videoData.votes || 0), 0);
    return totalVotes ? Math.round((this.videoData[video].votes || 0) / Number(totalVotes) * 1000) / 1000 : 0;
  }

  getBackgroundGradient(percentage: number) {
    return `linear-gradient(to right, #0000ff ${percentage}%, #ffffff ${percentage}%)`;
  }

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
    });
  }

  async sendMessage(event: Event, message: string) {
    event.preventDefault();
    if (!message) {
      return;
    }

    try {
      const hubConnection = await this.signalRService.start(HubUrls.MessageHub);
      await hubConnection.invoke("SendMessage", message);
      console.log('Message sent');
    } catch (error) {
      console.log('An error occurred while starting the connection or sending the message: ', error);
    }
  }

  async listenForMessages() {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.MessageHub);
      hubConnection.on(ReceiveFunctions.MessageSent, (message) => {
        this.messages.push(message); // here, instead of showing a toast notification, we're adding the message to the array
      });
    } catch (error) {
      console.log('An error occurred while starting the connection or setting up message listening: ', error);
    }
  }

  async updateVoteListOnServer() {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.VoteHub);
      console.log("BAĞLANDIK AMK");
      await hubConnection.invoke("UpdateVoteList", this.videos, this.videoData);
      console.log('Vote list sent');
    } catch (error) {
      console.log('An error occurred while starting the connection or sending the vote list: ', error);
    }
  }

  async listenForVoteListUpdates() {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.VoteHub);
      hubConnection.on(ReceiveFunctions.VoteListUpdated, (voteList) => {
        console.log(voteList);
        this.videos = voteList.videos;
        this.videoData = voteList.videoData;
        this.cdRef.detectChanges();
      });



    } catch (error) {
      console.log('An error occurred while starting the connection or setting up vote list listening: ', error);
    }
  }






}
