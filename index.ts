/// <reference path="./typings/index.d.ts" />

import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';

const request = superagentPromise(superagent, Promise);

request
  .get('http://github.com')
  .set('X-Awesome', 'superagent-promise')
  .end()
  .then(r => {
    // r is of type SuperAgentResponse
    console.log(`Status: ${r.status}`);
  })
  .catch(err => {
    console.error(err);
  });
