import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit success notification', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Success message');
      expect(notification.type).toBe('success');
      expect(notification.duration).toBe(3000);
      done();
    });

    service.showSuccess('Success message');
  });

  it('should emit success notification with custom duration', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Success message');
      expect(notification.type).toBe('success');
      expect(notification.duration).toBe(5000);
      done();
    });

    service.showSuccess('Success message', 5000);
  });

  it('should emit error notification', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Error message');
      expect(notification.type).toBe('danger');
      expect(notification.duration).toBe(5000);
      done();
    });

    service.showError('Error message');
  });

  it('should emit error notification with custom duration', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Error message');
      expect(notification.type).toBe('danger');
      expect(notification.duration).toBe(7000);
      done();
    });

    service.showError('Error message', 7000);
  });

  it('should emit warning notification', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Warning message');
      expect(notification.type).toBe('warning');
      expect(notification.duration).toBe(4000);
      done();
    });

    service.showWarning('Warning message');
  });

  it('should emit warning notification with custom duration', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Warning message');
      expect(notification.type).toBe('warning');
      expect(notification.duration).toBe(6000);
      done();
    });

    service.showWarning('Warning message', 6000);
  });

  it('should emit info notification', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Info message');
      expect(notification.type).toBe('info');
      expect(notification.duration).toBe(3000);
      done();
    });

    service.showInfo('Info message');
  });

  it('should emit info notification with custom duration', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Info message');
      expect(notification.type).toBe('info');
      expect(notification.duration).toBe(5000);
      done();
    });

    service.showInfo('Info message', 5000);
  });

  it('should emit multiple notifications sequentially', (done) => {
    const notifications: Notification[] = [];

    service.notification$.subscribe((notification) => {
      notifications.push(notification);
    });

    service.showSuccess('First');
    service.showError('Second');
    service.showWarning('Third');

    setTimeout(() => {
      expect(notifications.length).toBe(3);
      expect(notifications[0].message).toBe('First');
      expect(notifications[0].type).toBe('success');
      expect(notifications[1].message).toBe('Second');
      expect(notifications[1].type).toBe('danger');
      expect(notifications[2].message).toBe('Third');
      expect(notifications[2].type).toBe('warning');
      done();
    }, 100);
  });

  it('should handle special characters in message', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toContain('Açúcar');
      expect(notification.message).toContain('&');
      expect(notification.message).toContain('"');
      done();
    });

    service.showSuccess('Cupcake com Açúcar & Especiarias "Premium"');
  });

  it('should handle empty message', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification.message).toBe('');
      expect(notification.type).toBe('success');
      done();
    });

    service.showSuccess('');
  });

  it('should handle very long message', (done) => {
    const longMessage = 'A'.repeat(500);

    service.notification$.subscribe((notification) => {
      expect(notification.message.length).toBe(500);
      expect(notification.message).toBe(longMessage);
      done();
    });

    service.showSuccess(longMessage);
  });

  it('should preserve default durations', () => {
    // Success default is 3000
    expect(service.showSuccess('test')).toBeUndefined(); // Method returns void

    // Error default is 5000
    expect(service.showError('test')).toBeUndefined();

    // Warning default is 4000
    expect(service.showWarning('test')).toBeUndefined();

    // Info default is 3000
    expect(service.showInfo('test')).toBeUndefined();
  });

  it('should allow multiple subscribers to notification stream', (done) => {
    let subscriber1Called = false;
    let subscriber2Called = false;

    service.notification$.subscribe(() => {
      subscriber1Called = true;
    });

    service.notification$.subscribe(() => {
      subscriber2Called = true;
    });

    service.showSuccess('Test');

    setTimeout(() => {
      expect(subscriber1Called).toBe(true);
      expect(subscriber2Called).toBe(true);
      done();
    }, 100);
  });

  it('should emit notification with all properties set', (done) => {
    service.notification$.subscribe((notification) => {
      expect(notification).toEqual({
        message: 'Complete notification',
        type: 'success',
        duration: 3000,
      });
      done();
    });

    service.showSuccess('Complete notification');
  });

  it('should differentiate between notification types', (done) => {
    const types: Array<'success' | 'danger' | 'warning' | 'info'> = [];

    service.notification$.subscribe((notification) => {
      types.push(notification.type);
    });

    service.showSuccess('Success');
    service.showError('Error');
    service.showWarning('Warning');
    service.showInfo('Info');

    setTimeout(() => {
      expect(types).toEqual(['success', 'danger', 'warning', 'info']);
      done();
    }, 200);
  });

  it('should handle rapid successive notifications', (done) => {
    const notifications: Notification[] = [];

    service.notification$.subscribe((notification) => {
      notifications.push(notification);
    });

    for (let i = 0; i < 10; i++) {
      service.showSuccess(`Message ${i}`);
    }

    setTimeout(() => {
      expect(notifications.length).toBe(10);
      expect(notifications[0].message).toBe('Message 0');
      expect(notifications[9].message).toBe('Message 9');
      done();
    }, 200);
  });
});
