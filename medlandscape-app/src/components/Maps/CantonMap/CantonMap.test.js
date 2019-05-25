// Link.react.test.js
import React from 'react';
import CantonMap from './CantonMap.js';
import renderer from 'react-test-renderer';

test('First CantonMap test', () => {
  const component = renderer.create(
    <CantonMap data={null} returnData={null} maxAndMin={null} />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  /*
  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  */
});