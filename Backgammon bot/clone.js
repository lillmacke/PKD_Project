"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = clone;
function clone(state) {
    //måste skrivas, ska klona state. verkar vara något som krävs för minmax
    return JSON.parse(JSON.stringify(state));
}
