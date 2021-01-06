const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://lh3.googleusercontent.com/proxy/5todpPCeRbe7N9liFowWB5sttpB846CZdZET1B6f8o4w1URnsTQ4_vDjJMVB_VKkyALX3BqDgGfdGKMuNu7K2krh8WRgYYE8r-oTVWdDiYlfVf_y3Zt0HBrALaN3mtOMfw',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
