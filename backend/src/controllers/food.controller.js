const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const { v4: uuid } = require("uuid");

async function createFood(req, res) {

     if (!req.foodPartner) {
        return res.status(401).json({ message: "Unauthorized food partner" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Video file required" });
    }

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid(), req.file.mimetype);

       if (!fileUploadResult?.url) {
        return res.status(500).json({
            message: "File upload failed"
        });
    }

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "Food item created successfully",
        food: foodItem
    })
}


async function getFoodItems(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const foodItems = await foodModel.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ foodItems });
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const existingLike = await likeModel.findOne({
            user: userId,
            food: foodId
        });

        // 👉 UNLIKE
        if (existingLike) {
            await likeModel.deleteOne({ _id: existingLike._id });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            });

            return res.status(200).json({
                message: "Food unliked",
                like: false
            });
        }

        // 👉 LIKE
        const like = await likeModel.create({
            user: userId,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        });

        return res.status(201).json({
            message: "Food liked",
            like: true
        });

    } catch (error) {
        console.error("LIKE ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const existingSave = await saveModel.findOne({
            user: userId,
            food: foodId
        });

        // 👉 UNSAVE
        if (existingSave) {
            await saveModel.deleteOne({ _id: existingSave._id });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { savesCount: -1 }
            });

            return res.status(200).json({
                message: "Food unsaved",
                save: false
            });
        }

        // 👉 SAVE
        await saveModel.create({
            user: userId,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        });

        return res.status(201).json({
            message: "Food saved",
            save: true
        });

    } catch (error) {
        console.error("SAVE ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getSavedFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: req.user._id }).populate('food');
    
    if(!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({
            message: "No saved foods found"
        });
    }

    res.status(200).json({
        message: "Saved foods fetched successfully",
        savedFoods
    })
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFood
}