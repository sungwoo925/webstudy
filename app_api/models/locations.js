const mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    author: {
      type : String,
      required : true
    },
    rating: {
      type: Number, 
      required: true, 
      min: 0, 
      max: 5
    },
    reviewText: {
      type : String,
      required : true
    },
    createdOn: {
      type: Date, 
      default: Date.now
    }
});

var openingTimeSchema = new mongoose.Schema({
    day: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    facilities: [String],
    coords: {
        type: {
          type: String,
          enum: ['Point'], // 'Point'만 허용하도록 설정
          required: true
        },
        coordinates: {
          type: [Number], // [경도, 위도]
          required: true
        }
      },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

locationSchema.index({coords: '2dsphere'});

mongoose.model('Location', locationSchema);