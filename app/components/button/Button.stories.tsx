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

export const Primary: Story = {
  args: {
    className: 'button is-primary',
    children: 'Hello Button',
  },
};

export const Transparent: Story = {
  args: {
    className: 'button is-transparent',
    children: 'Hello Transparent Button',
  },
};

export const Icon: Story = {
  args: {
    className: 'button is-transparent is-icon',
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M2.4,24l-2.4-2.4,9.6-9.6L0,2.4,2.4,0l9.6,9.6L21.6,0l2.4,2.4-9.6,9.6,9.6,9.6-2.4,2.4-9.6-9.6L2.4,24Z" />
      </svg>
    ),
  },
};

export const ProductOption: Story = {
  args: {
    className: 'button product-options-item',
    children: 'SM',
  },
};

export const ProductOptionLink: Story = {
  args: {
    className: 'button product-options-item is-selectable',
    children: 'SM',
  },
};

export const ProductOptionSelected: Story = {
  args: {
    className: 'button product-options-item is-selected',
    children: 'SM',
  },
};

export const ProductOptionUnavailable: Story = {
  args: {
    className: 'button product-options-item is-unavailable',
    children: 'SM',
  },
};
