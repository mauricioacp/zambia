npx nx g @nx/angular:library --name=ui-components --tags=scope:shared,type:components --directory=libs/shared/ui-components --dry-run
npx nx g @nx/angular:library --name=data-access-auth --tags=scope:shared,type:api --directory=libs/shared/data-access-auth --dry-run
npx nx g @nx/angular:library --name=feat-auth --tags=scope:zambia,type:feat --directory=libs/zambia/feat-auth
npx nx g @nx/angular:library --name=feat-shell --tags=scope:zambia,type:feat --directory=libs/zambia/feat-shell
nx g @nx/angular:component --path=components/shell --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=shell --type=smart-component --dry-run
nx g @nx/angular:component --path=libs/zambia/feat-auth/src/lib/components/smart/auth/auth --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=auth --type=smart-component --dry-run
