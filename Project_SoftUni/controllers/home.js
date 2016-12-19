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

    /*
     return all cats with articles; Promise won't work without return;
     */
    fetchCategories: () => {
        return Category.find({}).then(categories => {
            let articles = [];
            /*
             convert Catetogy from object to string, so I can get its properties below.
             */
            let allCats = JSON.stringify(categories);
            /*
             parse Catetogy from string to object to string.
             */
            allCats = JSON.parse(allCats);
            /*
             return all articles to a category.
             */
            for (let i = 0; i < allCats.length; i++) {
                articles.push(module.exports.findArticles(allCats[i]._id));
            }
            /*
            promise to fetch all articles to category and then move on.
             */
            return Promise.all(articles).then(function (result) {
                for (let i = 0; i < allCats.length; i++) {
                    /*
                    the result of articles for each category -> stringify and parse.
                     */
                    allCats[i].articlesFull = JSON.stringify(result[i]);
                    allCats[i].articlesFull = JSON.parse(allCats[i].articlesFull);
                }
                return {categories: allCats};
            });
        })
    }
};