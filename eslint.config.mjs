// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['media-originals/**', 'app/components/ui/**', 'scripts/_dbg*.mjs'],
}, {
  rules: {
    // <AppImage slot="pkg-rahmah" /> is the project's image API (CLAUDE.md §7): a prop, not Vue 2 slot syntax
    // (the rule's ignore option does not cover bound :slot, so it is off)
    'vue/no-deprecated-slot-attribute': 'off',
  },
})
