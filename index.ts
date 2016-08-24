/// <reference path="./typings/index.d.ts" />

import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';

const request = <superagentPromise.SuperAgent>superagentPromise(superagent, Promise);

let get = request.get('http://github.com');
let set = get.set('X-Awesome', 'superagent-promise');
let end = set.end();

request
  .get('http://github.com')
  .set('X-Awesome', 'superagent-promise')
  .end()
  .then(r => {
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
