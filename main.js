const express = require('express');
const cors =  require("cors");
const Blockchain = require('./Models/Blockchain');
const Block = require('./Models/Block');
const { format } = require('date-fns');

let WaChain = new Blockchain();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/check", (_, res) => {
    const isValid = WaChain.checkChainValidity();
    return res.status(200).json({ isValid })
});

app.get("/", (_, res) => res.status(200).json({ message: "WA blockchain API" }));
app.get("/list", (_, res) => res.status(200).json({ ...WaChain }));

app.post("/", (req, res) => {
    const { vote, voter } = req.body;
    WaChain.addNewBlock(new Block(WaChain.blockchain.length, format(new Date(), 'dd/MM/yyyy HH:mm'), { vote, voter }) );
    return res.status(200).json({ message: req.body })
});

app.get("/result", (req, res) => {
    const result = WaChain.blockchain.reduce((acc, item) => {
        if (item.index > 0) {
            console.log(acc[item.data.vote]);
            if (!!acc[item.data.vote]) {
                return {
                    ...acc,
                    [item.data.vote]: acc[item.data.vote]*1 + 1
                }
            } else {
                return {
                    ...acc,
                    [item.data.vote]: 1
                }
            }
        }   
        return acc;
    }, {});
    console.log(result);
    return res.status(200).json({ message: result })
});

app.use("*", (_, res) => res.status(404).json({ message: "page not found" }));

app.listen(3003, () => {
    console.log("server listen at port 3003");
});
