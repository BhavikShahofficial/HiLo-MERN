const Address = require("../../models/Address");

const addNewAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const createAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    await createAddress.save();
    return res.status(201).json({
      message: "Address added successfully",
      success: true,
      data: createAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding address",
      success: false,
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User Id required", success: false });
    }

    const addressList = await Address.find({ userId });
    return res.status(200).json({
      message: "Address list fetched successfully",
      success: true,
      data: addressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Fetching address",
      success: false,
    });
  }
};
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ message: "User and Address Id required", success: false });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }
    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding address",
      success: false,
    });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ message: "User and Address Id required", success: false });
    }

    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }
    return res.status(200).json({
      message: "Address Deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding address",
      success: false,
    });
  }
};

module.exports = { addNewAddress, editAddress, fetchAllAddress, deleteAddress };
