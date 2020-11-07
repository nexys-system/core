import Rp from 'request-promise-native';

export interface OAuthHeaders {
  Authorization: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email?: string;
}

// turn into Class

/**
 * buidl redirect uri with extra query parameters (e.g instance)
 * @param url
 * @param extra
 */
export const getUriRedirect = (url: string, extra: { [k: string]: string }): string => {
  const extraArray = Object.entries(extra);

  if (extraArray.length === 0) {
    return url;
  }

  return url + '?' + extraArray.map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
};

export const oAuthLink = (host: string, params: { [k: string]: string | boolean | number }): string => {
  const p: string = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return host + '?' + p;
};

export const callback = async (url: string, body: Object): Promise<string> => {
  const options = {
    url,
    body,
    method: 'POST',
    json: true
  };

  const response = await Rp(options);

  return response.access_token;
};

export const oAuthHeaders = (accessToken: string): OAuthHeaders => {
  return {
    Authorization: 'Bearer ' + accessToken
  };
};
