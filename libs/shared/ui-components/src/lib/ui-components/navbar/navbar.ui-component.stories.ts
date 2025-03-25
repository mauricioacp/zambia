import type { Meta, StoryObj } from '@storybook/angular';
import { NavbarUiComponent } from './navbar.ui-component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<NavbarUiComponent> = {
  component: NavbarUiComponent,
  title: 'NavbarUiComponent',
};
export default meta;
type Story = StoryObj<NavbarUiComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/navbar.ui-component works!/gi)).toBeTruthy();
  },
};
