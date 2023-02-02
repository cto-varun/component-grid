"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _grid = _interopRequireDefault(require("./grid"));
var _grid2 = require("./grid.schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  component: _grid.default,
  schema: _grid2.schema,
  ui: _grid2.ui
};
exports.default = _default;
module.exports = exports.default;