import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from 'storybook/test';

import Button from './Button';

export const ButtonData = {
  onClick: fn(),
};

const meta = {
  component: Button,
  title: 'Button',
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ButtonData,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'button',
    children: 'Hello Button',
  },
};

export const Transparent: Story = {
  args: {
    className: 'button is-transparent',
    children: 'Hello Transparent Button',
  },
};
