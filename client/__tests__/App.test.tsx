/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeMany: jest.fn(async () => undefined),
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return new Proxy(
    {},
    {
      get: (_, property) => {
        const name = String(property);
        return function MockIcon(props: Record<string, unknown>) {
          return React.createElement(View, {
            ...props,
            testID: name,
          });
        };
      },
    },
  );
});

test('renders correctly', async () => {
  let component;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<App />);
  });

  expect(component).toBeTruthy();
});
