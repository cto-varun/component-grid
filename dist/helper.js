"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const onStateChange = setTransitionedTo => (subscriptionId, topic, eventData, closure) => {
  if (eventData) {
    setTransitionedTo(eventData.value);
  }
};
var _default = onStateChange;
exports.default = _default;
module.exports = exports.default;