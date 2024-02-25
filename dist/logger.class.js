"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `\x1b[90m[${hours}:${minutes}:${seconds}]\x1b[0m`; // Серый цвет для времени
    }
    static message(level, message, color) {
        const levelColor = color;
        console.log(`${Logger.getCurrentTime()}${levelColor} [${level}]`, message, '\x1b[37m');
    }
    log(message) {
        Logger.message('LOG', message, '\x1b[37m'); // Белый цвет для LOG
    }
    debug(message) {
        Logger.message('DEBUG', message, '\x1b[32m'); // Зеленый цвет для DEBUG
    }
    info(message) {
        Logger.message('INFO', message, '\x1b[32m'); // Зеленый цвет для INFO
    }
    warn(message) {
        Logger.message('WARN', message, '\x1b[33m'); // Желтый цвет для WARN
    }
    error(error) {
        Logger.message('ERROR', error, '\x1b[31m');
    }
}
exports.Logger = Logger;
