/** @type {import('prettier').Config} */
const config = {
  arrowParens: 'avoid',
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
}

export default config
