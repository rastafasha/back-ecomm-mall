/*
 Ruta: /api/notifications
 */

const { Router } = require('express');
const router = Router();
const {
    enviarNotificacion
} = require('../controllers/notificationController');
const mongoose = require('mongoose');
const Subscription = mongoose.model('subscribers');



router.post('/send', enviarNotificacion);

//Post route of subscribe url is as http://host:3000/subscribe
router.post('/save', (req, res) => {
    const subscriptionModel = new Subscription(req.body);
    subscriptionModel.save((err, subscription) => {
        if (err) {
            console.error(`Error occurred while saving subscription. Err: ${err}`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            res.json({
                data: 'Subscription saved.'
            });
        }
    });
});

// fixed the error get request for this route with a meaningful callback
router.get('/', (req, res) => {
    res.json({
        data: 'Invalid Request Bad'
    });
});


module.exports = router;