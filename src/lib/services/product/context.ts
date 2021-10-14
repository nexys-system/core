type Uuid = string;
interface OptionSet {
  id: number;
  name: string;
}

interface Request {
  host: string;
  mappingIn: any[];
  mappingOut: [];
  //method: OptionSet;
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
