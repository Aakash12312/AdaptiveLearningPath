const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const childuserSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});
childuserSchema.pre('save',async function(next){
    if(this.isModified('Password')){
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        this.salt = salt;
        this.Password = await bcrypt.hash(this.Password,salt);
        console.log(this.Password);
    }
    next();
});
childuserSchema.statics.passmatch = async function (Email, Password) {
    const user = await this.findOne({ Email });
    if (!user) {
        throw new Error('Incorrect Email');
    }
    console.log(user.Password);
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
        throw new Error('Incorrect Password');
    }

    const token = jwt.sign(
        { id: user._id, Name: user.Name, Email: user.Email, role: user.roles },
        'A@ka$h',
        { expiresIn: '1h' } 
    );
    return token;
}
const childuser = mongoose.model('childuser', childuserSchema);
module.exports = childuser;