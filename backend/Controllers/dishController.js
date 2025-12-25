const Dish = require("../models/Dish");

exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.json(dish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDish = async (req, res) => {
  const { name, category, price, description, image, available } = req.body;
  try {
    const dish = new Dish({ name, category, price, description, image, available });
    const savedDish = await dish.save();

    res.status(201).json({
      success: true,
      dish: savedDish,
      secretMessage: "🎉 Congratulations! You have successfully created a new dish. inshaallah in the 2 days provided your Fav Dish"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    const { name, category, price, description, image, available } = req.body;
    dish.name = name ?? dish.name;
    dish.category = category ?? dish.category;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.image = image ?? dish.image;
    dish.available = available ?? dish.available;

    const updatedDish = await dish.save();
    res.json(updatedDish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    await dish.remove();
    res.json({ message: "Dish removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
