import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-footer.html',
  styleUrls: ['./customer-footer.scss']
})
export class CustomerFooterComponent {
  currentYear = new Date().getFullYear();
}