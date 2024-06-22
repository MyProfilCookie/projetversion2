const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT
const cors = require("cors");
console.log(process.env.DB_USER);
/*const mongoose = require("mongoose");*/
const jwt = require('jsonwebtoken');
const compression = require("compression");
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const {connect} = require("mongoose")
const cookieParser = require('cookie-parser');
const User = require("./api/models/User");
const createError = require('http-errors');
const bcrypt = require('bcrypt');

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// connection a la base de données
connect(process.env.DB)
    .then(function(){
        console.log("connexion à la base réussie")
    })
    .catch(function(err){
        throw new Error(err)
})



// const upload = multer({ storage: storage });

// app.post('/api/recettes/:id/upload', upload.single('image'), (req, res) => {
//   try {
//     res.status(200).json({ message: 'Image uploadée avec succès', filename: req.file.filename });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



// middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  next();
});
app.use(cors({
  origin: 'http://localhost:9009',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     const recetteId = req.params.id; // Supposons que l'ID de la recette soit passé en paramètre
//     const ext = path.extname(file.originalname);
//     cb(null, `${recetteId}${ext}`);
//   }
// });


app.use(compression());

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, 'Email et mot de passe sont requis'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(400, 'Utilisateur non trouvé'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, 'Mot de passe incorrect'));
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Envoyer le cookie avec le token
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 heure en millisecondes
    });

    console.log(`Token from cookie: ${token}`, res.cookies);
    res.status(200).json({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
app.get('/users/profile', async (req, res) => {
  // Exemple de route pour récupérer le profil utilisateur
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/users/login', loginUser);



// importation des routes
const recetteRoutes = require("./api/routes/recette.routes");
const userRoutes = require("./api/routes/user.routes");
const adminStats =  require('./api/routes/adminStats.routes');
const orderStats = require("./api/routes/orderStats.routes");
const paymentRoutes = require("./api/routes/payment.routes");
const cartsRoutes = require("./api/routes/cart.routes");
// const routerImages = require('./api/routes/images.routes')
const contactRoutes = require('./api/routes/contact.routes');

// routes
app.use('/contact', contactRoutes);
app.use('/recettes', recetteRoutes);
app.use('/users', userRoutes);
app.use('/admin-stats', adminStats);
app.use('/order-stats', orderStats);
app.use('/payments', paymentRoutes);
app.use('/carts', cartsRoutes);
// app.use('/images', routerImages);
app.use('/payments', paymentRoutes);

// const payments = [
//   { id: 1, amount: 100, currency: 'USD', email: 'virginie.ayivor@3wa.io' },
//   { id: 2, amount: 200, currency: 'EUR', email: 'virginie.ayivor@3wa.io' },
//   { id: 3, amount: 300, currency: 'USD', email: 'other@example.com' },
// ];

// app.get('/payments', (req, res) => {
//   const email = req.query.email;
//   console.log(`Received request for payments with email: ${email}`);

//   if (!email) {
//     return res.status(400).json({ message: 'Email est requis' });
//   }

//   const userPayments = payments.filter(payment => payment.email === email);
//   console.log('Payments retrieved:', userPayments);

//   res.json(userPayments);
// });


const verifyToken = require("./api/Middleware/verifyToken");
app.use(verifyToken);



app.get("/", (req, res) => {
  res.send("Hello World! Voici notre api");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
