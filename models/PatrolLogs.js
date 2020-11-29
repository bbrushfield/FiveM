const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    UserId: String,
    Logs: Array,
})

module.exports = mongoose.model("PatrolLogs", Schema,"BBRPLogs");