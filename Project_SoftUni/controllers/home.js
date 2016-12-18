const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

module.exports = {
    index: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
            res.render('home/index', allCats);
        });
    },

    legalCounselingGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
            res.render('home/staticPages/legalCounseling', allCats);
        });
    },

    legalAdvicesGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/legalAdvices', allCats);
        });
    },

    lawSuitsGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/lawSuits', allCats);
        });
    },

    yourRightsGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/yourRights', allCats);
        });
    },

    aboutMeGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/aboutMe', allCats);
        });
    },

    remunerationGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/remunerations', allCats);
        });
    },

    contactMeGet: (req, res) => {
        module.exports.fetchCategories().then(function (allCats) {
        res.render('home/staticPages/contactMe', allCats);
        });
    },


    listCategoryArticles: (req, res) => {
        let id = req.params.id;

        Category.findById(id).populate('articles').then(category => {
            User.populate(category.articles, {path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }
                    res.render('home/article', {articles: category.articles})
            });
        });
    },

    findArticles: (id) => {
        return Category.findById(id).populate('articles').then(category => {
            return User.populate(category.articles, {path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }
                    return category.articles;
            });
        });
    },

    fetchCategories: () => {
        return Category.find({}).then(categories => {
            let articles = [];
            let allCats = JSON.stringify(categories);
            allCats = JSON.parse(allCats);
            for (let i = 0; i < allCats.length; i++) {
                articles.push(module.exports.findArticles(allCats[i]._id));
            }
            return Promise.all(articles).then(function (result) {
                for (let i = 0; i < allCats.length; i++) {
                    allCats[i].articlesFull = JSON.stringify(result[i]);
                    allCats[i].articlesFull = JSON.parse(allCats[i].articlesFull);
                }
                return {categories: allCats};
            });
        })
    }
};