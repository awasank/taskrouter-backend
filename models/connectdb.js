const mongoose = require("mongoose")
const User = require("./userSchema");
const UserTransactions = require("./userTransactions");
const PointsSummary = require("./pointsSummary");

module.exports = async function connectdb(){
    
    const users = await User.find({})
    const userL = []
    users.map((user) => {
      if (user.last_four_digits) {
        // console.log(user._id, user.last_four_digits, user.dob)
        userL.push(user)
      }
    })

    var n =10;
    
    // console.log(userL[ind].dob, userL[ind].last_four_digits)
    userL.slice(0,n).map(u => console.log( u.last_four_digits, u.dob.toISOString().substr(0,10)))
    // console.log(user)
    // console.log(ut)
}
