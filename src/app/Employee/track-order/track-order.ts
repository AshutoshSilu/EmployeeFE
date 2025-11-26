import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './track-order.html',
  styleUrls: ['./track-order.scss']
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  
  order = computed(() => this.orderService.getCurrentOrder()());

  canCancel = true;
  timeRemaining = 180; // 3 minutes in seconds
  private timer: any;

  ngOnInit() {
    this.startCancellationTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startCancellationTimer() {
    this.timer = setInterval(() => {
      const currentOrder = this.order();
      if (this.timeRemaining > 0 && currentOrder?.status === 'ordered') {
        this.timeRemaining--;
      } else {
        this.canCancel = false;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  cancelOrder() {
    const currentOrder = this.order();
    if (this.canCancel && currentOrder?.status === 'ordered') {
      this.orderService.cancelOrder();
      this.canCancel = false;
      clearInterval(this.timer);
    }
  }

  getStatusClass(): string {
    const currentOrder = this.order();
    return currentOrder ? `status-${currentOrder.status}` : 'status-unknown';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}