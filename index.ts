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
    r.status;
    console.log(`Status: ${r.status}`);
  })
  .catch(err => {
    console.error(err);
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

interface PromiseGiver<V, P extends PromiseLike<V>> {
    givePromise(): P
}

class CustomPromise<V> {
    constructor(executor: (resolve: (value?: V | PromiseLike<V>) => void, reject: (reason?: any) => void) => void) {}
    then<TResult>(onfulfilled?: (value: V) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult> {
        return null;
    }
    /*
    then<TResult>(onfulfilled?: (value: V) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): PromiseLike<TResult> {
        return null;
    }
    */
}

let giver1: PromiseGiver<number, Promise<number>> = {
    givePromise(): Promise<number> {
        return new Promise((resolve, reject) => resolve(1));
    }
};
let prom1 = giver1.givePromise();

let giver2: PromiseGiver<number, CustomPromise<number>> = {
    givePromise(): CustomPromise<number> {
        return new CustomPromise((resolve, reject) => resolve(2));
    }
};
let prom2 = giver2.givePromise();

type PromCtorLike<T, P extends PromiseLike<T>> = new (executor: (resolve: (value?: T | P) => void, reject: (reason?: any) => void) => void) => P

function createPromiseGiver<V, P extends PromiseLike<V>> (klass: PromCtorLike<V, P>, val: V): PromiseGiver<V, P> {
    return {
        givePromise(): P {
            return new klass((resolve, reject) => resolve(val));
        }
    };
}

let prom3 = createPromiseGiver<number, Promise<number>>(Promise, 3).givePromise();
let prom4 = createPromiseGiver<number, CustomPromise<number>>(CustomPromise, 4).givePromise();

let prom5 = createPromiseGiver(Promise, 3).givePromise();
let prom6 = createPromiseGiver(CustomPromise, 4).givePromise();
