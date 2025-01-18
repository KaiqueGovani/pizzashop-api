import { Elysia } from "elysia";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";

const app = new Elysia();

app.use(registerRestaurant).use(sendAuthLink).use(authenticateFromLink);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
