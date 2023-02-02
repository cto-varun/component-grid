"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Divider = Divider;
exports.Row = Row;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _shortid = _interopRequireDefault(require("shortid"));
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _helper = _interopRequireDefault(require("./helper.js"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const getChildForId = (id, children, childComponents, parentProps, routeData, delayedData) => {
  let child = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  if (id) {
    child = /*#__PURE__*/_react.default.cloneElement(children[childComponents.findIndex(cc => cc.id === id)], {
      parentProps,
      routeData,
      delayedData
    });
  }
  return child;
};
function Divider(_ref) {
  let {
    orientation = 'left',
    type = 'horizontal',
    text
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    orientation: orientation,
    type: type
  }, text);
}
function Row(props) {
  let {
    gutter = {
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32
    }
  } = props;
  if (!Array.isArray(gutter)) {
    gutter = [gutter, 16];
  }
  const {
    dividerAfter,
    dividerBefore,
    justify = 'start',
    cols,
    workflow,
    children,
    childComponents,
    parentProps,
    routeData
  } = props;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
    key: _shortid.default.generate()
  }, dividerBefore && /*#__PURE__*/_react.default.createElement(Divider, dividerBefore), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    gutter: gutter,
    justify: justify
  }, cols.map(col => /*#__PURE__*/_react.default.createElement(Col, _extends({}, col, {
    workflow: workflow,
    children: children,
    childComponents: childComponents,
    parentProps: props,
    routeData: routeData
  })))), dividerAfter && /*#__PURE__*/_react.default.createElement(Divider, dividerAfter));
}
const Col = /*#__PURE__*/_react.default.memo(props => {
  const {
    workflow,
    children,
    childComponents,
    parentProps,
    routeData,
    row,
    id,
    dividerBefore,
    dividerAfter,
    enableOnEvents,
    className = 'gutter-row',
    span = 24
  } = props;
  const [transitionedTo, setTransitionedTo] = (0, _react.useState)(undefined);
  (0, _react.useEffect)(() => {
    if (id && workflow) {
      _componentMessageBus.MessageBus.subscribe(workflow.concat('.col').concat('.').concat(id), 'WF.'.concat(workflow).concat('.STATE.CHANGE'), (0, _helper.default)(setTransitionedTo));
    }
    return () => {
      if (id && workflow) {
        _componentMessageBus.MessageBus.unsubscribe(workflow.concat('.col').concat('.').concat(id));
      }
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
    key: id || _shortid.default.generate()
  }, dividerBefore && /*#__PURE__*/_react.default.createElement(Divider, dividerBefore), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: span,
    className: className
  }, (enableOnEvents === undefined || enableOnEvents.includes(transitionedTo)) && (row ? /*#__PURE__*/_react.default.createElement(Row, _extends({}, row, {
    workflow: workflow,
    children: children,
    childComponents: childComponents,
    parentProps: props,
    routeData: routeData
  })) : /*#__PURE__*/_react.default.createElement("div", null, getChildForId(id, children, childComponents, parentProps, routeData, enableOnEvents === undefined ? {} : {
    question: 'WHich was your first concert'
  })))), dividerAfter && /*#__PURE__*/_react.default.createElement(Divider, dividerAfter));
}, true);