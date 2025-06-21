import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: 'your-project-id',
          clientEmail: 'your-client-email',
          privateKey: 'your-private-key'.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async sendPushNotification(deviceToken: string, title: string, body: string) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: deviceToken,
    };

    return await admin.messaging().send(message);
  }
}

// const message = {
//   notification: {
//     title: 'Order Update!',
//     body: 'Your order has been shipped',
//   },
//   token: deviceToken,
// };
// await admin.messaging().send(message);
