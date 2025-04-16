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
