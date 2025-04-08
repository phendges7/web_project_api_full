const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          return /^(https?:\/\/)(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            v
          );
        },
        message: (props) => `${props.value} não é um link válido!`,
      },
    },
    owner: {
      type: String,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: Array,
        ref: "user",
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true }, // Garante que campos virtuais sejam incluídos no JSON
    toObject: { virtuals: true }, // Garante que campos virtuais sejam incluídos quando convertido para objeto
  }
);

module.exports = mongoose.model("card", cardSchema);
