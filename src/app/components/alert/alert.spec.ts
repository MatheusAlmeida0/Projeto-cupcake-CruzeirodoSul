import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlertComponent } from './alert';
import { NotificationService, Notification } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let mockNotificationService: any;
  let notificationSubject: Subject<Notification>;

  beforeEach(async () => {
    notificationSubject = new Subject<Notification>();

    mockNotificationService = {
      notification$: notificationSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [AlertComponent, CommonModule],
      providers: [{ provide: NotificationService, useValue: mockNotificationService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Limpar timeouts
    if ((component as any).timeoutHandle) {
      clearTimeout((component as any).timeoutHandle);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no notification', () => {
    fixture.detectChanges();

    expect(component.notification).toBeNull();
  });

  it('should display notification when success message is sent', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Operation successful!',
      type: 'success',
      duration: 3000,
    });

    setTimeout(() => {
      expect(component.notification).toBeTruthy();
      expect(component.notification?.message).toBe('Operation successful!');
      expect(component.notification?.type).toBe('success');
      done();
    }, 100);
  });

  it('should display notification with danger type', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'An error occurred!',
      type: 'danger',
      duration: 5000,
    });

    setTimeout(() => {
      expect(component.notification?.type).toBe('danger');
      expect(component.notification?.message).toBe('An error occurred!');
      done();
    }, 100);
  });

  it('should display notification with warning type', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Warning message',
      type: 'warning',
      duration: 4000,
    });

    setTimeout(() => {
      expect(component.notification?.type).toBe('warning');
      done();
    }, 100);
  });

  it('should display notification with info type', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Info message',
      type: 'info',
      duration: 3000,
    });

    setTimeout(() => {
      expect(component.notification?.type).toBe('info');
      done();
    }, 100);
  });

  it('should auto-dismiss notification after duration', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'This will auto-dismiss',
      type: 'success',
      duration: 3000,
    });

    expect(component.notification).toBeTruthy();

    tick(3000);

    expect(component.notification).toBeNull();
  }));

  it('should clear notification when clearNotification is called', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Test message',
      type: 'success',
      duration: 5000,
    });

    setTimeout(() => {
      expect(component.notification).toBeTruthy();

      component.clearNotification();

      expect(component.notification).toBeNull();
      done();
    }, 100);
  });

  it('should clear previous timeout when new notification arrives', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'First notification',
      type: 'success',
      duration: 5000,
    });

    expect(component.notification?.message).toBe('First notification');

    tick(2000);

    // Send new notification before first one expires
    notificationSubject.next({
      message: 'Second notification',
      type: 'danger',
      duration: 3000,
    });

    expect(component.notification?.message).toBe('Second notification');

    // First timeout should not trigger
    tick(3000); // Wait for second notification's duration
    expect(component.notification).toBeNull();
  }));

  it('should not auto-dismiss notification without duration', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'No auto-dismiss',
      type: 'success',
    });

    tick(10000);

    expect(component.notification).toBeTruthy();
    expect(component.notification?.message).toBe('No auto-dismiss');
  }));

  it('should handle multiple consecutive notifications', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'First',
      type: 'success',
      duration: 1000,
    });

    expect(component.notification?.message).toBe('First');

    tick(1000);
    expect(component.notification).toBeNull();

    notificationSubject.next({
      message: 'Second',
      type: 'danger',
      duration: 1000,
    });

    expect(component.notification?.message).toBe('Second');

    tick(1000);
    expect(component.notification).toBeNull();
  }));

  it('should unsubscribe on component destroy', () => {
    fixture.detectChanges();

    // Após detectChanges, a subscription é criada
    const unsubscribeSpy = spyOn((component as any).notificationSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should clear timeout on destroy', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Test',
      type: 'success',
      duration: 5000,
    });

    const clearTimeoutSpy = spyOn(window, 'clearTimeout');

    component.ngOnDestroy();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  }));

  it('should render notification in template', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Rendered notification',
      type: 'success',
      duration: 3000,
    });

    setTimeout(() => {
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.alert');
      expect(alertElement).toBeTruthy();
      expect(alertElement.textContent).toContain('Rendered notification');
      expect(alertElement.classList.contains('alert-success')).toBe(true);
      done();
    }, 100);
  });

  it('should have close button in notification', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Test with close button',
      type: 'success',
      duration: 5000,
    });

    setTimeout(() => {
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.btn-close');
      expect(closeButton).toBeTruthy();
      done();
    }, 100);
  });

  it('should dismiss notification when close button is clicked', (done) => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Click to close',
      type: 'success',
      duration: 5000,
    });

    setTimeout(() => {
      fixture.detectChanges();

      expect(component.notification).toBeTruthy();

      const closeButton = fixture.nativeElement.querySelector('.btn-close');
      closeButton.click();

      fixture.detectChanges();

      expect(component.notification).toBeNull();
      done();
    }, 100);
  });

  it('should have correct CSS classes for different notification types', fakeAsync(() => {
    fixture.detectChanges();

    const testTypes: Array<'success' | 'danger' | 'warning' | 'info'> = [
      'success',
      'danger',
      'warning',
      'info',
    ];

    testTypes.forEach((type) => {
      notificationSubject.next({
        message: `Test ${type}`,
        type: type,
        duration: 1000,
      });

      tick(50);
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.alert');
      expect(alertElement).toBeTruthy();
      expect(alertElement.classList.contains(`alert-${type}`)).toBe(true);

      tick(1000);
      fixture.detectChanges();
    });
  }));

  it('should handle notification with very long message', (done) => {
    fixture.detectChanges();

    const longMessage = 'A'.repeat(500);

    notificationSubject.next({
      message: longMessage,
      type: 'success',
      duration: 3000,
    });

    setTimeout(() => {
      expect(component.notification?.message.length).toBe(500);
      expect(component.notification?.message).toBe(longMessage);
      done();
    }, 100);
  });

  it('should handle rapid successive notifications', fakeAsync(() => {
    fixture.detectChanges();

    for (let i = 0; i < 5; i++) {
      notificationSubject.next({
        message: `Message ${i}`,
        type: 'success',
        duration: 1000,
      });

      tick(200);
    }

    // Last notification should be displayed
    expect(component.notification?.message).toContain('Message');
  }));

  it('should clear timeout handle after clearing notification', fakeAsync(() => {
    fixture.detectChanges();

    notificationSubject.next({
      message: 'Test',
      type: 'success',
      duration: 5000,
    });

    expect((component as any).timeoutHandle).toBeTruthy();

    component.clearNotification();

    expect((component as any).timeoutHandle).toBeNull();
  }));

  it('should handle notification with special characters', (done) => {
    fixture.detectChanges();

    const specialMessage = 'Mensagem com caracteres especiais: @#$%&*()_+-={}[]|:;"\'<>?,./';

    notificationSubject.next({
      message: specialMessage,
      type: 'success',
      duration: 3000,
    });

    setTimeout(() => {
      expect(component.notification?.message).toBe(specialMessage);
      done();
    }, 100);
  });

  it('should preserve notification data throughout lifecycle', fakeAsync(() => {
    fixture.detectChanges();

    const testNotification: Notification = {
      message: 'Persistent message',
      type: 'warning',
      duration: 5000,
    };

    notificationSubject.next(testNotification);

    tick(2000);

    expect(component.notification).toEqual(testNotification);

    tick(3000);

    expect(component.notification).toBeNull();
  }));
});
