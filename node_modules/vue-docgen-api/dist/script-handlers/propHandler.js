"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.extractValuesFromTags = exports.describeDefault = exports.describeRequired = exports.getValuesFromTypeAnnotation = exports.getTypeFromTypePath = exports.describeType = exports.describePropsFromValue = exports.getRawValueParsedFromFunctionsBlockStatementNode = void 0;
const bt = __importStar(require("@babel/types"));
const recast_1 = require("recast");
const getDocblock_1 = __importDefault(require("../utils/getDocblock"));
const getDoclets_1 = __importDefault(require("../utils/getDoclets"));
const transformTagsIntoObject_1 = __importDefault(require("../utils/transformTagsIntoObject"));
const getPropsFilter_1 = __importDefault(require("../utils/getPropsFilter"));
const getTemplateExpressionAST_1 = __importDefault(require("../utils/getTemplateExpressionAST"));
const parseValidator_1 = __importDefault(require("./utils/parseValidator"));
function getRawValueParsedFromFunctionsBlockStatementNode(blockStatementNode) {
    const { body } = blockStatementNode;
    // if there is more than a return statement in the body,
    // we cannot resolve the new object, we let the function display as a function
    if (body.length !== 1 || !bt.isReturnStatement(body[0])) {
        return null;
    }
    const [ret] = body;
    return ret.argument ? (0, recast_1.print)(ret.argument).code : null;
}
exports.getRawValueParsedFromFunctionsBlockStatementNode = getRawValueParsedFromFunctionsBlockStatementNode;
/**
 * Extract props information form an object-style VueJs component
 * @param documentation
 * @param path
 */
function propHandler(documentation, path, ast, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bt.isObjectExpression(path.node)) {
            const propsPath = path
                .get('properties')
                .filter((p) => bt.isObjectProperty(p.node) && (0, getPropsFilter_1.default)('props')(p));
            // if no prop return
            if (!propsPath.length) {
                return Promise.resolve();
            }
            const modelPropertyName = getModelPropName(path);
            const propsValuePath = propsPath[0].get('value');
            yield describePropsFromValue(documentation, propsValuePath, ast, opt, modelPropertyName);
        }
    });
}
exports.default = propHandler;
function describePropsFromValue(documentation, propsValuePath, ast, opt, modelPropertyName = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bt.isObjectExpression(propsValuePath.node)) {
            const objProp = propsValuePath.get('properties');
            // filter non object properties
            const objPropFiltered = objProp.filter((p) => bt.isProperty(p.node));
            yield Promise.all(objPropFiltered.map((prop) => __awaiter(this, void 0, void 0, function* () {
                const propNode = prop.node;
                // description
                const docBlock = (0, getDocblock_1.default)(prop);
                const jsDoc = docBlock ? (0, getDoclets_1.default)(docBlock) : { description: '', tags: [] };
                const jsDocTags = jsDoc.tags ? jsDoc.tags : [];
                // if it's the v-model describe it only as such
                const propertyName = bt.isIdentifier(propNode.key)
                    ? propNode.key.name
                    : bt.isStringLiteral(propNode.key)
                        ? propNode.key.value
                        : null;
                if (!propertyName) {
                    return;
                }
                const isPropertyModel = jsDocTags.some(t => t.title === 'model') || propertyName === modelPropertyName;
                const propName = isPropertyModel ? 'v-model' : propertyName;
                const propDescriptor = documentation.getPropDescriptor(propName);
                const propValuePath = prop.get('value');
                if (jsDoc.description) {
                    propDescriptor.description = jsDoc.description;
                }
                if (jsDocTags.length) {
                    propDescriptor.tags = (0, transformTagsIntoObject_1.default)(jsDocTags);
                }
                extractValuesFromTags(propDescriptor);
                if (bt.isArrayExpression(propValuePath.node) || bt.isIdentifier(propValuePath.node)) {
                    // if it's an immediately typed property, resolve its type immediately
                    propDescriptor.type = getTypeFromTypePath(propValuePath);
                }
                else if (bt.isObjectExpression(propValuePath.node)) {
                    // standard default + type + required
                    const propPropertiesPath = propValuePath
                        .get('properties')
                        .filter((p) => bt.isObjectProperty(p.node) || bt.isObjectMethod(p.node));
                    // type
                    const literalType = describeType(propPropertiesPath, propDescriptor);
                    // required
                    describeRequired(propPropertiesPath, propDescriptor);
                    // default
                    describeDefault(propPropertiesPath, propDescriptor, literalType || '');
                    // validator => values
                    yield describeValues(propPropertiesPath, propDescriptor, ast, opt);
                }
                else if (bt.isTSAsExpression(propValuePath.node)) {
                    const propValuePathExpression = propValuePath.get('expression');
                    if (bt.isObjectExpression(propValuePathExpression.node)) {
                        // standard default + type + required with TS as annotation
                        const propPropertiesPath = propValuePathExpression
                            .get('properties')
                            .filter((p) => bt.isObjectProperty(p.node));
                        // type and values
                        describeTypeAndValuesFromPath(propValuePath, propDescriptor);
                        // required
                        describeRequired(propPropertiesPath, propDescriptor);
                        // default
                        describeDefault(propPropertiesPath, propDescriptor, (propDescriptor.type && propDescriptor.type.name) || '');
                    }
                    else if (bt.isIdentifier(propValuePathExpression.node)) {
                        describeTypeAndValuesFromPath(propValuePath, propDescriptor);
                    }
                }
                else {
                    // in any other case, just display the code for the typing
                    propDescriptor.type = {
                        name: (0, recast_1.print)(prop.get('value')).code,
                        func: true
                    };
                }
            })));
        }
        else if (bt.isArrayExpression(propsValuePath.node)) {
            propsValuePath
                .get('elements')
                .filter((e) => bt.isStringLiteral(e.node))
                .forEach((e) => {
                const propDescriptor = documentation.getPropDescriptor(e.node.value);
                propDescriptor.type = { name: 'undefined' };
            });
        }
    });
}
exports.describePropsFromValue = describePropsFromValue;
/**
 * Deal with the description of the type
 * @param propPropertiesPath
 * @param propDescriptor
 * @returns the unaltered type member of the prop object
 */
