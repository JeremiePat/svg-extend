const { readdirSync } = require('fs')
const { basename } = require('path')

module.exports = {
  id: 'svg-extend',
  viewports: [{ label: 'base', width: 600, height: 600 }],
  scenarios: readdirSync('tests/svg').map(filepath => {
    return {
      label: basename(filepath),
      url: `./tests/svg/${filepath}`
    }
  }),

  paths: {
    engine_scripts:    'node_modules/backstopjs/capture/engine_scripts',
    bitmaps_reference: 'tests/reference',
    bitmaps_test:      'tests/backstop/bitmaps_test',
    html_report:       'tests/backstop/html_report',
    ci_report:         'tests/backstop/ci_report'
  },
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript:  'puppet/onReady.js',
  report: ['CI'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox']
  },
  debug: false,
  debugWindow: false
}
