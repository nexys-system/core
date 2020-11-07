import * as G from './utils';

test('geturiredirect', () => {
  expect(G.getUriRedirect('/redirect', { r: 'bla' })).toEqual('/redirect?r=bla');
});

test('getOAuthUrl', () => {
  const host = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirect_uri = '/redirect';
  const client_id = 'myclientid';
  const scope: string = [].join('');
  const state = 'myuniquestatetoavoidCSRF';
  const response_type = 'code';
  const prompt = 'consent';
  const access_type = 'offline';
  const include_granted_scopes = true;

  const params = {
    scope,
    state,
    redirect_uri,
    response_type,
    client_id,
    prompt,
    access_type,
    include_granted_scopes
  };
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?scope=&state=myuniquestatetoavoidCSRF&redirect_uri=%2Fredirect&response_type=code&client_id=myclientid&prompt=consent&access_type=offline&include_granted_scopes=true';
  expect(G.oAuthLink(host, params)).toEqual(url);
});

test('getOAuthUr with extra params', () => {
  const host = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirect_uri = '/redirect';
  const client_id = 'myclientid';
  const scope: string = [].join('');
  const state = 'myuniquestatetoavoidCSRF';
  const response_type = 'code';
  const prompt = 'consent';
  const access_type = 'offline';
  const include_granted_scopes = true;
  //const extraParams = { instance: 'myinstance' };

  const params = {
    scope,
    state,
    redirect_uri,
    response_type,
    client_id,
    prompt,
    access_type,
    include_granted_scopes
  };
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?scope=&state=myuniquestatetoavoidCSRF&redirect_uri=%2Fredirect&response_type=code&client_id=myclientid&prompt=consent&access_type=offline&include_granted_scopes=true';
  expect(G.oAuthLink(host, params)).toEqual(url);
});
