/// <reference path="./typings/index.d.ts" />

import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';
import {SuperAgent, SuperAgentResponse} from 'superagent-promise';

const request: SuperAgent = superagentPromise(superagent, Promise);

let get = request.get('http://github.com');
let set = get.set('X-Awesome', 'superagent-promise');
let end = set.end();

request
  .get('http://github.com')
  .set('X-Awesome', 'superagent-promise')
  .end()
  .then(r => {
    //console.log(`Status: ${r.status}`);
  })
  .catch(err => {
    //console.error(err);
  });

/**
 * Example of generic function parameter
 * https://github.com/lightsofapollo/superagent-promise/pull/26#issuecomment-242095668
 */

interface Thingable<T> {
    getThing(): T
}

class Thing1<T> implements Thingable<T> {
    public thing: T;
    constructor(t: T) {
        this.thing = t;
    }
    getThing() {
        return this.thing;
    }
}

class Thing2<T> implements Thingable<T> {
    public thing: T;
    constructor(t: T) {
        this.thing = t;
    }
    getThing() {
        return this.thing;
    }
}

function doThing<V, T extends Thingable<V>>(val: V, func: (val: V) => T): T {
   return func(val);
}

doThing(1, (v: number): Thing1<number> => new Thing1(v)).getThing();
doThing(1, (v: number): Thing2<number> => new Thing2(v)).getThing();

/**
 * Scratchpad, playing with passing a generic promise constructor
 */

/**
 * PromiseGiver represents what SuperAgentRequest should be.
 * The givePromise() method represents what the end() method should be.
 * It carries the type of the promise, P.
 */
interface PromiseGiver<V, P extends PromiseLike<V>> {
    givePromise(): P
}

/**
 * An example of an alternate promise implementation, like BlueBird.
 * (But only signatures implemented)
 */
class CustomPromise<V> {
    constructor(executor: (resolve: (value?: V | PromiseLike<V>) => void, reject: (reason?: any) => void) => void) {}
    then<TResult>(onfulfilled?: (value: V) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult> {
        return null;
    }
}

/**
 * Manually creating a PromiseGiver with Promise
 */
let giver1: PromiseGiver<number, Promise<number>> = {
    givePromise(): Promise<number> {
        return new Promise((resolve, reject) => resolve(1));
    }
};
// prom1 is of type Promise<number>
let prom1 = giver1.givePromise();
prom1
  .then(n => {
    // type of n is number
    console.log(n + 1 - 1);
  });

/**
 * Manually creating a PromiseGiver with CustomPromise
 */
let giver2: PromiseGiver<number, CustomPromise<number>> = {
    givePromise(): CustomPromise<number> {
        return new CustomPromise((resolve, reject) => resolve(2));
    }
};
// prom2 is of type CustomPromise<number>
let prom2 = giver2.givePromise();
prom2.then(n => {
    // type of n is number
    // (but won't actually print because CustomPromise not really implemented)
    console.log(n + 1 - 1);
});

/**
 * A copy/paste/modify of PromiseConstructorLike. I did this because PromiseConstructorLike
 * does not expost its generic type T.
 */
type PromCtorLike<T, P extends PromiseLike<T>> = new (executor: (resolve: (value?: T | P) => void, reject: (reason?: any) => void) => void) => P

/**
 * createPromiseGiver represents what request() should be in the superagent-promise typings.
 * In this example, it takes a promise constructor and a value, and should return an instance
 * of the given constructor with the given value.
 */
function createPromiseGiver<V, P extends PromiseLike<V>> (klass: PromCtorLike<V, P>, val: V): PromiseGiver<V, P> {
    return {
        givePromise(): P {
            return new klass((resolve, reject) => resolve(val));
        }
    };
}

/**
 * Create a PromiseGiver with createPromiseGiver() and Promise.
 * prom3 is of type Promise<number>
 */
let prom3 = createPromiseGiver<number, Promise<number>>(Promise, 3).givePromise();
prom3.then(n => {
    // n is of type number
    console.log(n + 1 - 1);
});

/**
 * Create a PromiseGiver with createPromiseGiver() and CustomPromise.
 * prom4 is of type CustomPromise<number>
 */
let prom4 = createPromiseGiver<number, CustomPromise<number>>(CustomPromise, 4).givePromise();
prom4.then(n => {
    // type of n is number
    // (but won't actually print because CustomPromise not really implemented)
    console.log(n + 1 - 1);
});

/**
 * Without the type parameters on createPromiseGiver(), we loose the type information.
 * prom5 is of type PromiseLike<any>
 */
let prom5 = createPromiseGiver(Promise, 5).givePromise();
prom5.then(n => {
    // type of n is any
    // therefore this compiles even though it shouldn't
    // (will print undefined)
    console.log(n.length);
});
