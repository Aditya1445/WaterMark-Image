const mongoose = require("mongoose");
const autoSequencing = require("../middleware/customSequencing");

const imageSchema = new mongoose.Schema(
  {
    _id: Number,
    image: {
      type: String,
      required: [true, "Must provide image file"],
    },
    owner: {
      type: Number,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
  {
    _id: false,
  }
);
imageSchema.pre("save", async function (next) {
  const image = this;
  if (image.isNew) {
    const nextId = await autoSequencing.getNextSequenceValue("imageId");
    if (!nextId) {
      const newImageId = await autoSequencing.insertCounter("imageId");
      image._id = newImageId;
    } else {
      image._id = nextId;
    }
  }
  next();
});

const imageModel = mongoose.model("image", imageSchema);
module.exports = imageModel;
