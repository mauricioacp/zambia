import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  sidebarOpen = signal(true);

  userDropdownOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    if (window.innerWidth < 1024) {
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
