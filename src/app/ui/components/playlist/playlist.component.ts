import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';



@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements AfterViewInit, OnDestroy {
  @ViewChild('player', { static: false }) playerElement: ElementRef;
  @ViewChild('playButton', { static: false }) playButton: ElementRef; // Düğmeye erişmek için
  private player: any;
  private ytEvent: any;
  private videoId = 'wuGt8wanfhE'; // İstediğiniz video ID'si ile değiştirin.

  constructor(private renderer: Renderer2) {} // Renderer2'yi enjekte et

  ngAfterViewInit() {
    
    this.init();
  }

  ngOnInit() {
    // Eğer YT henüz tanımlı değilse, YouTube Iframe API scriptini yükle
    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    // API yüklemesi tamamlandığında initPlayer() yöntemini çağır
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
  
    // Kullanıcı videoyu duraklatmaya çalıştığında, oynatmayı sürdür.
    if (this.ytEvent === window['YT'].PlayerState.PAUSED) {
      this.player.playVideo();
    }
  }

  ngOnDestroy() {
    this.player.destroy();
  }

  
}
