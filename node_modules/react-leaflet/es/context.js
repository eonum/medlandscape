"use strict";

import _extends from "@babel/runtime/helpers/esm/extends";
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { createContext, forwardRef } from 'react';

var _createContext = createContext({}),
    Consumer = _createContext.Consumer,
    Provider = _createContext.Provider;

export var LeafletConsumer = Consumer;
export var LeafletProvider = Provider;
export var withLeaflet = function withLeaflet(WrappedComponent) {
  var WithLeafletComponent = function WithLeafletComponent(props, ref) {
    return React.createElement(Consumer, null, function (leaflet) {
      return React.createElement(WrappedComponent, _extends({}, props, {
        leaflet: leaflet,
        ref: ref
      }));
    });
  };

  var name = // flowlint-next-line sketchy-null-string:off
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithLeafletComponent.displayName = "Leaflet(" + name + ")";
  var LeafletComponent = forwardRef(WithLeafletComponent);
  hoistNonReactStatics(LeafletComponent, WrappedComponent);
  return LeafletComponent;
};