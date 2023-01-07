"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setupEventHandler_1 = __importDefault(require("./setupEventHandler"));
const setupPropHandler_1 = __importDefault(require("./setupPropHandler"));
const setupExposedHandler_1 = __importDefault(require("./setupExposedHandler"));
exports.default = [setupEventHandler_1.default, setupPropHandler_1.default, setupExposedHandler_1.default];
