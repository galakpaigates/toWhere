import app from "./server.js";
import dbConn from "./dbConn.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
dbConn();
