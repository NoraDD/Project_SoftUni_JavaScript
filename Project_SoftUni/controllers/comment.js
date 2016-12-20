const mongoose = require('mongoose');
const Comment = require('mongoose').model('Comment');
const homeController = require('./../controllers/home');

module.exports = {
    allGet: (req, res) => {
        homeController.fetchCategoriesWithArticles().then(function (allCats) {
            Comment.find({}).populate('author').then(comments => {
                //Pass the cats arr with articles arr and the comments to the view.
                res.render('comment/all', {categories: allCats.categories, comments: comments});
            })
        });
    },

    createPost: (req, res) => {
        let commentArgs = req.body;

        let errorMsg = '';
        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged in to make comments!'
        } else if (!commentArgs.subject) {
            errorMsg = 'Invalid subject!';
        } else if (!commentArgs.content) {
            errorMsg = 'Invalid content!';
        }

        commentArgs.date = Date.now();

        if (errorMsg) {
            res.render('comment/all', {error: errorMsg});
            return;
        }

        commentArgs.author = req.user.id;
        Comment.create(commentArgs).then(comment => {
            req.user.comments.push(comment.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/comment/all');
                }
            });
        });
    },

    editPost: (req, res) => {
        // get the id from form action url.
        let id = req.params.id;
        // get args from form input fields.
        let commentArgs = req.body;

        Comment.findOneAndUpdate({_id: id}, {reply: commentArgs.reply, dateReply: Date.now()}).then(reply => {
            res.redirect('/comment/all');
        })
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Comment.findOneAndRemove({_id: id}).then(comment => {
            comment.prepareDelete();
            res.redirect('/comment/all');
        });
    }
};