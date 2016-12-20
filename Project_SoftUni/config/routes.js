const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const articleController = require('./../controllers/article');
const adminController = require('./../controllers/admin/admin');
const commentController = require('./../controllers/comment');
const searchController = require('./../controllers/search');

module.exports = (app) => {

    app.get('/', homeController.index);
    app.get('/category/:id', homeController.listCategoryArticles);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/details', userController.detailsGet);

    app.get('/home/staticPages/legalCounseling', homeController.legalCounselingGet);

    app.get('/home/staticPages/legalAdvices', homeController.legalAdvicesGet);

    app.get('/home/staticPages/lawSuits', homeController.lawSuitsGet);

    app.get('/home/staticPages/yourRights', homeController.yourRightsGet);

    app.get('/home/staticPages/aboutMe', homeController.aboutMeGet);

    app.get('/home/staticPages/remunerations', homeController.remunerationGet);

    app.get('/home/staticPages/contactMe', homeController.contactMeGet);

    app.get('/article/details/:id', articleController.details);

    app.get('/comment/all', commentController.allGet);
    app.post('/comment/all', commentController.createPost);

    app.post('/comment/edit/:id', commentController.editPost);

    app.post('/comment/delete/:id', commentController.deletePost);

    app.post('/article/search', searchController.searchArtPost);

    app.use((req, res, next) => {
        if (req.isAuthenticated()) {
            req.user.isInRole('Admin').then(isAdmin=> {
                if (isAdmin) {
                    next();
                } else {
                    res.redirect('/');
                }
            })
        } else {
            res.redirect('/user/login');
        }
    });

    app.get('/article/create', articleController.createGet);
    app.post('/article/create', articleController.createPost);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);

    app.get('/admin/user/all', adminController.user.all);

    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);

    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/category/all', adminController.category.all);

    app.get('/admin/category/create', adminController.category.createGet);
    app.post('/admin/category/create', adminController.category.createPost);

    app.get('/admin/category/edit/:id', adminController.category.editGet);
    app.post('/admin/category/edit/:id', adminController.category.editPost);

    app.get('/admin/category/delete/:id', adminController.category.deleteGet);
    app.post('/admin/category/delete/:id', adminController.category.deletePost);
};
