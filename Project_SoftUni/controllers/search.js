const mongoose = require('mongoose');
const Article = require('mongoose').model('Article');

module.exports = {
    searchArtPost: (req, res) => {
        let title = req.body.title; /* take the info from the body, from the request, body contains all formInputs by name*/
        Article.find({title: title}).then(articles => {
            if (articles.length === 0) {
                res.render('article/search', {message: "Article not found!"});
            } else {
                res.render('article/search', {articles: articles});
            }
        })
    }
};