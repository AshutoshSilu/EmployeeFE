import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header';
import { LeftPanelComponent } from '../shared/left-panel/left-panel';

@Component({
  selector: 'app-menu-page',
  imports: [CommonModule, HeaderComponent, LeftPanelComponent],
  template: `
    <app-header></app-header>
    <div class="menu-layout">
      <app-left-panel></app-left-panel>
      <div class="menu-content">
        <div class="menu-header">
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <div class="menu-items">
          <p>Menu items for {{ title }} will be displayed here.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-layout {
      display: flex;
      min-height: 100vh;
      padding-top: 60px;
    }
    
    .menu-content {
      margin-left: 280px;
      flex: 1;
      padding: 20px;
    }
    
    .menu-header {
      margin-bottom: 30px;
      
      h2 {
        color: #333;
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        font-size: 16px;
      }
    }
    
    .menu-items {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
  `]
})
export class MenuPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  title = '';
  description = '';
  
  ngOnInit() {
    this.title = this.route.snapshot.data['title'] || 'Menu';
    this.description = this.route.snapshot.data['description'] || 'Delicious food items';
  }
}