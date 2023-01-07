"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const propHandler_1 = __importDefault(require("./propHandler"));
const slotHandler_1 = __importDefault(require("./slotHandler"));
const eventHandler_1 = __importDefault(require("./eventHandler"));
exports.default = [slotHandler_1.default, propHandler_1.default, eventHandler_1.default];
