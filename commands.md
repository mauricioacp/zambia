npx nx g @nx/angular:library --name=ui-components --tags=scope:shared,type:components --directory=libs/shared/ui-components --dry-run
npx nx g @nx/angular:library --name=data-access-auth --tags=scope:shared,type:api --directory=libs/shared/data-access-auth --dry-run
npx nx g @nx/angular:library --name=feat-auth --tags=scope:zambia,type:feat --directory=libs/zambia/feat-auth
npx nx g @nx/angular:library --name=feat-shell --tags=scope:zambia,type:feat --directory=libs/zambia/feat-shell
nx g @nx/angular:component --path=components/shell --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=shell --type=smart-component --dry-run
nx g @nx/angular:component --path=libs/zambia/feat-auth/src/lib/components/smart/auth/auth --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=auth --type=smart-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/navbar --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=navbar --type=ui-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar --type=ui-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-mini/sidebar-mini --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar-mini --type=ui-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/page-container/page-container --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=page-container --type=ui-component --dry-run
npx nx g @nx/angular:library --name=feat-dashboard --tags=scope:zambia,type:feat --directory=libs/zambia/feat-dashboard
nx g @nx/angular:component --path=libs/zambia/feat-dashboard/src/lib/components/smart/dashboard/dashboard --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=dashboard --type=smart-component --dry-run
nx g @nx/angular:service --path=libs/shared/ui-components/src/lib/layout --name=Theme --project=ui-components --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/footer/footer --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=page-footer --type=ui-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/page-header/page-header --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=page-header --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/brand/brand --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=brand --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-nav-item/sidebar-nav-item --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar-nav-item --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-header/sidebar-header --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar-header --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-nav/sidebar-nav --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar-nav --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-item/main-sidebar-nav-item --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=main-sidebar-nav-item --type=ui-component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/sidebar-nav-section-header/sidebar-nav-section-header --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=sidebar-nav-section-header --type=ui-component
npx nx g @nx/angular:library --name=feat-headquarter --tags=scope:zambia,type:feat --directory=libs/zambia/feat-headquarter
npx nx g @nx/angular:library --name=data-access-roles-permissions --tags=scope:shared,type:api --directory=libs/shared/data-access-roles-permissions --dry-run
npx nx g @nx/angular:service --name=auth --project=data-access-auth --path=libs/shared/data-access-auth/src/lib/ --skipTests --dry-run
npx nx g @nx/angular:service --name=roles --project=data-access-auth --path=libs/shared/data-access-roles-permissions/src/lib/ --skipTests --dry-run
npx nx g @nx/angular:library --name=util-roles-permissions --tags=scope:shared,type:util --directory=libs/shared/util-guards --dry-run
npx nx g @nx/angular:library --name=util-config --tags=scope:shared,type:util --directory=libs/shared/util-config --dry-run
nx g @nx/angular:component --path=libs/zambia/feat-headquarter/src/lib/components/smart/headquarter-dashboard/ --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=headquarter-dashboard --type=smart-component --dry-run
npx nx g @nx/angular:library --name=types-supabase --tags=scope:shared,type:util --directory=libs/shared/types-supabase --dry-run
npx nx g @nx/angular:library --name=data-access-supabase --tags=scope:shared,type:api --directory=libs/shared/data-access-supabase --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/access-denied-page --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=access-denied-page --type=ui-component --dry-run
nx g @nx/angular:component --path=libs/zambia/feat-dashboard/src/lib/components/smart/panel --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=panel --skipTests --type=smart-component --dry-run
npx nx g @nx/angular:library --name=feat-agreements --tags=scope:zambia,type:feat --directory=libs/zambia/feat-agreements
nx g @nx/angular:component --path=libs/zambia/feat-agreements/src/lib/components/smart/agreements/ --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=agreements --type=smart-component --dry-run
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/welcome-message --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=welcome-message --type=ui-component --dry-run
npx nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/info-card-item --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=info-card-item --type=ui-component --skipTests
npx nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/dashboard-stat-card --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=dashboard-stat-card --type=ui-component --skipTests
npx nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/recent-activity-item --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=recent-activity-item --type=ui-component --skipTests
npx nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/quick-link-item --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=quick-link-item --type=ui-component --skipTests --dry-run
