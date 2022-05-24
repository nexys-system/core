import { request } from "../nexys-service";

interface Category {
  uuid: string;
  name: string;
  parent?: Category;
}

export interface Out {
  uuid: string;
  question: string;
  answer: string;
  category?: Category;
}

class FaqService {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async get(): Promise<Out> {
    return request<undefined>("/faq/list", undefined, this.token);
  }
}

export default FaqService;
