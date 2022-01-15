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
  showScore: boolean = false;
  music: any = new Audio('/assets/song/song.mp3');
  chart: Chart;
  notes: Note[];
  private chartService: ChartService;
  currentTime: number = 0;
  combo: number = 0;

  @ViewChild('track')
  myTrack: any;

  constructor(
    private renderer: Renderer2,
    private chartServiceParam: ChartService
  ) {
    this.chart = new Chart(0, 0, new Array);
    this.chartService = chartServiceParam;
    this.notes = [];
  }

  ngOnInit(): void {
    this.chartService.getChart().subscribe(
      (data: Chart) => {
        this.chart = data;        
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  // press space to play !
  @HostListener('document:keydown.space', ['$event'])
  startGame(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === ' ' && !this.isPlaying) {
      this.isPlaying = true;
      this.play();
    }
  }

  play() {
    if (this.isPlaying) {
      this.notes = this.readChart(this.chart);
      let songDuration = this.music.duration;
      this.music.play();
      let timer = setInterval(() => {
        this.currentTime = this.music.currentTime*1000;
        if (this.currentTime >= songDuration*1000) {
          clearInterval(timer);
          this.music.pause();
          this.music.load();
          this.isPlaying = false;
          this.currentTime = 0;
          this.combo = 0;
        }
        this.noteGeneration(this.notes, this.currentTime);
      }, 10);
    }
  }

  //jugement de notes
  judgement(classNameOfNote: string, currentTime: number) {
    let notes = document.getElementsByClassName(classNameOfNote);
    let note = null;
    if (notes.length > 0) {
      if (notes.length === 1) {
        note = notes[0];
      } else {
        note = notes[0];
      }
      let noteTime = note.id;
      let imputDifference = Math.abs(currentTime - parseInt(noteTime));
      if (imputDifference <= 62) {
        note.remove();
        this.displayJugdement('Perfect');
        this.combo += 1;
      }
      if (imputDifference > 62 && imputDifference <= 104) {
        note.remove();
        this.displayJugdement('Great');
        this.combo += 1;
      }
      if (imputDifference > 104 && imputDifference <= 145) {
        note.remove();
        this.displayJugdement('Good');
      }
      if (imputDifference > 145 && imputDifference <= 187) {
        note.remove();
        this.displayJugdement('Bad');
        this.combo = 0;
      }
    }
  }

  // génére une note
  noteGeneration(noteArray: Note[], timer: number) {
    noteArray.forEach((note, index, object) => {
      if (note.time - 1000 <= timer) {
        this.createNote(note.position, note.time);
        object.splice(index, 1);
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
  createNote(notePosition: string, noteTime: number) {
    let note = document.createElement('div');
    this.renderer.addClass(note, 'note');
    this.renderer.addClass(note, notePosition);
    note.id = noteTime.toString();
    this.renderer.appendChild(this.myTrack.nativeElement, note);
    this.noteScroll(note);
    setTimeout(() => {
      if (note.parentNode) {
        note.remove();
        this.displayJugdement('Miss');
        this.combo = 0;
      }
    }, 1188);    
  }

  displayJugdement(judgementName: string) : void{
    let lowerCaseJudgementName = judgementName.toLowerCase();
    let previousJudgement = document.getElementsByClassName('judgement');
    if (previousJudgement.length) {
      let judgementToDelete = previousJudgement[0];
      judgementToDelete.remove();
    }
    let judgementNameDiv = document.createElement('h1');
    let judgementText = document.createTextNode(judgementName);
    judgementNameDiv.appendChild(judgementText);
    this.renderer.addClass(judgementNameDiv, lowerCaseJudgementName);
    this.renderer.addClass(judgementNameDiv, 'judgement');
    this.renderer.appendChild(this.myTrack.nativeElement, judgementNameDiv);
    setTimeout(function () {
      judgementNameDiv.remove();
    }, 500);
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
    let currentTime = this.currentTime;
    event.preventDefault();
    switch (event.key) {
      case 'c':
        this.judgement('note-c', currentTime);
        break;
      case 'f':
        this.judgement('note-f', currentTime);
        break;
      case 'v':
        this.judgement('note-v', currentTime);
        break;
      case 'g':
        this.judgement('note-g', currentTime);
        break;
      case 'b':
        this.judgement('note-b', currentTime);
        break;
    }
  }
}