const pointsSummary = require("../models/pointsSummary");
const User = require("../models/userSchema")
const UserTransactions = require("../models/userTransactions");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

addUserDetail = async (digits, expDate, cardDigits) => {
    console.log("Controller addUserDetail")

    console.log(digits, expDate, cardDigits)
    User.findOneAndUpdate({cvv: cvv, expirydate: expDate, cardnumber: cardDigits}, (err, user) => {
        user.cardStatus = true
    })
}

checkActivationCvv = async (cvv, expDate, cardDigits) => {
    console.log("Controller checkActivationCvv")
    console.log(digits, expDate, cardDigits)
    const user = await User.findOne({cvv: cvv, expirydate: expDate, cardnumber: cardDigits})
    console.log(user)
    
    if (user) {
        return true
    } else {
        return false
    }
}

checkActivationNum = async (cardNo) => {
    console.log("Controller checkActivationNum")
    console.log(cardNo)
    const user = await User.findOne({cardnumber: cardNo})
    if (user) {
        return true
    } else {
        return false
    }
}

checkDateActivation = async (expDate, cardDigits) => {
    console.log("Controller checkDateActivation")
    console.log(expDate, cardDigits)
    const user = await User.findOne({expirydate: expDate, cardnumber: cardDigits})
    // console.log(user + " date check")
    // return user
    if (user) {
        return true
    } else {
        return false
    }
}

checkUserCard = async (cardNo) => {
    console.log("Controller checkUserCard")
    console.log(cardNo)
    const user = await User.findOne({last_four_digits: cardNo})
    // console.log(cardNo + " db")
    
    if (user) {
        return true
    } else {
        return false
    }
}

checkUserPin = async (pin, cardDigits) => {
    console.log("Controller checkUserPin")
    console.log(pin, cardDigits)
    // console.log(pin)
    var d = pin.substr(0,2) + "/" + pin.substr(2,2) + "/" + pin.substr(4);
    var dp = Number(pin.substr(2,2)) + 1;
    var dl = pin.substr(0,2) + "/" + dp + "/" + pin.substr(4);
    try {
        var db = new Date(d)
        var db1 = new Date(dl)    
        
        db.setHours(-5,0,0,0)
        db1.setHours(-5,0,0,0)
        console.log(db)
        console.log(db1)
        var user = await User.findOne({dob: {$gte: db, $lte: db1}, last_four_digits: cardDigits})
    } catch (error) {
        console.log("Caught Error")
        // console.log(error)
        return false
    }
    
    
    
    
    if (user) {
        return true
    } else {
        return false
    }
}

getAccountInfo = async (pin, cardDigits) => {
    console.log("Controller getAccountInfo")
    var d = pin.substr(0,2) + "/" + pin.substr(2,2) + "/" + pin.substr(4);
    var dp = Number(pin.substr(2,2)) + 1;
    var dl = pin.substr(0,2) + "/" + dp + "/" + pin.substr(4);
    try {
        var db = new Date(d)
        var db1 = new Date(dl)    
        
        db.setHours(-5,0,0,0)
        db1.setHours(-5,0,0,0)
        console.log(db)
        console.log(db1)
        var user = await User.findOne({dob: {$gte: db, $lte: db1}, last_four_digits: cardDigits})
    } catch (error) {
        console.log("Caught Error")
        // console.log(error)
        return false
    }
    
    if (user) {
        return user
    } else {
        return false
    }
}

getTransaction = async (user) => {
    // var userTransLast = user.userTransactions[user.userTransactions.length - 1]
    console.log("User Transaction", user._id)
    
    const userTrans = await UserTransactions.find({user: user._id})
    return userTrans[userTrans.length - 1]
}

getPointsSummary = async (user) => {
    console.log("User Transaction", user._id)

    const points = await pointsSummary.findOne({_id: user._id})
    return points
}