function describeType(propPropertiesPath, propDescriptor) {
    const typeArray = propPropertiesPath.filter((0, getPropsFilter_1.default)('type'));
    if (propDescriptor.tags && propDescriptor.tags.type) {
        const [{ type: typeDesc }] = propDescriptor.tags.type;
        if (typeDesc) {
            const typedAST = (0, getTemplateExpressionAST_1.default)(`let a:${typeDesc.name}`);
            let typeValues;
            (0, recast_1.visit)(typedAST.program, {
                visitVariableDeclaration(path) {
                    const { typeAnnotation } = path.get('declarations', 0, 'id', 'typeAnnotation').value;
                    if (bt.isTSUnionType(typeAnnotation) &&
                        typeAnnotation.types.every(t => bt.isTSLiteralType(t))) {
                        typeValues = typeAnnotation.types.map((t) => bt.isUnaryExpression(t.literal) ? t.literal.argument.toString() : t.literal.value.toString());
                    }
                    return false;
                }
            });
            if (typeValues) {
                propDescriptor.values = typeValues;
            }
            else {
                propDescriptor.type = typeDesc;
                return getTypeFromTypePath(typeArray[0].get('value')).name;
            }
        }
    }
    if (typeArray.length) {
        return describeTypeAndValuesFromPath(typeArray[0].get('value'), propDescriptor);
    }
    else {
        // deduce the type from default expression
        const defaultArray = propPropertiesPath.filter((0, getPropsFilter_1.default)('default'));
        if (defaultArray.length) {
            const typeNode = defaultArray[0].node;
            if (bt.isObjectProperty(typeNode)) {
                const func = bt.isArrowFunctionExpression(typeNode.value) || bt.isFunctionExpression(typeNode.value);
                const typeValueNode = defaultArray[0].get('value').node;
                const typeName = typeof typeValueNode.value;
                propDescriptor.type = { name: func ? 'func' : typeName };
            }
        }
    }
    return undefined;
}
exports.describeType = describeType;
const VALID_VUE_TYPES = [
    'string',
    'number',
    'boolean',
    'array',
    'object',
    'date',
    'function',
    'symbol'
];
function resolveParenthesis(typeAnnotation) {
    let finalAnno = typeAnnotation;
    while (bt.isTSParenthesizedType(finalAnno)) {
        finalAnno = finalAnno.typeAnnotation;
    }
    return finalAnno;
}
function describeTypeAndValuesFromPath(propPropertiesPath, propDescriptor) {
    // values
    const values = getValuesFromTypePath(propPropertiesPath.node.typeAnnotation);
    // if it has an "as" annotation defining values
    if (values) {
        propDescriptor.values = values;
        propDescriptor.type = { name: 'string' };
    }
    else {
        // Get natural type from its identifier
        // (classic way)
        // type: Object
        propDescriptor.type = getTypeFromTypePath(propPropertiesPath);
    }
    return propDescriptor.type.name;
}
function getTypeFromTypePath(typePath) {
    const typeNode = typePath.node;
    const { typeAnnotation } = typeNode;
    const typeName = bt.isTSTypeReference(typeAnnotation) && typeAnnotation.typeParameters
        ? (0, recast_1.print)(resolveParenthesis(typeAnnotation.typeParameters.params[0])).code
        : bt.isArrayExpression(typeNode)
            ? typePath
                .get('elements')
                .map((t) => getTypeFromTypePath(t).name)
                .join('|')
            : typeNode &&
                bt.isIdentifier(typeNode) &&
                VALID_VUE_TYPES.indexOf(typeNode.name.toLowerCase()) > -1
                ? typeNode.name.toLowerCase()
                : (0, recast_1.print)(typeNode).code;
    return {
        name: typeName === 'function' ? 'func' : typeName
    };
}
exports.getTypeFromTypePath = getTypeFromTypePath;
/**
 * When a prop is type annotated with the "as" keyword,
 * It means that its possible values can be extracted from it
 * this extracts the values from the as
 * @param typeAnnotation the as annotation
 */
