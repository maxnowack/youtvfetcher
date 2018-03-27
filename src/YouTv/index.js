import fetch from './fetch';
import Recording from './Recording';

export default class YouTv {
  async login(user, pass) {
    return fetch('https://www.youtv.de/api/v2/auth_token.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: {
          email: user,
          password: pass,
        },
      }),
    }).then(res => res.json()).then(({ token }) => {
      this.token = token;
    });
  }

  async fetchRecordings() {
    return fetch('https://www.youtv.de/api/v2/recordings.json', { token: this.token })
      .then(res => res.json())
      .then((result) => {
        const { recordings } = result;
        return Promise.all(recordings.map(({ id }) =>
          fetch(`https://www.youtv.de/api/v2/recordings/${id}.json`, { token: this.token })
            .then(res => res.json())
            .then(({ recording }) => new Recording(recording, this.token))));
      });
  }
}
