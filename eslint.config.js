import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'src/apps/SnakeGame/SnakeGame.tsx',
    'src/apps/Notepad/Notepad.tsx',
    'src/apps/SecurityToolkit/SecurityToolkit.tsx',
    'src/components/Icon.tsx',
    'src/apps/Game2048/Game2048.tsx',
    'src/apps/Game2048/ScoreBoard.tsx',
    'src/apps/Game2048/useGame2048.ts',
    'src/apps/AboutProfile/ExperienceGraph.tsx',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    }
  },
])
