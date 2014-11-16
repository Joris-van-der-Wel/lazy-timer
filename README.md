lazy-timer
==========
Invoke a function that is expensive to execute (computation, database queries, etc) in a delay. This module creates a new function (the invoker) that wraps your function. Calling the invoker multiple times during the delay only executes your function once. This is especially useful for slowly updating state, based on rapid changes by the user.

INSTALLING
----------
```
npm install lazy-timer --save
```

To use this module in the browser, try [browserify](http://browserify.org/)

USAGE
-----

```javascript
var lazyTimer = require('lazy-timer');
var invoker = lazyTimer(123, function()
{
   console.log('Foo!');
   // The next invocation of the lazy timer is at least 123ms after this function returns
});

invoker();
invoker();
invoker();
invoker();

// Will result in a single line:
// Foo!
```

This module is very useful for slowly updating state, based on rapid changes by the user:

```javascript
var mySearchField = document.querySelector('input[type=text].searchField');
var mySearchResults = document.querySelector('div.searchResults');

// true as the second argument indicates the given callback is asynchronous
var invoker = lazyTimer(123, true, function(done)
{
    myDatabase.doSearchQuery(mySearchField.value, function(error, results)
    {
        mySearchResults.textContent = results;
        done(); // The next invocation of the lazy timer is at least 123ms after the call to done()
    });
});
mySearchField.addEventListener('keydown', invoker);
```

Optionally, you can specify the `this` object and `arguments`:

```javascript
var lazyTimer = require('lazy-timer');
var myThisObject = {foo: 'bar'};
var invoker = lazyTimer(100, false, myThisObject, [123, 456], function(a, b)
{
   console.log(this.foo, a + b);
});

invoker();
invoker();
invoker();
invoker();

// Will result in a single line:
// bar 579
```