import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';
import {SuperAgent} from 'superagent-promise';

const request = <SuperAgent>superagentPromise(superagent, Promise);

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
