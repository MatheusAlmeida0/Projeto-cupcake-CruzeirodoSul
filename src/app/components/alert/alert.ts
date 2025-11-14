import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service'; // Ajuste o caminho
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf

@Component({
  selector: 'app-alert',
  standalone: true, // Se for um standalone component
  imports: [CommonModule], // Adicionar CommonModule aqui se standalone
  template: `
    <div
      *ngIf="notification"
      class="alert alert-{{ notification.type }} alert-dismissible fade show fixed-top-right"
      role="alert"
    >
      {{ notification.message }}
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="clearNotification()"
      ></button>
    </div>
  `,
  styles: `
    .fixed-top-right {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050; /* Z-index alto para ficar acima de outros elementos */
      min-width: 300px;
      max-width: 90%;
    }
  `,
})
export class AlertComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  private notificationSubscription!: Subscription;
  private timeoutHandle: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notification$.subscribe(
      (notification) => {
        // Limpa qualquer timeout anterior para nova notificação
        this.clearNotification();

        this.notification = notification;
        if (notification.duration) {
          this.timeoutHandle = setTimeout(() => {
            this.clearNotification();
          }, notification.duration);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    this.clearNotification();
  }

  clearNotification(): void {
    this.notification = null;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }
}
