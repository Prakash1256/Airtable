const mongoose = require ('mongoose');

// mongoose.connect("mongodb://127.0.0.1:27017/testapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("MongoDB connected successfully!");
// }).catch((err) => {
//     console.error("MongoDB connection error:", err);
// });



const userSchema = mongoose.Schema({
    image: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensuring unique email
    name: { type: String, required: true }
});


module.exports = mongoose.model('user' ,userSchema);