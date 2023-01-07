"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Documentation = void 0;
const ts_map_1 = __importDefault(require("ts-map"));
class Documentation {
    constructor(fullFilePath) {
        this.componentFullfilePath = fullFilePath;
        this.propsMap = new ts_map_1.default();
        this.eventsMap = new ts_map_1.default();
        this.slotsMap = new ts_map_1.default();
        this.methodsMap = new ts_map_1.default();
        this.exposedMap = new ts_map_1.default();
        this.originExtendsMixin = {};
        this.dataMap = new ts_map_1.default();
    }
    setOrigin(origin) {
        this.originExtendsMixin = origin.extends ? { extends: origin.extends } : {};
        this.originExtendsMixin = origin.mixin ? { mixin: origin.mixin } : {};
    }
    setDocsBlocks(docsBlocks) {
        this.docsBlocks = docsBlocks;
    }
    set(key, value) {
        this.dataMap.set(key, value);
    }
    get(key) {
        return this.dataMap.get(key);
    }
    getPropDescriptor(propName) {
        const vModelDescriptor = this.propsMap.get('v-model');
        return vModelDescriptor && vModelDescriptor.name === propName
            ? vModelDescriptor
            : this.getDescriptor(propName, this.propsMap, () => ({
                name: propName
            }));
    }
    getEventDescriptor(eventName) {
        return this.getDescriptor(eventName, this.eventsMap, () => ({
            name: eventName
        }));
    }
    getSlotDescriptor(slotName) {
        return this.getDescriptor(slotName, this.slotsMap, () => ({
            name: slotName
        }));
    }
    getMethodDescriptor(methodName) {
        return this.getDescriptor(methodName, this.methodsMap, () => ({
            name: methodName
        }));
    }
    getExposedDescriptor(exposedName) {
        return this.getDescriptor(exposedName, this.exposedMap, () => ({
            name: exposedName
        }));
    }
    toObject() {
        const props = this.getObjectFromDescriptor(this.propsMap);
        const methods = this.getObjectFromDescriptor(this.methodsMap);
        const events = this.getObjectFromDescriptor(this.eventsMap);
        const slots = this.getObjectFromDescriptor(this.slotsMap);
        const expose = this.getObjectFromDescriptor(this.exposedMap);
        const obj = {};
        this.dataMap.forEach((value, key) => {
            if (key) {
                obj[key] = value;
            }
        });
        if (this.docsBlocks) {
            obj.docsBlocks = this.docsBlocks;
        }
        return Object.assign(Object.assign({}, obj), { 
            // initialize non null params
            description: obj.description || '', tags: obj.tags || {}, 
            // set all the static properties
            exportName: obj.exportName, displayName: obj.displayName, expose,
            props,
            events,
            methods,
            slots });
    }
    getDescriptor(name, map, init) {
        let descriptor = map.get(name);
        if (!descriptor) {
            descriptor = init();
            descriptor = Object.assign(Object.assign({}, descriptor), this.originExtendsMixin);
            map.set(name, descriptor);
        }
        return descriptor;
    }
    getObjectFromDescriptor(map) {
        if (map.size > 0) {
            const obj = [];
            map.forEach((descriptor, name) => {
                if (name && descriptor) {
                    obj.push(descriptor);
                }
            });
            return obj;
        }
        else {
            return undefined;
        }
    }
}
exports.default = Documentation;
exports.Documentation = Documentation;
