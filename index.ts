import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';
import {SuperAgentStatic} from 'superagent-promise';

const request = <SuperAgentStatic>superagentPromise(superagent, Promise);

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
