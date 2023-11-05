const mongoose = require('mongoose');
const Loc = mongoose.model('Location');


const locationReadOne = (req, res) => {
  Loc.findById(req.params.locationid)
    .exec((err, location)=>{
      if(!location){
        return res
          .status(404)
          .json({"message":"location not found"});
      }else if(err){
        return res
          .status(404)
          .json(err);
      }
      res.status(200)   
        .json(location)
      console.log("findById complete");
    });
};

const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = req.query.maxDistance ? parseInt(req.query.maxDistance) : 200000;
  const near = {
    type: "Point",
    coordinates: [lng, lat]
  };
  const geoOptions = {
    distanceField: "distance.calculated",
    key: 'coords',
    spherical: true,
    maxDistance: maxDistance,
  };
  if (!lng || !lat) {
    return res
      .status(404)
      .json({ "message": "lng and lat query parameters are required" }
      );
  }
  try {
    const results = await Loc.aggregate([
      {
        $geoNear: {
          near,
          ...geoOptions
        }
      }
    ]);
    const locations = results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
        distance: `${result.distance.calculated.toFixed()}`
      }
    });
    res
      .status(200)
      .json(locations);
  } catch (err) {
    res
      .status(404)
      .json(err);
  }
};
const locationCreate = (req, res) => {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: {
      type: "Point",
      coordinates: [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ]
    },
    openingTimes: [
      {
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }
    ]
  },
  (err, location) =>{
    if(err){
      res
        .status(400)
        .json(err);
    }else{
      res
        .status(201)
        .json(location);
    }
  });
};
const locationUpdateOne = (req, res) => {};
const locationsDeleteOne = (req, res) => {};

module.exports = {
  locationsListByDistance,
  locationCreate,
  locationReadOne,
  locationUpdateOne,
  locationsDeleteOne
};