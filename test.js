var test = require('tape')
var createMatcher = require('./feather-route-matcher')

test('passes all matching cases', function (t) {
  var cases = [
    [
      '/:first/:second',
      '/ok',
      null,
      'should not match if missing required params'
    ],
    ['/:first', '/ok', { first: 'ok' }, 'should extract simple, named params'],
    ['/:first/', '/ok', null, 'should not tolerate missing trailing slashes'],
    [
      '/:first/',
      '/ok/',
      { first: 'ok' },
      'should tolerate trailing slashes when explicit'
    ],
    [
      '/:first/:second',
      '/ok/',
      null,
      'should not match if has slash but no value'
    ],
    [
      '/:first/:second',
      '/ok/second',
      { first: 'ok', second: 'second' },
      'can extract two values'
    ],
    [
      '/:first(/:second)',
      '/ok/second',
      { first: 'ok', second: 'second' },
      'second value optional and is supplied'
    ],
    [
      '/:first(/:second)',
      '/ok',
      { first: 'ok' },
      'second value optional and not supplied'
    ],
    [
      '/users/:id',
      '/something-else',
      null,
      'make sure example works as written in readme'
    ],
    [
      '/users/:id',
      '/users/scrooge-mc-duck',
      { id: 'scrooge-mc-duck' },
      'make sure examples works as written in readme'
    ],
    [
      '/users/:id',
      '/users/47',
      { id: '47' },
      'make sure example works as written in readme'
    ],
    [
      '/schools/:schoolId/teachers/:teacherId',
      '/schools/richland/teachers/47',
      { schoolId: 'richland', teacherId: '47' },
      'example from readme'
    ],
    ['/random/*', '/random/something/stuff', { path: 'something/stuff' }],
    ['/*', '/sdfasfas', { path: 'sdfasfas' }, 'matches wildcards'],
    ['/', '/blah', null, 'returns null if not matching']
  ]

  cases.forEach(function (testCase) {
    var routes = {}
    var [pattern, url, expectedResult, description] = testCase
    var SOME_PAGE = {}

    routes[pattern] = SOME_PAGE
    var matchUrl = createMatcher(routes)

    var result = matchUrl(url)

    if (result) {
      if (expectedResult) {
        t.pass('got a match as expected')
      } else {
        t.fail('should not have gotten a match')
      }
      t.deepEqual(
        result,
        {
          value: SOME_PAGE,
          url: url,
          params: expectedResult,
          pattern: pattern
        },
        description
      )
    } else {
      if (expectedResult) {
        t.fail(
          'should have gotten a match, pattern: ' + pattern + ' url: ' + url
        )
      } else {
        t.pass('got null as expected')
      }
    }
  })

  t.end()
})

test('does not modify route object passed in', (t) => {
  const startingRouteObject = {
    '/': 'something',
    '/else': 'somethingelse'
  }
  const serialized = JSON.stringify(startingRouteObject)
  createMatcher(startingRouteObject)
  t.equal(serialized, JSON.stringify(startingRouteObject))

  t.end()
})
