const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({ 
    user:{
        type: Schema.Types.ObjectId,
        ref: "myProfile"
    },
    text1: {
        type: String,
        required: true
    },
    text2: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    upvotes: [
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "myProfile"
        }
    }
    ],
    answers: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "myPrfile"
        },
        text: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }

    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Question = mongoose.model("myQuestion",QuestionSchema);

