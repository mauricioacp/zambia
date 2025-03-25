import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { PageContainerUiComponent } from './page-container.ui-component';
import { NavbarUiComponent } from '../navbar/navbar.ui-component';
import { CommonModule } from '@angular/common';
import { SidebarUiComponent } from '../sidebar/sidebar.ui-component';
import { SidebarMiniUiComponent } from '../sidebar-mini/sidebar-mini.ui-component';

const meta: Meta<PageContainerUiComponent> = {
  component: PageContainerUiComponent,
  title: 'Page container',
  subcomponents: { NavbarUiComponent, SidebarUiComponent },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, PageContainerUiComponent, NavbarUiComponent, SidebarUiComponent,SidebarMiniUiComponent],
    }),
  ],
};
export default meta;
type Story = StoryObj<PageContainerUiComponent>;

export const Solo: Story = {
  args: {},
};

export const WithContent: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `
      <z-page-container>
        <z-sidebar>
          <z-sidebar-mini />
        </z-sidebar>
      </z-page-container>
  `,
  }),
};
