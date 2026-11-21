import { strictTypeScriptRules } from '@chucarit/config/eslint/base';
import expoConfig from 'eslint-config-expo/flat.js';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  expoConfig,
  { files: ['**/*.{ts,tsx}'], rules: strictTypeScriptRules },
  prettier,
  globalIgnores(['dist/**', '.expo/**', 'coverage/**', 'ios/**', 'android/**', 'expo-env.d.ts']),
]);
