const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Kaknästornet',
    description: 'The tallest building in Stockholm!',
    location: {
      lat: 59.3350475,
      lng: 18.1246094,
    },
    address: 'Mörka Kroken 28-30, 115 27 Stockholm',
    creator: 'u1',
  },
  {
    id: 'p1',
    title: 'Royal Swedish Opera',
    description:
      'The Royal Swedish Opera is a fantastic building and is definitely worth visiting not only for ballet and opera lovers but also for the architecture lovers',
    location: {
      lat: 59.3297345,
      lng: 18.0682942,
    },
    address: 'Gustav Adolfs torg 2, 111 52 Stockholm',
    creator: 'u2',
  },
  {
    id: 'p1',
    title: 'Stockholm City Hall',
    description:
      'Waterside government offices completed in 1923 & made from red brick with a lantern-topped tower.',
    location: {
      lat: 59.3274533,
      lng: 18.0521569,
    },
    address: 'Hantverkargatan 1, 111 52 Stockholm',
    creator: 'u1',
  },
];

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ place });
});

module.exports = router;
