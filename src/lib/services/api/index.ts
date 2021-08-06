import Request from "./request";
import Chain from "./chain";
import Snippet from "./snippet";

const Service = (host: string, token: string) => ({
  Request: new Request(host, token),
  Chain: new Chain(host, token),
  Snippet: new Snippet(host, token),
});

export { Request, Chain, Snippet, Service };

export default Service;
