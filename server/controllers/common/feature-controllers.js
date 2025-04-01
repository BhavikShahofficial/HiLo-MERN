const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    console.log(image, "image");
    const featureImage = new Feature({
      image,
    });
    await featureImage.save();
    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error",
      success: false,
    });
  }
};
const getFeatureImage = async (req, res) => {
  try {
    const images = await Feature.find({});
    res.status(201).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error",
      success: false,
    });
  }
};

module.exports = { addFeatureImage, getFeatureImage };
