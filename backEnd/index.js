const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT
const cors = require("cors");
console.log(process.env.DB_USER);
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const compression = require("compression");
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const recetteId = req.params.id; // Supposons que l'ID de la recette soit passé en paramètre
    const ext = path.extname(file.originalname);
    cb(null, `${recetteId}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Route d'upload
app.post('/api/recettes/:id/upload', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ message: 'Image uploadée avec succès', filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  next();
});
app.use(cors({
  origin: 'http://localhost:5174', // Remplacez par l'URL de votre frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Si vous utilisez des cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());


app.use(compression());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


app.post("/jwt", async (req, res) => {
  const user = req.body;
  // console.log(user)
  const token = jwt.sign(user, process.env.JW_SECRET, {
    expiresIn: "1h",
  });
  res.send({ 
    token: token
    ,
    user: user
    ,
    email: user.email
  });
});

// ayivorvirginie26
// wKWrXh7j14xwoID3

// connection a la base de données
mongoose
.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myblog.5qztkw7.mongodb.net/myblog?retryWrites=true&w=majority&appName=myblog`
)
.then(() => console.log("Base de données MongoDB connectée"))
.catch((err) => console.log(err));


// importation des routes
const recetteRoutes = require("./api/routes/recette.routes");
const userRoutes = require("./api/routes/user.routes");
const adminStats =  require('./api/routes/adminStats.routes');
const orderStats = require("./api/routes/orderStats.routes");
const paymentRoutes = require("./api/routes/payment.routes");
const cartsRoutes = require("./api/routes/cart.routes");
const routerImages = require('./api/routes/images.routes')

// routes
app.use('/recettes', recetteRoutes);
app.use('/users', userRoutes);
app.use('/admin-stats', adminStats);
app.use('/order-stats', orderStats);
app.use('/payments', paymentRoutes);
app.use('/carts', cartsRoutes);
app.use('/images', routerImages);
app.use('/api', paymentRoutes);



const verifyToken = require("./api/Middleware/verifyToken");

// router.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { price } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: price * 100, // montant en centimes
//       currency: 'eur',
//     });

//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



app.get("/", (req, res) => {
  res.send("Hello World! Voici notre api");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
