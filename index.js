'use strict';

var undefined = void 123;

/**
 * Invoke a callback function using a timeout, unless this timeout has already been scheduled.
 * This function does not invoke the "callback" itself, it creates and returns a new function that
 * should be used to invoke the "callback".
 * Even though, the returned function can be called as often as desired, the given "callback" will never
 * be called more often than the given "delay" permits.
 *
 * @param {int} delay milliseconds
 * @param {Boolean} [async=false] If "async" is "true", the "callback" is called with a function as its last argument.
 *        This function must be called when the "callback" has completed whatever it needed to do.
 * @param {*} [thisObject=null]
 * @param {Array} [args=[]]
 * @param {function} callback
 * @returns {function} A function that schedules the given callback to be run
 */
module.exports = function(delay, async, thisObject, args, callback)
{
        if (arguments.length === 0 ||
            arguments.length === 1)
        {
                throw Error('Missing arguments, at least a delay and callback must be given');
        }

        if (arguments.length === 2)
        {
                callback = async;
                async = false;
                thisObject = undefined;
                args = [];
        }

        if (arguments.length === 3)
        {
                callback = thisObject;
                thisObject = undefined;
                args = [];
        }

        if (arguments.length === 4)
        {
                callback = args;
                args = [];
        }

        if (typeof callback !== 'function')
        {
                throw Error('callback argument must be a function');
        }

        var lazyTimerInvoker = function()
        {
                lazyTimerInvoker.pending = true;

                if (lazyTimerInvoker.timeout)
                {
                        return;
                }

                lazyTimerInvoker.timeout = setTimeout(lazyTimerInvoker.doCallback, lazyTimerInvoker.delay);
        };

        lazyTimerInvoker.timeout = 0;
        lazyTimerInvoker.pending = false;
        lazyTimerInvoker.async = !!async;
        lazyTimerInvoker.delay = delay;
        lazyTimerInvoker.thisObject = thisObject;
        lazyTimerInvoker.args = args;
        lazyTimerInvoker.callback = callback;

        lazyTimerInvoker.doCallback = function()
        {
                lazyTimerInvoker.pending = false; // if this is set during the "callback", rerun it

                try
                {
                        lazyTimerInvoker.callback.apply(lazyTimerInvoker.thisObject, lazyTimerInvoker.args);
                }
                catch(err)
                {
                        /* istanbul ignore next */
                        lazyTimerInvoker.callbackDone();
                        /* istanbul ignore next */
                        throw err;
                }

                if (!lazyTimerInvoker.async)
                {
                        lazyTimerInvoker.callbackDone();
                }
        };

        lazyTimerInvoker.callbackDone = function()
        {
                lazyTimerInvoker.timeout = 0;

                if (lazyTimerInvoker.pending)
                {
                        // the invoker was called during the callback
                        lazyTimerInvoker.timeout = setTimeout(lazyTimerInvoker.doCallback, lazyTimerInvoker.delay);
                }

                lazyTimerInvoker.pending = false;
        };

        if (lazyTimerInvoker.async)
        {
                lazyTimerInvoker.args.push(lazyTimerInvoker.callbackDone);
        }

        return lazyTimerInvoker;
};