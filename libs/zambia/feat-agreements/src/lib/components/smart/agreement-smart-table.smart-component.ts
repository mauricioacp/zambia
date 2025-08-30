import { Component, input, output, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ConfirmationModalUiComponent, ConfirmationData } from '@zambia/ui-components';
import {
  EnhancedTableComponent,
  TableColumnWithTemplate,
  TableActionButton,
  EnhancedTableConfig,
} from '@zambia/feat-smart-table';
import { AgreementSearchModalComponent, AgreementSearchCriteria } from '../ui/agreement-search-modal.ui-component';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { SearchAgreementResult } from '../../types/search-agreements.types';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { CountriesFacadeService } from '@zambia/feat-countries';

@Component({
  selector: 'z-agreement-smart-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, EnhancedTableComponent],
  template: `
    <z-enhanced-table
      [items]="agreements()"
      [columns]="tableColumns"
      [loading]="loading()"
      [actions]="tableActions()"
      [config]="tableConfig()"
      (createClick)="createClick.emit()"
      (rowClick)="onRowClick()"
      (advancedSearchClick)="openAdvancedSearch()"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AgreementSmartTableComponent {
  private roleService = inject(RoleService);
  private dialogService = inject(TuiDialogService);
  private agreementsFacade = inject(AgreementsFacadeService);
  private countriesFacade = inject(CountriesFacadeService);

  private createUserSubject = new Subject<SearchAgreementResult>();
  private deactivateUserSubject = new Subject<SearchAgreementResult>();
  private deactivateAgreementSubject = new Subject<SearchAgreementResult>();
  private deleteSubject = new Subject<SearchAgreementResult>();

  agreements = input.required<SearchAgreementResult[]>();
  loading = input<boolean>(false);
  emptyStateTitle = input<string>('No agreements found');
  emptyStateDescription = input<string>('There are no agreements to display.');
  enablePagination = input<boolean>(true);
  enableFiltering = input<boolean>(true);
  enableColumnVisibility = input<boolean>(true);
  enableAdvancedSearch = input<boolean>(true);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  createClick = output<void>();
  rowClick = output<SearchAgreementResult>();
  editClick = output<SearchAgreementResult>();
  deleteClick = output<SearchAgreementResult>();
  downloadClick = output<SearchAgreementResult>();
  advancedSearch = output<AgreementSearchCriteria>();
  createUserClick = output<SearchAgreementResult>();
  deactivateUserClick = output<SearchAgreementResult>();
  resetPasswordClick = output<SearchAgreementResult>();
  sendMessageClick = output<SearchAgreementResult>();
  deactivateAgreementClick = output<SearchAgreementResult>();

  lastSearchCriteria = signal<AgreementSearchCriteria | null>(null);

  countries = computed(() => {
    const countriesData = this.countriesFacade.countriesResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return countriesData?.map((c: any) => ({ id: c.id, name: c.name })) || [];
  });

  headquarters = computed(() => {
    const hqData = this.agreementsFacade.headquartersResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return hqData?.map((hq: any) => ({ id: hq.id, name: hq.name })) || [];
  });

  constructor() {
    // Set up debounced subscriptions for actions
    this.createUserSubject.pipe(debounceTime(300)).subscribe((item) => {
      this.handleCreateUserDebounced(item);
    });

    this.deactivateUserSubject.pipe(debounceTime(300)).subscribe((item) => {
      this.handleDeactivateUserDebounced(item);
    });

    this.deactivateAgreementSubject.pipe(debounceTime(300)).subscribe((item) => {
      this.handleDeactivateAgreementDebounced(item);
    });

    this.deleteSubject.pipe(debounceTime(300)).subscribe((item) => {
      this.handleDeleteDebounced(item);
    });

    this.countriesFacade.countries.reload();
    this.agreementsFacade.headquarters.reload();
  }

  tableColumns: TableColumnWithTemplate<SearchAgreementResult>[] = [
    {
      key: 'name',
      label: 'User',
      type: 'avatar',
      width: '250',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      width: '220',
    },
    {
      key: 'role.role_name',
      label: 'Role',
      type: 'badge',
      width: '150',
    },
    {
      key: 'headquarter.headquarter_name',
      label: 'Headquarters',
      type: 'text',
      width: '200',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      width: '120',
    },
    {
      key: 'created_at',
      label: 'Created',
      type: 'date',
      width: '150',
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions',
      width: '150',
      align: 'right',
    },
  ];

  searchableColumns = ['name', 'email', 'role.role_name', 'headquarter.headquarter_name', 'status'];

  // Computed properties
  tableConfig = computed<EnhancedTableConfig<SearchAgreementResult>>(() => ({
    title: '',
    description: '',
    showCreateButton: false,
    emptyStateTitle: this.emptyStateTitle(),
    emptyStateDescription: this.emptyStateDescription(),
    emptyStateIcon: '@tui.file-text',
    showEmptyStateAction: false,
    enablePagination: this.enablePagination(),
    enableFiltering: this.enableFiltering(),
    enableColumnVisibility: this.enableColumnVisibility(),
    enableAdvancedSearch: this.enableAdvancedSearch(),
    pageSize: this.pageSize(),
    pageSizeOptions: this.pageSizeOptions(),
    searchableColumns: this.searchableColumns,
    trackBy: 'id',
  }));

  tableActions = computed<TableActionButton<SearchAgreementResult>[]>(() => {
    const roleLevel = Number(this.roleService.roleLevel() || 0);
    const canEdit = this.roleService.hasAnyRole(['superadmin', 'general_director']);
    const canDelete = this.roleService.hasRole('superadmin');

    const actions: TableActionButton<SearchAgreementResult>[] = [
      {
        label: 'View',
        icon: '@tui.eye',
        color: 'primary',
        handler: (item) => this.rowClick.emit(item),
        routerLink: (item) => ['/dashboard/agreements', item.id],
      },
    ];

    // Create User action (role level >= 30)
    if (roleLevel >= 30) {
      actions.push({
        label: 'Create User',
        icon: '@tui.user-plus',
        color: 'primary',
        handler: (item) => this.createUserSubject.next(item),
        visible: (item) => {
          const hasValidStatus = item.status === 'pending' || item.status === 'prospect' || item.status === 'inactive';
          const hasNoUser = !item.user_id;
          return hasValidStatus && hasNoUser;
        },
      });
    }

    // Deactivate User action (role level >= 50)
    if (roleLevel >= 50) {
      actions.push({
        label: 'Deactivate User',
        icon: '@tui.user-x',
        color: 'warning',
        handler: (item) => this.deactivateUserSubject.next(item),
        visible: (item) => item.status === 'active' && item.user_id !== undefined,
      });
    }

    // Reset Password action
    if (roleLevel >= 1) {
      actions.push({
        label: 'Reset Password',
        icon: '@tui.key',
        color: 'secondary',
        handler: (item) => this.resetPasswordClick.emit(item),
        visible: (item) => item.status === 'active' && item.user_id !== undefined,
      });
    }

    // Send Message action
    actions.push({
      label: 'Send Message',
      icon: '@tui.message-circle',
      color: 'primary',
      handler: (item) => this.sendMessageClick.emit(item),
      visible: (item) => item.status === 'active' && item.user_id !== undefined,
    });

    if (canEdit) {
      actions.push({
        label: 'Edit',
        icon: '@tui.pencil',
        color: 'warning',
        handler: (item) => this.editClick.emit(item),
      });

      // Deactivate Agreement action
      actions.push({
        label: 'Deactivate Agreement',
        icon: '@tui.pause',
        color: 'warning',
        handler: (item) => this.deactivateAgreementSubject.next(item),
        visible: (item) => item.status === 'active',
      });
    }

    actions.push({
      label: 'Download',
      icon: '@tui.download',
      color: 'secondary',
      handler: (item) => this.downloadClick.emit(item),
    });

    if (canDelete) {
      actions.push({
        label: 'Delete',
        icon: '@tui.trash',
        color: 'danger',
        handler: (item) => this.deleteSubject.next(item),
        disabled: (item) => item.status === 'active',
      });
    }

    return actions;
  });

  openAdvancedSearch(): void {
    const dialog = this.dialogService.open<AgreementSearchCriteria>(
      new PolymorpheusComponent(AgreementSearchModalComponent),
      {
        data: {
          initialCriteria: this.lastSearchCriteria(),
          countries: this.countries(),
          headquarters: this.headquarters(),
        },
        dismissible: true,
        size: 'l',
      }
    );

    dialog.subscribe({
      next: (criteria) => {
        if (criteria) {
          this.onAdvancedSearch(criteria);
        }
      },
    });
  }

  onAdvancedSearch(criteria: AgreementSearchCriteria): void {
    this.lastSearchCriteria.set(criteria);
    this.advancedSearch.emit(criteria);
  }

  private handleDeleteDebounced(item: SearchAgreementResult): void {
    const confirmData: ConfirmationData = {
      title: 'Delete Agreement',
      message: `Are you sure you want to delete the agreement for ${item.name || 'this user'}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true,
    };

    this.dialogService
      .open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
        data: confirmData,
        dismissible: true,
        size: 's',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteClick.emit(item);
        }
      });
  }

  private handleDeactivateUserDebounced(item: SearchAgreementResult): void {
    const confirmData: ConfirmationData = {
      title: 'Deactivate User',
      message: `Are you sure you want to deactivate the user account for ${item.name || 'this user'}? They will no longer be able to access the system.`,
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
      danger: true,
    };

    this.dialogService
      .open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
        data: confirmData,
        dismissible: true,
        size: 's',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deactivateUserClick.emit(item);
        }
      });
  }

  private handleDeactivateAgreementDebounced(item: SearchAgreementResult): void {
    const confirmData: ConfirmationData = {
      title: 'Deactivate Agreement',
      message: `Are you sure you want to deactivate the agreement for ${item.name || 'this user'}? The agreement will be marked as inactive.`,
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
      danger: true,
    };

    this.dialogService
      .open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
        data: confirmData,
        dismissible: true,
        size: 's',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deactivateAgreementClick.emit(item);
        }
      });
  }

  private handleCreateUserDebounced(item: SearchAgreementResult): void {
    const confirmData: ConfirmationData = {
      title: 'Create User Account',
      message: `Are you sure you want to create a user account for ${item.name || 'this agreement'}? An email with login credentials will be sent to ${item.email}.`,
      confirmText: 'Create User',
      cancelText: 'Cancel',
      danger: false,
    };

    this.dialogService
      .open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
        data: confirmData,
        dismissible: true,
        size: 's',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.createUserClick.emit(item);
        }
      });
  }

  onRowClick(/* event: AgreementWithShallowRelations */): void {
    // Do nothing on row click - navigation is handled by the View action only
  }
}
