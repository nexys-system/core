type Uuid = string;
interface OptionSet {
  id: number;
  name: string;
}

import ProductService from "./service";

interface Request {
  host: string;
  mappingIn: any[];
  mappingOut: [];
  method: OptionSet;
  rawbody?: string;
  uri: string;
  uuid: Uuid;
}

interface Workflow {
  uuid: Uuid;
}

interface AppContext {
  requests: Request[];
  workflows: Workflow[];
}

/*
interface Email {
  content: string;
  isHtml: boolean;
  recipient: string;
  title: string;
}

interface EmailOut {}*/

export class ProductContext extends ProductService {
  getContext = (): Promise<AppContext> => this.request("/app/context");

  getRequests = async (): Promise<Request[]> => {
    const { requests } = await this.getContext();
    return requests;
  };

  getRequestDetail = async (uuid: Uuid): Promise<Request> => {
    const requests = await this.getRequests();
    const f = requests.find((x) => x.uuid === uuid);

    if (!f) {
      throw Error("request couuld not be found");
    }

    return f;
  };

  //getRequestsLog = (requestUuid: Uuid) => this.requestService.logs(requestUuid);

  getWorkflows = async (): Promise<Workflow[]> => {
    const { workflows } = await this.getContext();
    return workflows;
  };

  getWorkflowDetail = async (uuid: Uuid): Promise<Workflow> => {
    const workflows = await this.getWorkflows();
    const f = workflows.find((x) => x.uuid === uuid);

    if (!f) {
      throw Error("request couuld not be found");
    }

    return f;
  };

  getWorkflowStates = (_workflowUuid: Uuid) => Promise.resolve([]);

  /*getEmailLogs = async () => this.emailService.logs();

  getEmailLogDetail = async (uuid: Uuid) =>
    this.emailService.logs().then((x) => x.filter((y) => y.uuid === uuid));

  sendEmail = (e: Email): Promise<EmailOut> => {
    const text = e.isHtml ? undefined : e.content;
    const html = e.isHtml ? e.content : undefined;
    return this.emailService.send(e.recipient, e.title, text, html);
  };*/
}

export default ProductContext;
