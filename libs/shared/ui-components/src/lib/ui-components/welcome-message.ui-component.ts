import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-welcome-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
      <p class="text-gray-600 dark:text-gray-300">{{ welcomeText() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeMessageUiComponent {
  welcomeText = input.required<string>();
}
