const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const imageModel = require("../models/image-model");
const errors = require("../middleware/error");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
router.get(
  "/home",
  auth,
  (req, res) => {
    res.render("home", {
      username: req.user.name,
    });
  },
  (err, req, res, next) => {
    console.log(err.message);
    res.render("authError", { message: err.message });
  }
);
router.post("/images", auth, upload.single("upload-file"), async (req, res) => {
  console.log(req.file);
  try {
    const imageFile = new imageModel({
      image: req.file ? "/uploads/" + req.file.filename : "",
      owner: req.user._id,
    });
    await imageFile.save();
    res.status(201).json({ imageFile });
  } catch (e) {
    const err = errors.imageErrors(e);
    console.log(err);
    res.status(400).json(err);
  }
});
router.post("/add-watermark", auth, async (req, res) => {
  try {
    const watermarkPosition = { gravity: "south" };
    const watermarkedFileName = `watermarked-`;
    const imagePath = path.join("./public", req.body.uploadedImage);
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({ error: "Image path is missing." });
    }
    if (!fs.existsSync("./public/WaterMarkedImages")) {
      fs.mkdirSync("./public/WaterMarkedImages");
    }
    const watermarkedImagePath = path.join("./public", "WaterMarkedImages");
    if (!fs.existsSync(watermarkedImagePath)) {
      return res.status(400).json({ error: "Watermark path is missing." });
    }
    const imageName = req.body.uploadedImage;
    const index = imageName.indexOf("/", imageName.indexOf("/") + 1);
    const filteredName = imageName.substring(index + 1);

    const width = 900;
    const height = 900;
    const date = new Date();

    const svgText = `
          <svg width="${width}" height="${height}">
            <style>
              .title {font-size: 58px}
            </style>
            <text x="50%" y="75%" text-anchor="middle" class="title">${date.toDateString()}</text>
            <text x="50%" y="90%" text-anchor="middle" class="title">${date.toLocaleTimeString()}</text>
          </svg>`;

    const watermarkText = Buffer.from(svgText);
    await sharp(imagePath)
      .composite([{ input: watermarkText, ...watermarkPosition }])
      .toFile(
        `./public/WaterMarkedImages/${watermarkedFileName + filteredName}`
      );
    res.status(200).json({
      waterMarkedFilePath: `/WaterMarkedImages/${
        watermarkedFileName + filteredName
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});
module.exports = router;
