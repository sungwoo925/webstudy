const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const auth = jwt({
    secret: 'thisIsSecret',
    algorithms: ['HS256'],
    userProperty: 'req.auth'
});
//2019250020박성우
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlAuth = require('../controllers/authentication');

// locations
router
    .route('/locations')
    .get(ctrlLocations.locationsListByDistance)
    .post(ctrlLocations.locationCreate);
router
    .route('/locations/:locationid')
    .get(ctrlLocations.locationReadOne)
    .put(ctrlLocations.locationUpdateOne)
    .delete(ctrlLocations.locationsDeleteOne);

//reviews
router
    .route('/locations/:locationid/reviews')
    .post(auth, ctrlReviews.reviewsCreate);
router
    .route('/locations/:locationid/reviews/:reviewid')
    .get(ctrlReviews.reviewsReadOne)
    .put(auth, ctrlReviews.reviewsUpdateOne)
    .delete(auth, ctrlReviews.reviewsDeleteOne);

router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)

module.exports = router;