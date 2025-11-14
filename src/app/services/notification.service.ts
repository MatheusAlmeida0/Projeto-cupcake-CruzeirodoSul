import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Interface para definir o formato da nossa notificação
export interface Notification {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info'; // Tipos de alert do Bootstrap
  duration?: number; // Opcional: tempo em ms para fechar automaticamente
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();

  notification$ = this.notificationSubject.asObservable();

  constructor() {}

  showSuccess(message: string, duration: number = 3000): void {
    this.notificationSubject.next({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 5000): void {
    this.notificationSubject.next({ message, type: 'danger', duration });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.notificationSubject.next({ message, type: 'warning', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.notificationSubject.next({ message, type: 'info', duration });
  }
}
