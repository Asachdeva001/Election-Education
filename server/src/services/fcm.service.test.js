const admin = require('firebase-admin');
const { sendDeadlineReminder } = require('./fcm.service');

const mockSend = jest.fn().mockResolvedValue('mock-message-id');

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  messaging: () => ({
    send: mockSend,
  }),
}));

describe('FCM Service', () => {
  it('should format and trigger deadline reminder successfully', async () => {
    const success = await sendDeadlineReminder('fake-token', 'General Election', 3);
    
    expect(success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      token: 'fake-token',
      notification: {
        title: 'Election Deadline Approaching!',
        body: 'The deadline for General Election is in 3 days. Ensure you are registered!'
      }
    }));
  });

  it('should format election day messages correctly', async () => {
    await sendDeadlineReminder('fake-token', 'Local Primary', 0);
    
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      notification: {
        title: 'Today is Election Day!',
        body: 'The Local Primary is today. Make sure your voice is heard at the polls!'
      }
    }));
  });
});
