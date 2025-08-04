require("dotenv").config({ path: ".env" });

const app = require("express")();

app.use((req, res, next) => {
    if(req.path == "/test") {
        res.send("Test route is working!");
    }
});

module.exports = app;