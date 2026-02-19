import { env } from "./config/env";
import { initFirebase } from "./config/firebase";
import app from "./app";

initFirebase();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
