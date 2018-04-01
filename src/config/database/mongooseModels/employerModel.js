const mongoose = require('mongoose');

const employerModel = mongoose.model('employer', {
  email: {
    type: String,
    required: true,
    unique: true,    //email should be unique
    index: true     //indexing
  },
  //owner details
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  contacts: {
    type: Array,
    required: true
  },
  //company details
  companyName: {
    type: String
  },
  companyUrl: {
    type: String
  },
  date: {
    type: String
  },
  companyEmail: {
    type: String
  },
  aboutCompany: {
    type: String
  },
  jobType: {
    type: String,
    enum: ['online', 'not-online', 'both']
  },
  companySize: {
    type: String
  },
  companyType: {
    type: String
  },
  tags: {
    type: Array
  },
  companyBuilding: {
    type: String
  },
  companyAddress: {
    type: String
  },
  companyCountry: {
    type: String
  },
  groups: {
    type: Array
  }
});

module.exports = employerModel;