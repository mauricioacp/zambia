import { inject, Injectable, signal } from '@angular/core';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private windowService = inject(WindowService);
  sidebarOpen = signal(this.windowService.isMobile());

  userDropdownOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    if (this.windowService.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen.update((value) => !value);
  }

  closeUserDropdown(): void {
    this.userDropdownOpen.set(false);
  }
}
