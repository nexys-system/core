import app from "./app";
import { port } from "./config";

app.listen(port, () => console.log("Server started at port " + port));
