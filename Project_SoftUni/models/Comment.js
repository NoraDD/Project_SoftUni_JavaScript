const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    subject: {type: String, require: true},
    content: {type: String, require: true},
    reply: {type: String, require: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    dateReply: {type: Date, default: Date.now()}
});

commentSchema.method({
    prepareInsert: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            user.comment.push(this.id);
            user.save();
        });
    },

    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            //If user is not deleted already - when we delete from User.
            if (user) {
                user.comments.remove(this.id);
                user.save();
            }
        });
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
