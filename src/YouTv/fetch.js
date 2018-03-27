import fetch from 'node-fetch';

export default (url, opts) => fetch(url, {
  ...opts,
  headers: {
    ...(opts && opts.headers),
    ...(opts && opts.token && { Authorization: `Token token=${opts.token}` }),
    'User-Agent': 'YOUTV/2.7.2 (iPhone; iOS 11.2.6; Scale/3.00)',
  },
});