function getValuesFromTypePath(typeAnnotation) {
    if (bt.isTSTypeReference(typeAnnotation) && typeAnnotation.typeParameters) {
        const type = resolveParenthesis(typeAnnotation.typeParameters.params[0]);
        return getValuesFromTypeAnnotation(type);
    }
    return undefined;
}
function getValuesFromTypeAnnotation(type) {
    if (bt.isTSUnionType(type) && type.types.every(t => bt.isTSLiteralType(t))) {
        return type.types.map(t => ((bt.isTSLiteralType(t) && !bt.isUnaryExpression(t.literal)) ? t.literal.value.toString() : ''));
    }
    return undefined;
}
exports.getValuesFromTypeAnnotation = getValuesFromTypeAnnotation;
function describeRequired(propPropertiesPath, propDescriptor) {
    const requiredArray = propPropertiesPath.filter((0, getPropsFilter_1.default)('required'));
    const requiredNode = requiredArray.length ? requiredArray[0].get('value').node : undefined;
    const required = requiredNode && bt.isBooleanLiteral(requiredNode) ? requiredNode.value : undefined;
    if (required !== undefined) {
        propDescriptor.required = required;
    }
}
exports.describeRequired = describeRequired;
function describeDefault(propPropertiesPath, propDescriptor, propType) {
    var _a;
    const defaultArray = propPropertiesPath.filter((0, getPropsFilter_1.default)('default'));
    if (defaultArray.length) {
        /**
         * This means the default value is formatted like so: `default: any`
         */
        const defaultValueIsProp = bt.isObjectProperty(defaultArray[0].value);
        /**
         * This means the default value is formatted like so: `default () { return {} }`
         */
        const defaultValueIsObjectMethod = bt.isObjectMethod(defaultArray[0].value);
        // objects and arrays should try to extract the body from functions
        if (propType === 'object' || propType === 'array') {
            if (defaultValueIsProp) {
                /* TODO: add correct type info here ↓ */
                const defaultFunction = defaultArray[0].get('value');
                const isArrowFunction = bt.isArrowFunctionExpression(defaultFunction.node);
                const isOldSchoolFunction = bt.isFunctionExpression(defaultFunction.node);
                // if default is undefined or null, literals are allowed
                if (bt.isNullLiteral(defaultFunction.node) ||
                    (bt.isIdentifier(defaultFunction.node) && defaultFunction.node.name === 'undefined')) {
                    propDescriptor.defaultValue = {
                        func: false,
                        value: (0, recast_1.print)(defaultFunction.node).code
                    };
                    return;
                }
                // check if the prop value is a function
                if (!isArrowFunction && !isOldSchoolFunction) {
                    throw new Error('A default value needs to be a function when your type is an object or array');
                }
                // retrieve the function "body" from the arrow function
                if (isArrowFunction) {
                    const arrowFunctionBody = defaultFunction.get('body');
                    // arrow function looks like `() => { return {} }`
                    if (bt.isBlockStatement(arrowFunctionBody.node)) {
                        const rawValueParsed = getRawValueParsedFromFunctionsBlockStatementNode(arrowFunctionBody.node);
                        if (rawValueParsed) {
                            propDescriptor.defaultValue = {
                                func: false,
                                value: rawValueParsed
                            };
                            return;
                        }
                    }
                    if (bt.isArrayExpression(arrowFunctionBody.node) ||
                        bt.isObjectExpression(arrowFunctionBody.node)) {
                        const rawCode = (0, recast_1.print)(arrowFunctionBody.node).code;
                        const value = ((_a = arrowFunctionBody.node.extra) === null || _a === void 0 ? void 0 : _a.parenthesized)
                            ? rawCode.slice(1, rawCode.length - 1)
                            : rawCode;
                        propDescriptor.defaultValue = {
                            func: false,
                            value
                        };
                        return;
                    }
                    // arrow function looks like `() => ({})`
                    propDescriptor.defaultValue = {
                        func: true,
                        value: (0, recast_1.print)(defaultFunction).code
                    };
                    return;
                }
            }
            // defaultValue was either an ObjectMethod or an oldSchoolFunction
            // in either case we need to retrieve the blockStatement and work with that
            /* todo: add correct type info here ↓ */
            const defaultBlockStatement = defaultValueIsObjectMethod
                ? defaultArray[0].get('body')
                : defaultArray[0].get('value').get('body');
            const defaultBlockStatementNode = defaultBlockStatement.node;
            const rawValueParsed = getRawValueParsedFromFunctionsBlockStatementNode(defaultBlockStatementNode);
            if (rawValueParsed) {
                propDescriptor.defaultValue = {
                    func: false,
                    value: rawValueParsed
                };
                return;
            }
        }
        // otherwise the rest should return whatever there is
        if (defaultValueIsProp) {
            // in this case, just return the rawValue
            let defaultPath = defaultArray[0].get('value');
            if (bt.isTSAsExpression(defaultPath.value)) {
                defaultPath = defaultPath.get('expression');
            }
            const rawValue = (0, recast_1.print)(defaultPath).code;
            propDescriptor.defaultValue = {
                func: bt.isFunction(defaultPath.node),
                value: rawValue
            };
            return;
        }
        if (defaultValueIsObjectMethod) {
            // in this case, just the function needs to be reconstructed a bit
            const defaultObjectMethod = defaultArray[0].get('value');
            const paramNodeArray = defaultObjectMethod.node.params;
            const params = paramNodeArray.map((p) => p.name).join(', ');
            const defaultBlockStatement = defaultArray[0].get('body');
            const rawValue = (0, recast_1.print)(defaultBlockStatement).code;
            // the function should be reconstructed as "old-school" function, because they have the same handling of "this", whereas arrow functions do not.
            const rawValueParsed = `function(${params}) ${rawValue.trim()}`;
            propDescriptor.defaultValue = {
                func: true,
                value: rawValueParsed
            };
            return;
        }
        throw new Error('Your default value was formatted incorrectly');
    }
}
exports.describeDefault = describeDefault;
function describeValues(propPropertiesPath, propDescriptor, ast, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (propDescriptor.values) {
            return;
        }
        const validatorArray = propPropertiesPath.filter((0, getPropsFilter_1.default)('validator'));
        if (validatorArray.length) {
            const validatorNode = validatorArray[0].get('value').node;
            const values = yield (0, parseValidator_1.default)(validatorNode, ast, options);
            if (values) {
                propDescriptor.values = values;
            }
        }
    });
}
function extractValuesFromTags(propDescriptor) {
    if (propDescriptor.tags && propDescriptor.tags.values) {
        const values = propDescriptor.tags.values.map(tag => {
            const description = tag.description;
            const choices = typeof description === 'string' ? description.split(',') : undefined;
            if (choices) {
                return choices.map((v) => v.trim());
            }
            return [];
        });
        propDescriptor.values = [].concat(...values);
        delete propDescriptor.tags.values;
    }
}
exports.extractValuesFromTags = extractValuesFromTags;
/**
 * extract the property model.prop from the component object
 * @param path component NodePath
 * @returns name of the model prop, null if none
 */
function getModelPropName(path) {
    const modelPath = path
        .get('properties')
        .filter((p) => bt.isObjectProperty(p.node) && (0, getPropsFilter_1.default)('model')(p));
    if (!modelPath.length) {
        return null;
    }
    const modelPropertyNamePath = modelPath.length &&
        modelPath[0]
            .get('value')
            .get('properties')
            .filter((p) => bt.isObjectProperty(p.node) && (0, getPropsFilter_1.default)('prop')(p));
    if (!modelPropertyNamePath.length) {
        return null;
    }
    const valuePath = modelPropertyNamePath[0].get('value');
    return bt.isStringLiteral(valuePath.node) ? valuePath.node.value : null;
}
