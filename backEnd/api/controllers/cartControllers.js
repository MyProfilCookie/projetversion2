const Carts = require("../models/Carts");

const getCartByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    // console.log(email)

    // Récupère l'email décodé de la requête
    const decodedEmail = req.decoded.email;

    // Vérifie si l'email de la requête correspond à l'email décodé
    if (email !== decodedEmail) {
      res.status(403).json({ message: "Accès interdit!" });
    }

    // Recherche les paniers par email
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajoute tous les paniers
const addToCarts = async (req, res) => {
  const { name, recipe, image, price, email, quantity, menuItemId } = req.body;

  try {
    // Vérifie si menuItemId existe déjà dans la base de données
    const existingCartItem = await Carts.findOne({ email, menuItemId });
    // console.log(existingCartItem)

    if (existingCartItem) {
      // Si menuItemId existe, envoie un message et ne crée pas un nouvel article de panier
      return res
        .status(403)
        .json({ message: "Le produit existe déjà dans le panier." });
    }

    // Si menuItemId n'existe pas, crée un nouvel article de panier
    const cartItem = await Carts.create({
      name,
      recipe,
      image,
      price,
      email,
      quantity,
      menuItemId,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprime un panier
const deleteCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const deletedCart = await Carts.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).json({ message: "Article du panier non trouvé" });
    }

    res.status(200).json({ message: "Article du panier supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Met à jour la quantité du panier
const updateCart = async (req, res) => {
  const cartId = req.params.id;
  const { name, recipe, image, price, email, quantity, menuItemId } = req.body;
  try {
    const updatedCart = await Carts.findByIdAndUpdate(
      cartId,
      { name, recipe, image, price, email, quantity, menuItemId },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Article du panier non trouvé" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère un seul article de panier
const getSingleCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const cartItem = await Carts.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({ message: "Article du panier non trouvé" });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Article du panier non trouvé" });
  }
};

module.exports = {
  getCartByEmail,
  addToCarts,
  deleteCart,
  updateCart,
  getSingleCart,
};
