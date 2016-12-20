const mongoose = require('mongoose');
const Article = require('mongoose').model('Article');

module.exports = {
    searchArtPost: (req, res) => {
        // take the info from the body, from the request, body contains all formInputs by name.
        let title = req.body.title;
        Article.find({title: title}).then(articles => {
            if (articles.length === 0) {
                res.render('article/search', {message: "Article not found!"});
            } else {
                res.render('article/search', {articles: articles});
            }
        })
    }
};