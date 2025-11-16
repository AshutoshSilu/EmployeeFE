import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';


@Component({
  selector: 'app-offers',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './offers.html',
  styleUrl: './offers.scss',
})
export class Offers {
  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Coupon code ${code} copied to clipboard!`);
    }).catch(() => {
      alert(`Failed to copy code. Please copy manually: ${code}`);
    });
  }
}
