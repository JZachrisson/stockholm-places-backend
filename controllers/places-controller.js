const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
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
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;