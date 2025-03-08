import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist']
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              'sourceTag': 'type:app',
              'onlyDependOnLibsWithTags': ['*']
            },
            {
              'sourceTag': 'type:api',
              'onlyDependOnLibsWithTags': ['type:api', 'type:util']
            },
            {
              'sourceTag': 'type:components',
              'onlyDependOnLibsWithTags': ['type:components', 'type:util', 'type:api']
            },
            {
              'sourceTag': 'type:util',
              'onlyDependOnLibsWithTags': ['type:util']
            },
            {
              'sourceTag': 'type:feat',
              'onlyDependOnLibsWithTags': [
                'type:util',
                'type:api',
                'type:feat',
                'type:components',
                'type:data-access'
              ]
            },
            {
              'sourceTag': 'scope:shared',
              'onlyDependOnLibsWithTags': ['scope:shared']
            },
            {
              'sourceTag': 'scope:akademia',
              'onlyDependOnLibsWithTags': ['scope:akademia', 'scope:shared']
            }
          ]
        }

      ]
    }
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs'
    ],
    // Override or add rules here
    rules: {}
  }
];
