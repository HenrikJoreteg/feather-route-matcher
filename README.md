# feather-route-matcher

![](https://img.shields.io/npm/dm/feather-route-matcher.svg)![](https://img.shields.io/npm/v/feather-route-matcher.svg)![](https://img.shields.io/npm/l/feather-route-matcher.svg)

This tiny module exports a single function that takes an object of url patterns and returns a function that can be called to call the appropriate handler based on the url.

This is in support of experiments I'm doing for building lightweight clientside apps [here](https://github.com/henrikjoreteg/feather-app).

The resulting function is a tiny little route matcher to be used as follows:

```js
import createMatcher from 'feather-route-matcher'
import homePage from './pages/home'
import courseListingPage from './pages/course-listing'
import courseDetailPage from './pages/course-detail'
import notFoundPage from './pages/not-found'

const pageMatcher = createMatcher({
  '/': homePage,
  '/courses': courseListingPage,
  // note the named url parameter
  '/courses/:id': ({state, params}) => {
    const selectedCourse = state.courses.find((course) => course.id === id)

    if (selectedCourse) {
      return courseDetailPage(state, selectedCourse)
    }
  }
})


// your main app render loop
export default (state) => {
  const { url } = state

  let page = pageMatcher(url, state)
  if (!page) {
    page = notFoundPage()
  }

  return (
    <main>
      <h1></h1>
      <nav>
        <a href='/'>home</a> | <a href='/about'>about</a>
      </nav>
      {page}
    </main>
  )
}
```

## why is this useful?

If you treat the `url` in a clientside app as just another piece of application state in a frontend app you'll likely need some sort of `switch` statement or set of `if`/`else` blocks to match the current url with the page you want to show.

That's easy with urls that are known ahead of time, such as `/home` but becomes a bit more arduous when you want to see whether it matches a given pattern and want to extract values such as: `/user/42`. That's where this module helps with.


## how matching works

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


## Other notes

This module borrows a few extremely well-tested regexes from Backbone.js to do it's pattern matching. Thanks for the generous licensing!

Things to be aware of...

1. If you re-use paramater names in the url pattern they'll be overwritten in the result.
2. There's no support for a catchall, like you may have seen in backbone with the splat syntax: `/*anything` this is because it's unecessary for how this is intented to be used (see example above for page not found scenario). 
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

## license

[MIT](http://mit.joreteg.com/)

