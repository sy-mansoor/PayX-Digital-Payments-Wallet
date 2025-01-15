const mongoose
 = require('mongoose');
    const argon2 = require('argon2');

    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      balance: {
        type: Number,
        default: 100, // Start with a zero
      },
    });

    // Hash the password before saving
    userSchema.pre('save', async function (next) {
      if (this.isModified('password')) {
        try {
          this.password = await argon2.hash(this.password);
        } catch (error) {
          return next(error); // Pass the error to the next middleware
        }
      }
      next();
    });

    // Method to compare passwords for login
    userSchema.methods.comparePassword = async function (candidatePassword) {
      try {
        return await argon2.verify(this.password, candidatePassword);
      } catch (error) {
        throw error; // Re-throw the error to be handled elsewhere
      }
    };

    const User = mongoose.model('User', userSchema);

    module.exports = User;
