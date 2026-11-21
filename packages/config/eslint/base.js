// Shared ESLint flat config for TypeScript packages (API, shared).
// Apps with a framework config (Next.js) compose `strictTypeScriptRules` on top of theirs.
// No `consistent-type-imports` here: Nest relies on value imports for decorator metadata (DI).
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Rules every workspace enforces, regardless of framework. */
export const strictTypeScriptRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
  ],
};

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: strictTypeScriptRules,
  },
  prettier,
);
