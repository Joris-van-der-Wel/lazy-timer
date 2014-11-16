'use strict';

var lazyTimer = require('./index.js');

module.exports = {
        'Invalid arguments': function(test)
        {
                test.throws(function(){ lazyTimer(); });
                test.throws(function(){ lazyTimer(123); });
                test.throws(function(){ lazyTimer(123, 'not a function'); });
                test.throws(function(){ lazyTimer(123, false, 'not a function'); });
                test.throws(function(){ lazyTimer(123, false, [], 'not a function'); });
                test.throws(function(){ lazyTimer(123, false, [], null, 'not a function'); });
                test.done();
        },
        'Invoke using 2 arguments (minimal)': function(test)
        {
                var called = 0;
                var invoker = lazyTimer(1, function()
                {
                        ++called;
                        test.ok(arguments.length === 0);
                        test.ok(this === undefined);
                        test.ok(called === 1);
                        test.done();
                });

                test.expect(9);
                test.strictEqual(invoker.timeout, 0);
                test.strictEqual(invoker.pending, false);
                test.strictEqual(invoker.delay, 1);
                test.strictEqual(invoker.thisObject, undefined); // use strict default, instead of "global" or "window"
                test.strictEqual(invoker.args.length, 0);
                test.strictEqual(invoker.async, false);

                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
        },
        'Invoke using 3 arguments (async)': function(test)
        {
                var called = 0;
                var invoker = lazyTimer(1, true, function(callback)
                {
                        ++called;
                        test.ok(arguments.length === 1);
                        test.ok(this === undefined);
                        test.ok(typeof callback === 'function');
                        test.ok(called === 1);
                        test.ok(invoker.timeout);
                        callback();
                        test.ok(!invoker.timeout);
                        test.done();
                });

                test.expect(13);
                test.strictEqual(invoker.timeout, 0);
                test.strictEqual(invoker.pending, false);
                test.strictEqual(invoker.delay, 1);
                test.strictEqual(invoker.thisObject, undefined);
                test.strictEqual(invoker.args.length, 1);
                test.strictEqual(invoker.async, true);

                invoker();
                var timeout = invoker.timeout;
                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
                test.ok(invoker.timeout === timeout);
        },
        'Invoke using 4 arguments (thisObject)': function(test)
        {
                var called = 0;
                var myThis = {};
                var invoker = lazyTimer(1, false, myThis, function()
                {
                        ++called;
                        test.ok(arguments.length === 0);
                        test.ok(this === myThis);
                        test.ok(called === 1);
                        test.done();
                });

                test.expect(9);
                test.strictEqual(invoker.timeout, 0);
                test.strictEqual(invoker.pending, false);
                test.strictEqual(invoker.delay, 1);
                test.strictEqual(invoker.thisObject, myThis);
                test.strictEqual(invoker.args.length, 0);
                test.strictEqual(invoker.async, false);

                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
        },
        'Invoke using 5 arguments (args)': function(test)
        {
                var called = 0;
                var myThis = {};
                var invoker = lazyTimer(1, false, myThis, ['abc', 5], function(a1, a2)
                {
                        ++called;
                        test.ok(arguments.length === 2);
                        test.ok(this === myThis);
                        test.ok(a1 === 'abc');
                        test.ok(a2 === 5);
                        test.ok(called === 1);
                        test.done();
                });

                test.expect(11);
                test.strictEqual(invoker.timeout, 0);
                test.strictEqual(invoker.pending, false);
                test.strictEqual(invoker.delay, 1);
                test.strictEqual(invoker.thisObject, myThis);
                test.strictEqual(invoker.args.length, 2);
                test.strictEqual(invoker.async, false);

                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
                invoker();
        },
        'Invoke during callback (sync)': function(test)
        {
                var called = 0;
                var invoker = lazyTimer(1, function()
                {
                        ++called;
                        test.ok(called === 1 || called === 2);

                        if (called === 1)
                        {
                                invoker();
                        }

                        if (called === 2)
                        {
                                test.done();
                        }
                });

                test.expect(2);

                invoker();
                invoker();
                invoker();
                invoker();
        },
        'Invoke during callback (async)': function(test)
        {
                var called = 0;
                var invoker = lazyTimer(1, true, function(callback)
                {
                        ++called;
                        test.ok(called === 1 || called === 2);

                        if (called === 1)
                        {
                                invoker();
                        }

                        if (called === 2)
                        {
                                test.done();
                        }

                        callback();
                });

                test.expect(2);

                invoker();
                invoker();
                invoker();
                invoker();
        },
        'Invoke twice using setTimeout': function(test)
        {
                var called = 0;
                var invoker = lazyTimer(1, function()
                {
                        ++called;
                        test.ok(called === 1 || called === 2);

                        if (called === 1)
                        {
                                setTimeout(invoker, 1);
                        }

                        if (called === 2)
                        {
                                test.done();
                        }
                });

                test.expect(2);

                invoker();
                invoker();
                invoker();
                invoker();
        }

};