createWorker = (req, res) => {
    const body = req.body
    console.log(body)
    console.log("Create Worker")
    // {
    //     workspaceSID: "",
    //     friendlyName: "",
    //     skills: ""
    // }
    
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                     .workers
                     .create({"friendlyName": body.name, attributes: JSON.stringify({
                        'skills': ['support'],
                        'contact_uri': body.number
                            })
                        })
                     .then(worker => console.log(worker.friendlyName));

    res.send("it worked")

}

deleteWorker = (req, res) => {
    const body = req.body
    console.log(body)
    console.log("Delete Worker")
    // {
    //     workspaceSID: "",
    //     workerSID: ""
    // }
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                   .workers(body.workerSID)
                   .remove();

    res.send('user deleted')
}

updateWorker = (req, res) => {
    const body = req.body
    console.log(body)
    console.log("Update Worker")
    
    // {
    //     workspaceSID: "",
    //     workerSID: ""
    //     skills: ""
    // }
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                 .workers(body.workerSID)
                 .update({attributes: JSON.stringify({
                    'skills': ['support'],
                    'contact_uri': body.number
                        })
                })
                 .then(worker => console.log(worker));

    res.send("it worked")

}

fetchWorkers = (req, res) => {
    console.log("Fetch Wokers")
    
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
    .workers
    .list({limit: 20})
    .then(workers => {
    workers.forEach(w => console.log(w))
    res.send(workers)
    })
      
}

updateAvailability = (req, res) => {
    const body = req.body
    console.log(body)
    console.log("Update Worker")
    activitySid = ''
    if (body.available == true){
        activitySid = 'WAda4ff318cc6a83ef6b98ee299dd08f56'
    }else{
        activitySid = 'WA4672e1a4a93cee5efd3affcb40b68a73'
    }
    // {
    //     workspaceSID: "",
    //     workerSID: ""
    //     skills: ""
    // }
    client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                 .workers(body.workerSID)
                 .update({activitySid: activitySid})
                 .then(worker => console.log(worker));
    res.send("it worked")
}

fetchCallerDetails = async (req, res) => {
    console.log(req.body)
    const body = req.body
    // res.send("Hello")
    if (body) {
        const user = await User.findOne({phone_number: body.number})
        if (user) {
            console.log(user)
            res.send(JSON.stringify(user))
        }
    }
}

getGrToken = async (req, res) => {
    console.log("Getting GR Token")
    return res.status(200).json({
        success: true,
        message: "Token Retrieved",
        token: "Hello"
    })
}

acceptRejectReservation =async(req, res) => {
    console.log("Accept/Reject Reservation")

    if (body.request == true){
        client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                 .tasks(body.taskSID)
                 .reservations(body.reservationSID)
                 .update({reservationStatus: 'accepted'})
                 .then(reservation => 
                    console.log(reservation.workerName) 
                );

        return res.status(200).json({
            success: true,
            message: "Accepted",
            token: "Hello"
        });
    }else{
        client.taskrouter.workspaces(process.env.WORKSPACE_SID)
                 .tasks(body.taskSID)
                 .reservations(body.reservationSID)
                 .update({reservationStatus: 'rejected'})
                 .then(reservation => console.log(reservation.workerName));

        return res.status(200).json({
            success: true,
            message: "Rejected",
            token: "Hello"
        });
    }
}

endConference = async (req , res) => {
    console.log("Ending Conference")
    return res.status(200).json({
        success: true,
        message: "Conference Ended",
        token: "Hello"
    })
}


module.exports = {
    endConference,
    acceptRejectReservation,
    getGrToken,
    fetchCallerDetails,
    updateAvailability,
    fetchWorkers,
    updateWorker,
    deleteWorker,
    createWorker,
    getTransaction,
    getAccountInfo,
    checkUserPin,
    checkUserCard,
    checkDateActivation,
    checkActivationNum,
    checkActivationCvv,
    addUserDetail,
    getPointsSummary
}