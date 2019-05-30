"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.withLeaflet = exports.LeafletProvider = exports.LeafletConsumer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _react = _interopRequireWildcard(require("react"));

var _createContext = (0, _react.createContext)({}),
    Consumer = _createContext.Consumer,
    Provider = _createContext.Provider;

var LeafletConsumer = Consumer;
exports.LeafletConsumer = LeafletConsumer;
var LeafletProvider = Provider;
exports.LeafletProvider = LeafletProvider;

var withLeaflet = function withLeaflet(WrappedComponent) {
  var WithLeafletComponent = function WithLeafletComponent(props, ref) {
    return _react.default.createElement(Consumer, null, function (leaflet) {
      return _react.default.createElement(WrappedComponent, (0, _extends2.default)({}, props, {
        leaflet: leaflet,
        ref: ref
      }));
    });
  };

  var name = // flowlint-next-line sketchy-null-string:off
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithLeafletComponent.displayName = "Leaflet(" + name + ")";
  var LeafletComponent = (0, _react.forwardRef)(WithLeafletComponent);
  (0, _hoistNonReactStatics.default)(LeafletComponent, WrappedComponent);
  return LeafletComponent;
};

exports.withLeaflet = withLeaflet;