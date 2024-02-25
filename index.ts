import { Context, Telegraf } from 'telegraf'
import OpenAI from "openai";
import LocalSession from "telegraf-session-local";
import { config } from "dotenv";
import { Logger } from './logger.class';
config()

const bot = new Telegraf<IBotContext>(process.env.BOT_TOKEN || '');
const openai = new OpenAI({ apiKey: process.env.API_KEY || '' });
const logger = new Logger()

interface SessionData {
  last: string
};
interface IBotContext extends Context {
  session: SessionData
};

bot.use(new LocalSession({ database: 'session.json' }).middleware())
bot.start(async (ctx) => {
  try {
    logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} use /start`);
    ctx.reply('Привет')    
  } catch (error) {
    logger.error(error)
  }
})
bot.on('text', async (ctx) => {
  try {
    logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} writes ${ctx.message.text}`);
    ctx.session.last = ctx.message.text
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": `<Роль бота>. Дата и время на данный момент ${new Date().toLocaleString()}` },
        { "role": "user", "content": ctx.message?.text }
      ]
    })
    const output = completion.choices[0].message?.content
    ctx.reply(output || '', { parse_mode: 'Markdown' })    
  } catch (error) {
    logger.error(error)
  }
})
bot.launch()
logger.info('bot started')
