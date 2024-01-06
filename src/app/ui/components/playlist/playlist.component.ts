import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { DEFAULTS, NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { interval, startWith, switchMap } from 'rxjs';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { Song } from 'src/app/contracts/song';
import { User_Response } from 'src/app/contracts/users/user_response';
import { VideoIdAndTime } from 'src/app/contracts/videoIdAndTime';
import { AuthService } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { SignalRService } from 'src/app/services/common/signalr.service';
import { SongService } from 'src/app/services/common/song.service';
import { UserService } from 'src/app/services/common/user.service';
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
  private videoId = '5OeoVyUOorY'; // İstediğiniz video ID'si ile değiştirin.
  private videoDuration: number;
  videos = [];
  videoData = {};
  videoVotes = {};
  private timer: any;
  public disableVote = false;
  public messages: string[] = [];
  private done: boolean = false;
  private seekTime: number = 0;
  private currentVideoState = {
    videoId: null,
    isPlaying: false,
    startTime: null,
  };
  currentUser: User_Response;



  constructor(private renderer: Renderer2, spinner: NgxSpinnerService, private songService: SongService,
    private toastrService: CustomToastrService, private youtubeService: YoutubeService, private cdRef: ChangeDetectorRef,
    private signalRService: SignalRService, private userService: UserService, public authService: AuthService) {
    authService.identityCheck();

    super(spinner)
  } // Renderer2'yi enjekte et

  ngAfterViewInit() {

    this.init();
  }

  async ngOnInit() {
    this.songService.getCurrentVideoId((response) => {
      this.videoId = response.videoId;
      this.videoDuration = parseFloat(response.videoTime);

    });
    this.listenForVoteListUpdates();
    const token: string = localStorage.getItem("refreshToken");
    this.currentUser = await this.userService.getUserByToken(token);
    console.log(this.currentUser);
    this.loadVideoIds();
     this.songService.getVideoIds((response) => {
       this.videos = response.videoIds;


         for (let video of this.videos) {
           this.youtubeService.getVideoInfo(video).subscribe((res: any) => {
             this.videoData[video] = {
               title: res.items[0].snippet.title,
               thumbnail: res.items[0].snippet.thumbnails.medium.url,
             };
             // her bir video bilgisi güncellendiğinde, oylama listesini sunucuda güncelle
           });
         }


     });

    this.listenForMessages();
    //this.listenForVideoIds();


    //this.listenForVoteListUpdates(); // oylama listesi güncellemelerini dinle

    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window['onYouTubeIframeAPIReady'] = () => {
      this.init();
    };

    this.listenForVideoStateUpdates();



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
    // videoDuration string to number
    const startSeconds = Math.round(this.videoDuration);

    this.player = new window['YT'].Player(this.playerElement.nativeElement, {
      videoId: this.videoId,
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),
      },
      playerVars: {
        'autoplay': 1,
        'controls': 0, // Disable controls.
        'disablekb': 1, // Disable keyboard controls.
        'modestbranding': 1, // Hide YouTube logo.
        'rel': 0,
        'showinfo': 0, // Hide video title and uploader info.
        'start': startSeconds
      }
    });


  }


  async onPlayerStateChange(event) {
    this.ytEvent = event.data;

    const isPlaying = this.ytEvent === window['YT'].PlayerState.PLAYING;
    const isPaused = this.ytEvent === window['YT'].PlayerState.PAUSED;
    const isEnded = this.ytEvent === window['YT'].PlayerState.ENDED;

    if (isPlaying) {

      this.videoDuration = this.player.getDuration();
      this.timer = setInterval(() => {
        const time = this.player.getCurrentTime();
        if (this.videoDuration - time <= 10) {
          clearInterval(this.timer);
          this.disableVote = true;
        }
      }, 1000);
      // Update the video state on the server

    }
    else if (isPaused || isEnded) {
      clearInterval(this.timer);
    }




    this.updateVideoStateOnServer(this.videoId, isPlaying);




    if (isEnded) {
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
           this.updateVoteListOnServer(video);
         }
         this.player.loadVideoById(this.videoId); // Bu satırı değiştirdik


         this.songService.getVideoIds((response) => {
           let videoIds = response.videoIds;
           this.videos = this.getRandomSubarray(videoIds, 3);
           let loadedVideos = 0; // Keep track of how many videos have loaded
           this.userService.updateAllVoteCounts();
           this.userService.getUserByToken(token);

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



           this.youtubeService.getVideoInfoWithContentDetails(this.videoId).subscribe((res: any) => {
            console.log("HAHAHAHAHHAHA");
             console.log(res);
             let duration = res.items[0].contentDetails.duration; // Duration bilgisi burada alınıyor
             let videoDurationInSeconds = this.convertDurationToSeconds(duration); // Duration saniyeye çevriliyor
             let videoIdAndTime = new VideoIdAndTime();
            videoIdAndTime.videoId = this.videoId;
             videoIdAndTime.videoTime = videoDurationInSeconds.toString();


              this.songService.updateCurrentVideoId(videoIdAndTime, (response) => {

              });
           });





         });





       }


    }
    const token: string = localStorage.getItem("refreshToken");
    this.currentUser = await this.userService.getUserByToken(token);

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

  async vote(video: string) {
    if (!this.videoData[video].votes) {
      this.videoData[video].votes = 0;
    }
    this.videoData[video].votes++;
    await this.userService.updateUserInfo(this.currentUser.userId);
    console.log(`User voted for video: ${video}`);
    this.updateVoteListOnServer(video);
    this.cdRef.detectChanges();
    const token: string = localStorage.getItem("refreshToken");
    this.currentUser = await this.userService.getUserByToken(token);
  }


  getVotePercentage(video: string) {
    const totalVotes = Object.values(this.videoData).reduce((total: number, videoData: any) => total + (videoData.votes || 0), 0);
    return totalVotes ? Math.round((this.videoData[video].votes || 0) / Number(totalVotes) * 1000) / 1000 : 0;
  }

  getBackgroundGradient(percentage: number) {
    return `linear-gradient(to right, #0000ff ${percentage}%, #ffffff ${percentage}%)`;
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

  // async listenForVideoIds() {
  //   try {
  //     const hubConnection = await this.signalRService.start(HubUrls.VideoIdHub);
  //     hubConnection.on(ReceiveFunctions.VideoIdSent, (videoId) => {
  //       this.videoId = videoId;
  //       for (let video of this.videos) {
  //         this.videoData[video].votes = 0;
  //         this.updateVoteListOnServer(video);
  //       }

  //       this.player.loadVideoById(this.videoId);
  //       //this.userService.updateAllVoteCounts();

  //       this.loadVideoIds();


  //     });
  //   } catch (error) {
  //     console.log('An error occurred while starting the connection or setting up message listening: ', error);
  //   }
  // }

  async updateVoteListOnServer(video: string) {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.VoteHub);
      console.log("Connected");
      await hubConnection.invoke("UpdateVoteList", video, this.videoData[video]);
      console.log('Vote list sent');
    } catch (error) {
      console.log('An error occurred while starting the connection or sending the vote list: ', error);
    }
  }



  async listenForVoteListUpdates() {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.VoteHub);
      hubConnection.on(ReceiveFunctions.VoteListUpdated, (voteUpdate) => {
        console.log(voteUpdate);
        if (voteUpdate.videoId && voteUpdate.videoData) {
          this.videoData[voteUpdate.videoId].votes = voteUpdate.videoData.votes;
          this.cdRef.detectChanges();
        }
      });
    } catch (error) {
      console.log('An error occurred while starting the connection or setting up vote list listening: ', error);
    }
  }

  async updateVideoStateOnServer(videoId: string, isPlaying: boolean) {
    try {
      const hubConnection = await this.signalRService.start(HubUrls.PlayerHub);
      console.log("Connected");
      await hubConnection.invoke("PlayVideo", videoId, isPlaying);
      console.log('Video state sent');
    } catch (error) {
      console.log('An error occurred while starting the connection or sending the video state: ', error);
    }
  }

  private hubConnection: any;
  async listenForVideoStateUpdates() {
    if (!this.hubConnection) {
      try {
        this.hubConnection = await this.signalRService.start(HubUrls.PlayerHub);
        this.hubConnection.on(ReceiveFunctions.VideoStateUpdated, (videoState) => {
          if (!videoState || !videoState.videoId || videoState.isPlaying === undefined || !videoState.startTime) {
            console.error('Invalid videoState received: ', videoState);
            return;
          }
          console.log("aNNANANANAN");


          console.log(videoState);
          if (videoState.videoId !== this.currentVideoState.videoId ||
            videoState.isPlaying !== this.currentVideoState.isPlaying ||
            videoState.startTime !== this.currentVideoState.startTime) {
            //this.startVideoPlayback(videoState.videoId, videoState.startTime);
            //this.player.loadVideoById(videoState.videoId);

          }
        });
      }
      catch (error) {
        console.log('An error occurred while starting the connection or setting up video state listening: ', error);
      }
    }

  }

  startVideoPlayback(videoId: string, startTime: Date) {
    this.done = false;
    this.seekTime = 0;
    const videoPlayer = this.player;

    videoPlayer.loadVideoById(videoId);

    const currentTime = new Date();
    const timeDifferenceInSeconds = (currentTime.getTime() - new Date(startTime).getTime()) / 1000;

    this.currentVideoState = {
      videoId: videoId,
      isPlaying: true,
      startTime: startTime,
    };
    this.seekTime = timeDifferenceInSeconds > 0 ? timeDifferenceInSeconds : 0;
    this.done = false;

    videoPlayer.addEventListener('onStateChange', (event) => {
      if (event.data == window['YT'].PlayerState.PLAYING && !this.done) {
        videoPlayer.seekTo(this.seekTime, true);
        this.done = true;
      }
    });
  }

  convertDurationToSeconds(duration: string): number {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = parseInt((match[1] || '').replace(/\D/g, ''), 10) || 0;
    let minutes = parseInt((match[2] || '').replace(/\D/g, ''), 10) || 0;
    let seconds = parseInt((match[3] || '').replace(/\D/g, ''), 10) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

   async loadVideoIds() {
     this.songService.getVideoIds((response) => {
       this.videos = response.videoIds;

       for (let video of this.videos) {

         this.loadVideoData(video);
       }
     });
   }

   async loadVideoData(videoId: string) {
     this.youtubeService.getVideoInfo(videoId).subscribe((res: any) => {
       this.videoData[videoId] = {
         title: res.items[0].snippet.title,
         thumbnail: res.items[0].snippet.thumbnails.medium.url,
         votes: 0 // initially set votes to 0
       };

       // Then update the votes value from the server
       this.songService.getSongVideoVotes(videoId, (votes) => {
         // if votes is undefined or null, keep it as 0
         this.videoData[videoId].votes = votes || 0;
       });
     });

     const token: string = localStorage.getItem("refreshToken");
     this.userService.getUserByToken(token);
   }













}
