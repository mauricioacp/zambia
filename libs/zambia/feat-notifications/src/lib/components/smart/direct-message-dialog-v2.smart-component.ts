import { Component, ChangeDetectionStrategy, inject, signal, computed, Inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiTextfield, TuiDataList, TuiLoader, TuiIcon, TuiOptGroup } from '@taiga-ui/core';
import { TuiTextarea, TuiAvatar, TuiTextareaLimit } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationApiService } from '@zambia/shared/data-access-notifications';
import { NotificationService } from '@zambia/data-access-generic';
import { AuthService, UserMetadataService } from '@zambia/data-access-auth';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import type { UserSearchResult } from '@zambia/shared/data-access-notifications';

@Component({
  selector: 'z-direct-message-dialog-v2',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TuiDataList,
    TuiLoader,
    TuiIcon,
    TuiOptGroup,
    TuiAvatar,
    TranslateModule,
    TuiTextarea,
    TuiTextareaLimit,
  ],
  template: `
    <div class="p-6">
      <h2 class="mb-6 text-xl font-semibold">{{ 'NOTIFICATIONS.SEND_MESSAGE' | translate }}</h2>

      <form [formGroup]="form" (ngSubmit)="sendMessage()">
        <!-- Recipient Search -->
        <div class="mb-4">
          <label for="searchQuery" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'NOTIFICATIONS.RECIPIENT' | translate }}
          </label>

          @if (selectedRecipient()) {
            <!-- Selected recipient chip -->
            <div class="flex items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
              <tui-avatar [src]="selectedRecipient()?.full_name || selectedRecipient()?.email || ''" size="xs" />
              <span class="flex-1">
                {{ selectedRecipient()?.full_name || selectedRecipient()?.email }}
                <span class="ml-1 text-xs text-gray-500"> ({{ selectedRecipient()?.role_code }}) </span>
              </span>
              <button type="button" tuiIconButton appearance="flat" size="xs" icon="@tui.x" (click)="clearRecipient()">
                <span class="sr-only">Clear recipient</span>
              </button>
            </div>
          } @else {
            <!-- Search input -->
            <tui-textfield formControlName="searchQuery">
              <input
                tuiTextfield
                type="text"
                id="searchQuery"
                [placeholder]="'NOTIFICATIONS.SEARCH_USER_PLACEHOLDER' | translate"
              />
              @if (isSearching()) {
                <tui-loader size="s" />
              } @else {
                <tui-icon icon="@tui.search" />
              }
            </tui-textfield>

            <!-- Search results dropdown -->
            @if (showSearchResults()) {
              <tui-data-list
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800"
              >
                @if (searchResults().length === 0) {
                  <tui-opt-group [label]="'NOTIFICATIONS.NO_USERS_FOUND' | translate"> </tui-opt-group>
                } @else {
                  @for (user of searchResults(); track user.id) {
                    <button tuiOption type="button" (click)="selectRecipient(user)" class="flex items-center gap-3 p-2">
                      <tui-avatar [src]="user.full_name || user.email" size="s" />
                      <div class="flex-1 text-left">
                        <div class="font-medium">
                          {{ user.full_name || user.email }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ user.role_code }} • Level {{ user.role_level }}
                        </div>
                      </div>
                    </button>
                  }
                }
              </tui-data-list>
            }
          }
        </div>

        <!-- Message Title -->
        <div class="mb-4">
          <label for="title" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'NOTIFICATIONS.MESSAGE_TITLE' | translate }}
          </label>
          <tui-textfield formControlName="title">
            <input
              tuiTextfield
              type="text"
              id="title"
              [placeholder]="'NOTIFICATIONS.MESSAGE_TITLE_PLACEHOLDER' | translate"
            />
          </tui-textfield>
        </div>

        <!-- Message Body -->
        <div class="mb-4">
          <label for="body" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'NOTIFICATIONS.MESSAGE_BODY' | translate }}
          </label>
          <tui-textfield [style.margin-block-end.rem]="1">
            <textarea
              placeholder="Placeholder"
              tuiTextarea
              formControlName="body"
              [placeholder]="'NOTIFICATIONS.MESSAGE_BODY_PLACEHOLDER' | translate"
              [limit]="250"
              [max]="6"
              [min]="3"
              id="body"
            ></textarea>
          </tui-textfield>
        </div>

        <!-- Priority -->
        <div class="mb-6">
          <label for="priority" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'NOTIFICATIONS.PRIORITY' | translate }}
          </label>
          <div class="flex gap-2">
            @for (priority of priorities; track priority.value) {
              <button
                type="button"
                tuiButton
                [appearance]="form.value.priority === priority.value ? 'primary' : 'secondary'"
                size="s"
                (click)="setPriority(priority.value)"
              >
                {{ priority.label | translate }}
              </button>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2">
          <button type="button" tuiButton appearance="secondary" (click)="cancel()">
            {{ 'COMMON.CANCEL' | translate }}
          </button>
          <button
            type="submit"
            tuiButton
            appearance="primary"
            [disabled]="!form.valid || !selectedRecipient() || isSending()"
          >
            @if (isSending()) {
              <tui-loader size="s" class="mr-2" />
            }
            {{ 'NOTIFICATIONS.SEND' | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageDialogV2SmartComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationApi = inject(NotificationApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly userMetadataService = inject(UserMetadataService);

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: { data?: { recipientId?: string }; completeWith: (result: { sent: boolean }) => void }
  ) {
    // Setup search functionality
    this.setupSearch();

    // Pre-select recipient if provided
    if (this.context.data?.recipientId) {
      this.loadRecipient(this.context.data.recipientId);
    }
  }

  // Form
  readonly form = this.fb.group({
    searchQuery: [''],
    title: ['', Validators.required],
    body: ['', Validators.required],
    priority: ['medium' as 'low' | 'medium' | 'high' | 'urgent'],
  });

  // State
  readonly selectedRecipient = signal<UserSearchResult | null>(null);
  readonly isSending = signal(false);
  readonly isSearching = signal(false);
  readonly searchResults = signal<UserSearchResult[]>([]);
  readonly showSearchResults = computed(() => this.searchResults().length > 0 && !this.selectedRecipient());

  // Priority options
  readonly priorities = [
    { value: 'low', label: 'NOTIFICATIONS.PRIORITY_LOW' },
    { value: 'medium', label: 'NOTIFICATIONS.PRIORITY_MEDIUM' },
    { value: 'high', label: 'NOTIFICATIONS.PRIORITY_HIGH' },
    { value: 'urgent', label: 'NOTIFICATIONS.PRIORITY_URGENT' },
  ] as const;

  private setupSearch(): void {
    this.form.controls.searchQuery.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim().length < 2) {
            this.searchResults.set([]);
            return of([]);
          }

          this.isSearching.set(true);
          return this.notificationApi.searchUsers(query.trim()).pipe(
            catchError(() => {
              this.notificationService.showError('Failed to search users');
              return of([]);
            })
          );
        })
      )
      .subscribe((results) => {
        this.isSearching.set(false);
        if (results) {
          this.searchResults.set(results);
        }
      });
  }

  private async loadRecipient(userId: string): Promise<void> {
    try {
      const users = await this.notificationApi.searchUsers('').toPromise();
      const user = users?.find((u) => u.id === userId);
      if (user) {
        this.selectRecipient(user);
      }
    } catch (error) {
      console.error('Failed to load recipient:', error);
    }
  }

  selectRecipient(user: UserSearchResult): void {
    this.selectedRecipient.set(user);
    this.form.controls.searchQuery.setValue('');
    this.searchResults.set([]);
  }

  clearRecipient(): void {
    this.selectedRecipient.set(null);
  }

  setPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): void {
    this.form.patchValue({ priority });
  }

  async sendMessage(): Promise<void> {
    if (!this.form.valid || !this.selectedRecipient()) {
      return;
    }

    const recipient = this.selectedRecipient();
    if (!recipient) return;
    const { title, body, priority } = this.form.value;

    this.isSending.set(true);

    try {
      // Get sender name from user metadata service
      const senderName = this.userMetadataService.userDisplayName();

      await this.notificationApi.sendDirectNotification({
        recipient_id: recipient.id,
        title: title || '',
        body: body || '',
        type: 'direct_message',
        priority: priority || 'medium',
        data: {
          sender_name: senderName,
        },
      });

      this.notificationService.showSuccess('Message sent successfully');
      this.context.completeWith({ sent: true });
    } catch {
      this.notificationService.showError('Failed to send message');
    } finally {
      this.isSending.set(false);
    }
  }

  cancel(): void {
    this.context.completeWith({ sent: false });
  }
}
