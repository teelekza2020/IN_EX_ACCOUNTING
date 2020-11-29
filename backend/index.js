const server = require("express");
const bodyParser = require("body-parser");
const database = require("./database/database");
const PORT = process.env.PORT || 3001;

server()
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .use(server.json())
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE"
        )
        next();
    })
    .get('/', (req, res) => {
        res.json({message: "IN-EX Accounting!!!"});
    })
    .get('/verifyEmail/:token', async (req, res) => {
        const token = req.params.token;
        const { status } = await database.verifyAccount(token);
        if (status)
            res.send(
                `<html>
                    <script>
                        window.location.href = "http://localhost:3000";
                    </script>
                </html>`);
        else
            res.send(
                `<html>
                    <body><center><h1>Verify Not Success!!<br>Please Try Again.</h1></center></body>
                </html>`);
    })
    .post('/forgotPass', async (req, res) => {
        const { email } = req.body;
        const { status, message } = await database.forgotPassword(email);
        res.json({status, message});
    })
    .post('/login', async (req, res) => {
        const { account } = req.body;
        const { status, message } = await database.loginAccount(account);
        res.json({status, message});
    })
    .post('/register', async (req, res) => {
        const { account } = req.body;
        const { status, message } = await database.createAccount(account);
        res.json({status, message});
    })
    .get('/dashboard', async (req, res) => {
        const { userName } = req.query;
        const { status, message, data } = await database.readDashboard(userName);
        res.json({status, message, data});
    })
    .get('/readProfile', async (req, res) => {
        const { userName } = req.query;
        const { status, message, data } = await database.readProfile(userName);
        res.json({status, message, data});
    })
    .post('/updateProfile', async (req, res) => {
        const { account, currentUpdate } = req.body;
        const { status, message } = await database.updateProfile(account, currentUpdate);
        res.json({status, message});
    })
    .post('/income', async (req, res) => {
        const { user, income } = req.body;
        const { status, message } = await database.createIncome(user, income);
        res.json({status, message});
    })
    .post('/expense', async (req, res) => {
        const { user, expense } = req.body;
        const { status, message } = await database.createExpense(user, expense);
        res.json({status, message});
    })
    .get('/transactions', async (req, res) => {
        const { userName } = req.query;
        const { status, message, data } = await database.readTransactions(userName);
        res.json({status, message, data});
    })
    .listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })