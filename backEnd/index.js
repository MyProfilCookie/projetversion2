const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT
const cors = require("cors");
console.log(process.env.DB_USER);
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const compression = require("compression");


// middleware
app.use(cors(
  {
    origin: 'http://localhost:5174',
    credentials: true
  }
));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(compression());


app.post("/jwt", async (req, res) => {
  const user = req.body;
  // console.log(user)
  const token = jwt.sign(user, process.env.JW_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});



const verifyToken = require("./api/Middleware/verifyToken");

app.post("/create-payment-intent",verifyToken, async (req, res) => {
  const { price } = req.body;
  const amount = price*100; 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "euro",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



app.get("/", (req, res) => {
  res.send("Hello World! Voici notre api");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
