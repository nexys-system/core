import CrudRoutes from "../../lib/routes/crud";
import P from "../product";
import * as Config from "../config";

const crudRoutes = new CrudRoutes(Config.model, P.qs, P.middlewareAuth);

export default crudRoutes.router.routes();
