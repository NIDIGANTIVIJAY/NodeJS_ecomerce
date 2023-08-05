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
    phonenumber: {
      type: String,
      trim: true,
      required: true,
    },
    address:{
      type:String,
      trim: true,
      required:true
    },
    city:{
      type:String,
      trim:true
    },
    admin: {
      type: Boolean,
      default: true,
    },
    flag:{
      type:Boolean,
      default:false
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



UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log("In AUth", user);
  const token = jwt.sign({ _id: user._id.toString() }, "Relieffirstonetime");
  user.token = user.token.concat({ token });
  await user.save();
  console.log("After Adding token", user);
  return token;
};


UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  // console.log(email, password, user.password);
  console.log(user);
  if (!user) {
    //error
    console.log("Email Id is not Found");
    // throw new Error();
    return "Email Id is not Found"
  }
  const isMatch = await bycrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    //error
    console.log("Wrong Password");
      return "Wrong Password"
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
  console.log("After password is encripted",user)
  next();
});

const User = new mongoose.model("CustomerLoginDetails", UserSchema);

module.exports = User
