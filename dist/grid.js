"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Grid;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _componentBreadcrumb = _interopRequireDefault(require("@ivoyant/component-breadcrumb"));
var _reactJsxParser = _interopRequireDefault(require("react-jsx-parser"));
var _jsonata = _interopRequireDefault(require("jsonata"));
var _reactRouterDom = require("react-router-dom");
var _shortid = _interopRequireDefault(require("shortid"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const onStateChange = (setDelayedData, setTransitionedTo, interestedStates, dataExp) => (subscriptionId, topic, eventData, closure) => {
  if (eventData) {
    if (interestedStates && interestedStates.includes(eventData.value)) {
      setDelayedData(dataExp ? (0, _jsonata.default)(dataExp).evaluate(eventData) : eventData?.event?.data?.data);
      setTransitionedTo(eventData.value);
    }
  }
};
const getDivider = dividerConf => {
  let divider;
  if (dividerConf) {
    divider = /*#__PURE__*/_react.default.createElement(_antd.Divider, {
      orientation: dividerConf.orientation || 'left',
      type: dividerConf.type || 'horizontal'
    }, dividerConf.text);
  }
  return divider;
};
const Col = /*#__PURE__*/_react.default.memo(props => {
  const {
    col,
    getRow,
    workflow,
    getChildForId
  } = props;
  const {
    row,
    id,
    dividerBefore,
    dividerAfter,
    enableOnEvents,
    disableOnEvents,
    delayedDataExp,
    className = 'gutter-row',
    span = 24,
    jsxBefore,
    jsxAfter
  } = col;
  const [enabled, setEnabled] = (0, _react.useState)(enableOnEvents === undefined);
  const [transitionedTo, setTransitionedTo] = (0, _react.useState)(undefined);
  const [delayedData, setDelayedData] = (0, _react.useState)({});
  const location = (0, _reactRouterDom.useLocation)();
  (0, _react.useEffect)(() => {
    if (id && workflow && (enableOnEvents || disableOnEvents)) {
      console.log('Subscribing to id ', workflow.concat('.col').concat('.').concat(id));
      _componentMessageBus.MessageBus.subscribe(workflow.concat('.col').concat('.').concat(id), 'WF.'.concat(workflow).concat('.STATE.CHANGE'), onStateChange(setDelayedData, setTransitionedTo, [...(enableOnEvents || []), ...(disableOnEvents || [])], delayedDataExp));
    }
    return () => {
      if (id && workflow && (enableOnEvents || disableOnEvents)) {
        _componentMessageBus.MessageBus.unsubscribe(workflow.concat('.col').concat('.').concat(id));
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (transitionedTo) {
      if (enableOnEvents) {
        if (enableOnEvents.includes(transitionedTo)) {
          setEnabled(true);
        }
      }
      if (disableOnEvents) {
        if (disableOnEvents.includes(transitionedTo)) {
          setEnabled(false);
        }
      }
    }
  }, [transitionedTo]);
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
    key: id || _shortid.default.generate()
  }, dividerBefore && getDivider(dividerBefore), /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: span,
    className: className
  }, enabled && (row ? getRow(row) : /*#__PURE__*/_react.default.createElement("div", null, jsxBefore && /*#__PURE__*/_react.default.createElement(_reactJsxParser.default, {
    bindings: {
      routeData: location?.state?.routeData,
      routeContext: location?.state?.routeContext
    },
    components: {
      Title: _antd.Typography.Title,
      Paragraph: _antd.Typography.Paragraph,
      Text: _antd.Typography.Text
    },
    jsx: jsxBefore
  }), getChildForId(id, delayedData)))), dividerAfter && getDivider(dividerAfter));
}, true);
function Grid(props) {
  const {
    children,
    properties
  } = props;
  const {
    childComponents,
    params
  } = props.component;
  const {
    title,
    breadcrumbs
  } = params;
  let {
    gutter = {
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32
    },
    workflow,
    initialize
  } = properties;
  if (!Array.isArray(gutter)) {
    gutter = [gutter, 16];
  }
  const getChildForId = (id, delayedData) => {
    let child = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    if (id) {
      child = /*#__PURE__*/_react.default.cloneElement(children[childComponents.findIndex(cc => cc.id === id)], {
        parentProps: props,
        routeData: props?.routeData,
        routeContext: props?.routeContext,
        delayedData
      });
    }
    return child;
  };
  (0, _react.useEffect)(() => {
    if (workflow) {
      if (initialize) {
        _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
          header: {
            registrationId: workflow,
            workflow,
            eventType: 'INIT'
          }
        });
      }
    }
  }, []);
  const getCols = cols => {
    return cols.map(col => {
      return /*#__PURE__*/_react.default.createElement(Col, {
        col: col,
        getRow: getRow,
        workflow: workflow,
        getChildForId: getChildForId
      });
    });
  };
  const getRow = row => {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: _shortid.default.generate()
    }, getDivider(row.dividerBefore), /*#__PURE__*/_react.default.createElement(_antd.Row, {
      gutter: row.gutter || gutter,
      justify: row.justify || 'start'
    }, getCols(row.cols)), getDivider(row.dividerAfter));
  };
  const getRows = rows => {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, breadcrumbs && title && /*#__PURE__*/_react.default.createElement(_componentBreadcrumb.default, {
      title: title,
      breadcrumbs: breadcrumbs
    }), rows.map(row => {
      return getRow(row);
    }));
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, getRows(params.rows));
}
module.exports = exports.default;