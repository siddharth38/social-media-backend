const router = require("express").Router();
const Messages = require("../database/message");
// add message
router.post("/add", async (req, res) => {
    try {
        const { from, to, message ,image , type} = req.body;
        console.log(message)
        const data = await Messages.create({
            message:  message,
            file: {  image: image , type : type },
            users: [from, to],
            sender: from,
        });
        data.save();
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (err) {
        console.log(err)
    }
});

//get messages
router.post("/get", async (req, res) => {
    try {
        const { from, to } = req.body;
        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        });
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message,
                image : msg.file.image,
                type : msg.file.type
            };
        });
        return res.json(projectedMessages);
    } catch (err) {
        console.log(err)
    }
});
module.exports = router;
