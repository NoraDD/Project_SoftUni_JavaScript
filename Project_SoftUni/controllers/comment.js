const mongoose = require('mongoose');
const Comment = require('mongoose').model('Comment');
const homeController = require('./../controllers/home');

module.exports = {
    allGet: (req, res) => {
        homeController.fetchCategories().then(function (allCats) {
            Comment.find({}).then(comments => {
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
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/comment/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        let commentArgs = req.body;

        Comment.findOneAndUpdate({_id: id}, {reply: commentArgs.reply, dateReply: Date.now()}).then(reply => {
            res.redirect('/comment/all');
        })
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/comment/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Comment.findById(id).populate('reply').then(comment => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin) {
                    res.redirect('/');
                    return;
                }
                res.render('comment/delete', comment);
            });
        });
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/comment/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Comment.findById(id).then(comment => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin) {
                    res.redirect('/');
                    return;
                }

                Comment.findOneAndRemove({_id: id}).then(comment => {
                    comment.prepareDelete();
                    res.redirect('/comment/all');
                });
            });
        });
    }
};