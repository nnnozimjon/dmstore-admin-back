// @ts-ignore
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
});

export class TelegramController {
  static async sendTelegramImageMessage(chatId: string, image: string, message: string) {
    const bot = new TelegramBot((parsed as any)?.DUSHANBEMARKETORDERSBOT, {
      polling: false,
    });

    try {
      await bot.sendPhoto(chatId, image, { caption: message });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}
