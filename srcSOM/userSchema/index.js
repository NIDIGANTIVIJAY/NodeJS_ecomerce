const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      require: true,
      lowerCase: true,
      validate(Values) {
        if (!validator.isEmail(Values)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      minlength: 8,
      trim: true,
      required: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("password cannot contain  password");
        }
      },
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    flag: {
      type: Boolean,
      default: false,
    },
    token: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const mostwatched = new mongoose.Schema({
  contenturl: {
    type: String,
  },
  frequency: {
    type: Number,
  },
  contenturl: {
    type: String,
  },
  tag: {
    type: String,
  },
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log("In AUth", user);
  const token = jwt.sign({ _id: user._id.toString() }, "Relieffirstonetime");
  console.log("00", token, "00");
  user.token = user.token.concat({ token });
  console.log(user.token, "ASD");
  await user.save();

  console.log("After Adding token", user);
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(email, password, user.password);
  console.log(user);
  if (!user) {
    //error
    console.log("Email Id is not Found");
    throw new Error();
  }
  const isMatch = await bycrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    //error
    console.log("Wrong Password");
    throw new Error();
  }
  return user;
};
//hash pain text...
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.flag === false) {
    this.password = await bycrypt.hash(this.password, 8);

    user.flag = true;
  }
  next();
});

const User = new mongoose.model("User", UserSchema);

module.exports = User
