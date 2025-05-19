import type { Meta, StoryObj } from '@storybook/angular';
import { SidebarUiComponent } from './sidebar.ui-component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<SidebarUiComponent> = {
  component: SidebarUiComponent,
  title: 'SidebarUiComponent',
};
export default meta;
type Story = StoryObj<SidebarUiComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/sidebar.ui-component works!/gi)).toBeTruthy();
  },
};
