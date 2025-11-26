import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer';
import { ChatWindowComponent } from './shared/chat-window/chat-window';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ChatWindowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('EmployeeFE');
}
