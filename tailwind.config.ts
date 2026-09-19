import type { Config } from 'tailwindcss'

// Colors use the RGB-channel format so opacity modifiers (bg-surface/80,
// text-steel/60, border-line/10 …) resolve against the tokens in tokens.css.
// The site has a single light theme — there is no dark variant to switch to.
function rgb(channel: string) {
  return `rgb(var(${channel}) / <alpha-value>)`
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface:      rgb('--c-surface'),
        canvas:       rgb('--c-canvas'),
        mist:         rgb('--c-mist'),
        raised:       rgb('--c-raised'),
        ink:          rgb('--c-ink'),
        steel:        rgb('--c-steel'),
        line:         rgb('--c-line'),
        panel:        rgb('--c-panel'),
        'red-accent': rgb('--c-red-accent'),
        'red-dark':   rgb('--c-red-dark'),
        'red-text':   rgb('--c-red-text'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        heading: ['var(--font-heading)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      fontSize: {
        display: ['clamp(2.55rem, 1.3rem + 5.1vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.032em' }],
        h1:      ['clamp(2.25rem, 1.45rem + 3.4vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.026em' }],
        h2:      ['clamp(1.85rem, 1.3rem + 2.3vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.022em' }],
        h3:      ['clamp(1.15rem, 1.02rem + 0.55vw, 1.5rem)', { lineHeight: '1.22', letterSpacing: '-0.012em' }],
        lead:    ['clamp(1.04rem, 0.96rem + 0.38vw, 1.28rem)', { lineHeight: '1.62' }],
        eyebrow: ['0.72rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      spacing: {
        section: 'var(--spacing-section)',
        gutter:  'var(--gutter)',
        header:  'var(--header-h)',
      },
      maxWidth: {
        site: 'var(--max-width)',
      },
      boxShadow: {
        hairline: 'var(--shadow-hairline)',
        card:     'var(--shadow-card)',
        lift:     'var(--shadow-lift)',
        float:    'var(--shadow-float)',
        red:      'var(--shadow-red)',
        header:   'var(--shadow-header)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.77, 0, 0.18, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}

export default config
