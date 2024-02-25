"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const openai_1 = __importDefault(require("openai"));
const telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
const dotenv_1 = require("dotenv");
const logger_class_1 = require("./logger.class");
(0, dotenv_1.config)();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN || '');
const openai = new openai_1.default({ apiKey: process.env.API_KEY || '' });
const logger = new logger_class_1.Logger();
;
;
bot.use(new telegraf_session_local_1.default({ database: 'session.json' }).middleware());
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ctx.reply('Welcome');
    }
    catch (error) {
        logger.error(error);
    }
}));
bot.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        ctx.session.last = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
        const completion = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { "role": "system", "content": `ты кулинарный ассистент отвечай пожалуйста только на вопросы связанные с кулинарией Дата и время на данный момент ${new Date().toLocaleString()}` },
                { "role": "user", "content": (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text }
            ]
        });
        const output = (_c = completion.choices[0].message) === null || _c === void 0 ? void 0 : _c.content;
        ctx.reply(output || '', { parse_mode: 'Markdown' });
    }
    catch (error) {
        logger.error(error);
    }
}));
bot.launch();
logger.info('bot started');
