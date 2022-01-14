import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Chart } from './shared/models/chart.model';
import { Note } from './shared/models/note.model';
import { ChartService } from './shared/services/chart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'rhythmQuest';
  isPlaying: boolean = false;
  music: any = new Audio('/assets/song/song.mp3');
  chart: Chart | undefined;
  notes: Note[];
  private chartService: ChartService;

  @ViewChild('track')
  myTrack: any;

  constructor(
    private renderer: Renderer2,
    private chartServiceParam: ChartService
  ) {
    this.chartService = chartServiceParam;
    this.notes = [];
  }

  ngOnInit(): void {

  }

  @HostListener('document:keydown.space', ['$event'])
  startGame(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === ' ' && !this.isPlaying) {
      this.isPlaying = true;
    }
    if (this.isPlaying) {
      this.chartService.getChart().subscribe(
        (data: Chart) => {
          this.chart = data;
          this.notes = this.readChart(this.chart);
        },
        (error: Error) => {
          console.log(error);
        }
      );
      this.music.play();
      const startTime = Date.now();
      let currentTime: number = 0;
      let timer = setInterval(() => {
        currentTime = Math.round(Date.now() - startTime);
        if (currentTime > 98570) {
          clearInterval(timer);
          this.music.pause();
          this.isPlaying = false;
        }
        this.noteGeneration(this.notes, currentTime);
      }, 10);
      this.onKeydownHandler(event);
    }
  }

  noteGeneration(noteArray : Note[], timer: number) {
    noteArray.forEach((note, index, object) => {
      if (note.time - 1000 <= timer) {
        this.createNote(note.position);
        object.splice(index, 1)
      }
    });
  }

  // traduit le json en chart de notes
  readChart(chartParam: Chart): Note[] {
    let delay = chartParam.delay;
    let addTime = chartParam.addTime;
    let noteStringArray = chartParam.chart;
    let noteArray = [];
    for (let i = 0; i < noteStringArray.length; i++) {
      if (noteStringArray[i] !== '00000') {
        let noteString = noteStringArray[i].split('');
        for (let j = 0; j < noteString.length; j++) {
          if (noteString[j] === '1') {
            if (j === 0) {
              noteArray.push(new Note(delay + addTime * i, 'note-c'));
            }
          }
          if (noteString[j] === '1') {
            if (j === 1) {
              noteArray.push(new Note(delay + addTime * i, 'note-f'));
            }
          }
          if (noteString[j] === '1') {
            if (j === 2) {
              noteArray.push(new Note(delay + addTime * i, 'note-v'));
            }
          }
          if (noteString[j] === '1') {
            if (j === 3) {
              noteArray.push(new Note(delay + addTime * i, 'note-g'));
            }
          }
          if (noteString[j] === '1') {
            if (j === 4) {
              noteArray.push(new Note(delay + addTime * i, 'note-b'));
            }
          }
        }
      }
    }
    return noteArray;
  }

  // notePosition = note-c note-f note-v note-g note-b
  createNote(notePosition: string) {
    const note = document.createElement('div');
    this.renderer.addClass(note, 'note');
    this.renderer.addClass(note, notePosition);
    this.renderer.appendChild(this.myTrack.nativeElement, note);
    this.noteScroll(note);
    setTimeout(function () {
      note.remove();
    }, 1200);
  }

  // fonction d'animation des notes
  noteScroll(divParam: any) {
    divParam.style.animationName = 'moveDown';
  }

  @HostListener('document:keydown.c', ['$event'])
  @HostListener('document:keydown.f', ['$event'])
  @HostListener('document:keydown.v', ['$event'])
  @HostListener('document:keydown.g', ['$event'])
  @HostListener('document:keydown.b', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case 'c':
        // this.createNote('note-c');
        break;
      case 'f':
        // this.createNote('note-f');
        break;
      case 'v':
        // this.createNote('note-v');
        break;
      case 'g':
        // this.createNote('note-g');
        break;
      case 'b':
        // this.createNote('note-b');
        break;
    }
  }
}
