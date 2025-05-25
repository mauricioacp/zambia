import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-notifications-button',
  standalone: true,
  imports: [CommonModule, TuiIcon],
  template: `
    <a
      href="javascript:void(0)"
      class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
      (click)="open.set(!open())"
    >
      <tui-icon [attr.aria-label]="icon() + ' icon'" [icon]="icon()"
    /></a>
    <!-- <tui-drawer *tuiPopup="open()">
       <header>
         <h2 tuiHeader>
           <div tuiTitle>
             <span tuiCaption>Caption・caption</span>
             <span>
               Drawer title
               <tui-badge>Label</tui-badge>
             </span>
             <span tuiSubtitle>
               In publishing and graphic design, Lorem ipsum is a placeholder text commonly used.
             </span>
           </div>

           <div tuiAccessories>
             <button iconStart="@tui.search" tuiButton type="button">More info</button>
             <button iconStart="@tui.ellipsis" tuiIconButton type="button">Actions</button>
             <button appearance="icon" iconStart="@tui.x" tuiIconButton type="button" (click)="open.set(false)">
               Close
             </button>
           </div>
         </h2>
         <div>
           <button tuiButton type="button">Action 1</button>
           <a appearance="action" href="#" tuiButton> Action 2 </a>
           <button tuiLink type="button">Action 3</button>
         </div>
         <nav tuiNavigationNav>
           <tui-tabs>
             <button tuiTab type="button">Default view</button>
             <button tuiTab type="button">Details</button>
             <button tuiTab type="button">Followers</button>
           </tui-tabs>
           <hr />
           <button size="xs" tuiButton type="button">Primary</button>
           <button appearance="secondary" iconStart="@tui.ellipsis" size="xs" tuiIconButton type="button">More</button>
         </nav>
       </header>
       <p *tuiRepeatTimes="let index of 15">Content</p>
       <footer>
         <button size="m" tuiButton type="button" [style.margin-inline-end]="'auto'">Tertiary action</button>
         <button size="m" tuiButton type="button">Secondary action</button>
         <button appearance="primary" size="m" tuiButton type="button">Primary action</button>
       </footer>
     </tui-drawer>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsButtonComponent {
  icon = input<string>('bell');
  protected readonly open = signal(false);
}
