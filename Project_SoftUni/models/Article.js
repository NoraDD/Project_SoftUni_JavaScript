const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    category: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'},
    date: {type: Date, default: Date.now()}
});

articleSchema.method({
    prepareInsert: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            user.articles.push(this.id);
            user.save();
        });

        let Category = mongoose.model('Category');
        Category.findById(this.category).then(category => {
            // If the article is created without category - if there are no categories.
            if (category) {
                category.articles.push(this.id);
                category.save();
            }
        });
    },

    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            //If user is not deleted already - when we delete from User.
            if (user){
                user.articles.remove(this.id);
                user.save();
            }
        });

        let Category = mongoose.model('Category');
        Category.findById(this.category).then(category => {
            // If the category is not already deleted.
            if (category) {
                category.articles.remove(this.id);
                category.save();
            }
        });
    }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;