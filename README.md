# feather-route-matcher

![](https://img.shields.io/npm/dm/feather-route-matcher.svg)![](https://img.shields.io/npm/v/feather-route-matcher.svg)![](https://img.shields.io/npm/l/feather-route-matcher.svg)

This tiny module exports a single function that takes an object of url patterns and returns a function that can be called to get the matching object, based on the url.

This is in support of experiments I'm doing for building lightweight clientside apps [here](https://github.com/henrikjoreteg/feather-app).

You call `createMatcher` and pass it an object of routes where the key is the url pattern (using same matching logic as Backbone.js) and the result is whatever you want to return as a match to that url. Usually this would be a component representing the page you want to show for that url pattern, but it could be anything.

You could, for example, create a module that exports that function like this:

**routes.js**

```js
import createMatcher from 'feather-route-matcher'
import homePage from './pages/home'
import courseListingPage from './pages/course-listing'
import courseDetailPage from './pages/course-detail'
import notFoundPage from './pages/not-found'

export default createMatcher({
  '/': homePage,
  '/courses': courseListingPage,
  '/courses/:id': courseDetailPage,
  '/*': notFoundPage
})
```

This returns a function that can be called to retrieve the value, along with extracted parameters:

**other.js**

```js
import routeMatcher from './routes'

// call it with a pathname you want to match
routeMatcher('/')
// =>
// {
//   value: homePage,
//   url: '/',
//   params: null
// }

routeMatcher('/courses/47')
// =>
// {
//   value: courseDetailPage,
//   url: '/',
//   params: {
//     id: '47'
//   }
// }

routeMatcher('/some-garbage')
// =>
// {
//   value: notFoundPage,
//   url: '/some/garbage',
//   params: {
//     // anything matched by a wildcard `*`
//     // will return a param named `path`
//     // with whatever existed in the location
//     // where the `*` was
//     path: 'some/garbage'
//   }
// }

```

## why is this useful?

If you treat the `url` in a clientside app as just another piece of application state in a frontend app you'll likely need some sort of `switch` statement or set of `if`/`else` blocks to match the current url with the component you want to show.

That's easy with urls that are known ahead of time, such as `/home` but becomes a bit more arduous when you want to see whether it matches a given pattern and want to extract values such as: `/user/42`. That's where this module helps with.

The result of the matcher is a great candidate for going into a state store, like [redux](http://redux.js.org/).

This module could be used as a really lightweight routing system for a react/redux app without the need for React Router.

## how parameter extraction works

pattern: `'/users/:id'`
url: `'/something-else'`
extracted params: nothing, because it won't match

pattern: `'/users/:id'`
url: `'/users/scrooge-mc-duck'`
extracted params: `{id: 'scrooge-mc-duck'}`

pattern: `'/users/:id'`
url: `'/users/47'`
extracted params: `{id: '47'}`

pattern: `'/schools/:schoolId/teachers/:teacherId'`
url: `'/schools/richland/teachers/47'`
extracted params: `{schoolId: 'richland', teacherId: '47'}`

pattern: `*`
url: `'/asdfas'`
extracted params: `{path: '/asdfas'}`
**note:** extracted param always called `path`

pattern: `'/schools/*`
url: `'/schools/richland/teachers/47'`
extracted params: `{path: 'richland/teachers/47'}`


## Other notes

This module borrows a few extremely well-tested regexes from Backbone.js to do its pattern matching. Thanks for the generous licensing!

Things to be aware of...

1. Order is important, first match wins
2. If you re-use parameter names in the url pattern they'll be overwritten in the result.
3. If you need to parse query string values, match the base url first with this module, then use [`query-string`](http://npmjs.com/package/query-string) to parse query values.


## install

```
npm install feather-route-matcher --save
```

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter. The regex patterns were borrowed from Backbone.js because they're extremely well tested and I want this to Just Work™.

## tests

```
npm run test
```

## changelog

* `4.0.0` - Breaking changes: In the matched response, the property called `page` was renamed `value`. Removed `fallback` option because it's easy to do in app code using this. Fixed bug where passed in route object was being mutated.

* `3.1.0` - Non-breaking conversion of `./index.js` into an esm module. umd version remains available as `./feather-route-matcher.js` and `./feather-route-matcher.min.js`

* `3.0.0` - Changed result to now include the pattern that was matched as well.

* `2.0.1` - Remove accidentally left ES6 usage.

* `2.0.0` - Instead of expecting the values of object passed to `createMatcher` to be function of a certain structure, it now always just returns an object of a pre-determined structure, including the passed url, any extracted params, and a `page` key that contains whatever the original value of that key was.

* `1.0.0` - initial release

## license

[MIT](http://mit.joreteg.com/)
