const mongoose = require("mongoose");

const LogSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    On_Logs: {
        type: [Object],
    },
    Off_Logs: {
        type: [Object],
    },
    Total_Logs: {
        type: [Object],
    },
    Total_Time: {
        type: Number,
        required: true,
    },
    Total_Patrols: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean
    }
})

module.exports = mongoose.model("PatrolLogs", LogSchema);