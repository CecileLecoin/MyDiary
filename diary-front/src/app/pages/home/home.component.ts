import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MoodService,
  WeeklyEmotionCount,
  WeeklyMoodCount
} from '../../services/mood.service';
import {
  NoteService,
  WordCount
} from '../../services/note.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  weekData: Array<{ day: string; label: string; value: number }> = [];
  weeklyMoodCounts: WeeklyMoodCount[] = [];
  weeklyTopEmotions: WeeklyEmotionCount[] = [];
  weeklyTopWords: WordCount[] = [];
  allTimeTopWords: WordCount[] = [];
  marshmallowImage = 'img/marshmallow not grilled.png';
  marshmallowPosition: { x: number; y: number } | null = null;
  isGrilling = false;
  maxValue = 40;
  private grillTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private moodService: MoodService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadWeeklyMoodAverages();
    this.loadWeeklyMoodStats();
    this.loadWordStats();
  }

  loadWeeklyMoodAverages() {
    this.moodService.getWeeklyMoodAverages()
      .subscribe((data) => {
        this.weekData = data;
      });
  }

  loadWordStats() {
    this.noteService.getWordStats()
      .subscribe((data) => {
        this.weeklyTopWords = data.weeklyTop;
        this.allTimeTopWords = data.allTimeTop;
      });
  }

  loadWeeklyMoodStats() {
    this.moodService.getWeeklyStats()
      .subscribe((data) => {
        this.weeklyMoodCounts = data.moodCounts;
        this.weeklyTopEmotions = data.topEmotions;
      });
  }

  getBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
  }

  getBarY(value: number): number {
    return 180 - this.getBarHeight(value);
  }

  getMoodLabel(value: number): string {
    if (value >= 40) {
      return 'Super';
    }

    if (value >= 30) {
      return 'Bien';
    }

    if (value >= 20) {
      return 'Mouais';
    }

    if (value >= 10) {
      return 'Mauvais';
    }

    return 'Horrible';
  }

  getMoodColor(value: number): string {
    if (value >= 40) {
      return '#7e57c2';
    }

    if (value >= 30) {
      return '#8e71d8';
    }

    if (value >= 20) {
      return '#f5a7c5';
    }

    if (value >= 10) {
      return '#ffb38a';
    }

    return '#ff7f7f';
  }

  onMarshmallowDragStart(event: DragEvent) {
    if (!event.dataTransfer) {
      return;
    }

    event.dataTransfer.setData('text/plain', 'marshmallow');
    event.dataTransfer.effectAllowed = 'move';
  }

  resetMarshmallow(): void {
    if (this.grillTimer) {
      clearTimeout(this.grillTimer);
      this.grillTimer = null;
    }

    this.marshmallowImage = 'img/marshmallow not grilled.png';
    this.marshmallowPosition = null;
    this.isGrilling = false;
  }

  onGrillDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onGrillDrop(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer) {
      return;
    }

    const payload = event.dataTransfer.getData('text/plain');

    if (payload !== 'marshmallow') {
      return;
    }

    this.marshmallowPosition = {
      x: event.clientX,
      y: event.clientY
    };

    if (this.grillTimer) {
      clearTimeout(this.grillTimer);
    }

    this.isGrilling = true;
    this.grillTimer = setTimeout(() => {
      this.marshmallowImage = 'img/marshmallow grilled.png';
      this.isGrilling = false;
    }, 3000);
  }
}
