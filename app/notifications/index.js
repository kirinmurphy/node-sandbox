const app = require('express');
const bodyParser = require('body-parser');

const webpush = require('web-push');

const router = app.Router();

router.use(bodyParser.json());

const publicVapidKey = 'BJyAio3fLUGjC8YhQYW7-2hDdi-jvFBiwl51_EY5ZjFpMp5hi18kk5RLL9IjYGOIh4rJuOgHBfa3Ow_1AeVT3YE';
const privateVapidKey = '_0AbY_Ll3YJ9z2WrjAemLZl2bQc_gpEt7Ip6_59rOzI';

webpush.setVapidDetails('mailto:kirinmurphy@gmail.com', publicVapidKey, privateVapidKey);

router.post('/', (req, res) => {
  console.log('hey');
  const subscription = req.body;

  res.status(201).json({});

  const payload = JSON.stringify({ title: 'Push test' });

  webpush.sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

module.exports = router;