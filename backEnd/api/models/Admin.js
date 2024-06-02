const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    accessLevel: { type: Number, default: 10 }, // Niveau d’accès supérieur pour l'admin
    permissions: [{ type: String, default: ['create', 'read', 'update', 'delete'] }], // Permissions spécendues
})


const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;