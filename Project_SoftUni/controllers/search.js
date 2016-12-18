const mongoose = require('mongoose');
const Article = require('mongoose').model('Article');

module.exports = {
    searchArtPost: (req, res) => {
        let title = req.body.title;
        Article.find({title: title}).then(articles => {
            res.render('article/search', {articles: articles});
        })
    }
};