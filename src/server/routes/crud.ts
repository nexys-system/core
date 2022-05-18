import CrudRoutes from "../../lib/routes/crud";
import P from "../product";
import model from "../../common/generated";

const crudRoutes = new CrudRoutes(model, P.qs, P.middlewareAuth);

export default crudRoutes.router.routes();
