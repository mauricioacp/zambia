import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from '@zambia/data-access-roles-permissions';
import { CardColumnData, CardComponent, DataBadgeUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { DashboardFacadeService } from '@zambia/data-access-dashboard';

interface ReviewStat {
  id: string;
  title: string;
  pending: number;
  reviewed: number;
  total: number;
  percentage_reviewed: number;
  color: string;
  textColor: string;
  iconSvg?: string;
}

interface ReviewStatsData {
  [key: string]: ReviewStat;
}

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [CommonModule, WelcomeMessageUiComponent, DataBadgeUiComponent, CardComponent],
  template: `
    <div class="h-full w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
      <z-welcome-message [welcomeText]="welcomeText()" />
      <!-- Stats Section -->
      <div class="mb-4">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Estadísticas globales</h2>
          <p class="text-gray-600 dark:text-gray-300">
            Estos datos corresponden a los acuerdos que ya han sido revisados por un responsable
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of dashboardFacade.dashboardStats(); track stat.label) {
            <z-data-badge [loading]="dashboardFacade.globalDataLoading()" [stat]="stat" />
          }
        </div>
      </div>

      <div class="w-full space-y-6">
        <div class="mb-4">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Estadísticas detalladas</h2>
            <p class="text-gray-600 dark:text-gray-300">
              Estos datos corresponden a los acuerdos pendientes por revisar y el porcentaje de acuerdos revisados.
            </p>
          </div>
          <z-card
            [mainTitle]="overallStat.title"
            [mainSubtitle]="overallStat.total + ' Acuerdos Totales'"
            [colData]="getCardColData(overallStat)"
            [progressPercentage]="overallStat.percentage_reviewed"
            [progressBarColor]="'bg-sky-500'"
            [progressTextColor]="overallStat.textColor"
            [staticBorderColor]="'ring-sky-500'"
            [applyAnimatedBorder]="true"
            [icon]="overallStat.iconSvg!"
          ></z-card>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (stat of otherStats; track stat.title) {
          <z-card
            [mainTitle]="stat.title"
            [mainSubtitle]="stat.total + ' Acuerdos Totales'"
            [colData]="getCardColData(stat)"
            [progressPercentage]="stat.percentage_reviewed"
            [progressBarColor]="stat.color"
            [progressTextColor]="stat.textColor"
            [applyAnimatedBorder]="true"
            [icon]="stat.iconSvg!"
          >
          </z-card>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSmartComponent implements OnInit {
  protected rolesService = inject(RolesService);
  protected welcomeText = computed(() => this.rolesService.getWelcomeText());
  protected dashboardFacade = inject(DashboardFacadeService);
  protected skeleton = signal(true);

  constructor() {
    setTimeout(() => {
      this.skeleton.set(false);
    }, 300);
  }

  reviewStatsData: ReviewStatsData = {
    overall: {
      id: 'overall',
      title: 'General',
      pending: 15,
      reviewed: 43,
      total: 58,
      percentage_reviewed: 74.14,
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
    },
    students: {
      id: 'students',
      title: 'Estudiantes',
      pending: 5,
      reviewed: 15,
      total: 20,
      percentage_reviewed: 75.0,
      color: 'bg-green-500',
      textColor: 'text-green-400',
    },
    collaborators: {
      id: 'collaborators',
      title: 'Colaboradores',
      pending: 2,
      reviewed: 8,
      total: 10,
      percentage_reviewed: 80.0,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
    },
    konsejo_members: {
      id: 'konsejo_members',
      title: 'Miembros del Konsejo',
      pending: 1,
      reviewed: 4,
      total: 5,
      percentage_reviewed: 80.0,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
    },
    directors: {
      id: 'directors',
      title: 'Directores',
      pending: 0,
      reviewed: 3,
      total: 3,
      percentage_reviewed: 100.0,
      color: 'bg-pink-500',
      textColor: 'text-pink-400',
    },
    facilitators: {
      id: 'facilitators',
      title: 'Facilitadores',
      pending: 3,
      reviewed: 7,
      total: 10,
      percentage_reviewed: 70.0,
      color: 'bg-teal-500',
      textColor: 'text-teal-400',
    },
    companions: {
      id: 'companions',
      title: 'Acompañantes',
      pending: 4,
      reviewed: 6,
      total: 10,
      percentage_reviewed: 60.0,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
    },
  };

  overallStat!: ReviewStat;
  otherStats: ReviewStat[] = [];
  displayOrder: string[] = ['students', 'collaborators', 'konsejo_members', 'directors', 'facilitators', 'companions']; // Overall is handled separately

  ngOnInit(): void {
    if (this.reviewStatsData['overall']) {
      this.overallStat = this.reviewStatsData['overall'];
    }

    this.otherStats = this.displayOrder.map((key) => this.reviewStatsData[key]).filter((stat) => !!stat); // Filter out any undefined stats if a key is mistyped
  }

  getCardColData(stat: ReviewStat): CardColumnData[] {
    return [
      { dataSubtitle: 'Pendientes', dataNumber: stat.pending },
      { dataSubtitle: 'Revisados', dataNumber: stat.reviewed },
    ];
  }
}
