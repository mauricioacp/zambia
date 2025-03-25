import type { Meta, StoryObj } from '@storybook/angular';
import { SidebarMiniUiComponent } from './sidebar-mini.ui-component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<SidebarMiniUiComponent> = {
  component: SidebarMiniUiComponent,
  title: 'SidebarMiniUiComponent',
};
export default meta;
type Story = StoryObj<SidebarMiniUiComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/sidebar-mini.ui-component works!/gi)).toBeTruthy();
  },
};
