const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category = mongoose.model('Category');

module.exports = {
    index: (req, res) => {
        /* allCats return as a result object that contains property category that contains array of cats and array of art*/
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/index', allCats);
        });
    },

    legalCounselingGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/legalCounseling', allCats);
        });
    },

    legalAdvicesGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/legalAdvices', allCats);
        });
    },

    lawSuitsGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/lawSuits', allCats);
        });
    },

    yourRightsGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/yourRights', allCats);
        });
    },

    aboutMeGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/aboutMe', allCats);
        });
    },

    remunerationGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
            res.render('home/staticPages/remunerations', allCats);
        });
    },

    contactMeGet: (req, res) => {
        module.exports.fetchCategoriesWithArticles().then(function (allCats) {
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

    /*
     return all cats with articles; Promise won't work without return;
     return array of categories and arrays of articles.
     */
    fetchCategoriesWithArticles: () => {
        return Category.find({}).populate('articles').then(categories => {
            return {categories: categories};
        });
    }
};