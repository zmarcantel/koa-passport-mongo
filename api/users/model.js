module.exports = {
      _id             : { type: String, unique: true }
    , name            : String
    , email           : { type: String, unique: true }
    , password        : String
    , photo           : String
};
