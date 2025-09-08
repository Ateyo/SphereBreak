import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerInitials: WritableSignal<string> = signal('');

  constructor() {
    // Load initials from local storage if available
    const savedInitials = localStorage.getItem('playerInitials');
    if (savedInitials) {
      this.playerInitials.set(savedInitials);
    }
  }

  setInitials(initials: string): void {
    this.playerInitials.set(initials);
    localStorage.setItem('playerInitials', initials);
  }

  getInitials(): string {
    return this.playerInitials();
  }
}
