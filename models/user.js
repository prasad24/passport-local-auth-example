const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true }
});

userSchema.virtual('password')
    .get( function() { return null; } ) //Note you cannot use arrow functions in getter and setter in mongoose. The context of this is lost
    .set( function(value) {             //Note you cannot use arrow functions in getter and setter in mongoose. The context of this is lost
        this.passwordHash = bcrypt.hashSync(value, 10);
    });

userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.login = function(username, password, done) {
    this.findOne({username}, function(err, user) {
        if(err) {
            console.log('Error in authenticate');
            done(err, false);
        }
        if(user && user.authenticate(password)) {
            console.log('Valid Password');
            done(null, user);
        } else {
            console.log('Invalid Password');
            done(null, false);
        }
    })
}

module.exports = mongoose.model('User', userSchema);
