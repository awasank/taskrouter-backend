const VoiceResponse = require('twilio').twiml.VoiceResponse;
const {names_gatherInputCalls, 
       sayPlay,
       gatherInputCalls} = require("./options");

const {checkUserCard,
       checkUserPin,
       getAccountInfo,
       getTransaction,
       getPointsSummary } = require("../controllers")
let helpers;

helpers = {
    account1: async (digits, res) => {
    
        console.log("Handler account1")
        
        var digit = ''
        
        var cardDigits = ''
        var userCardStatus = false;
        if (digits.length === 4) userCardStatus = await checkUserCard(digits);
        
        console.log(userCardStatus)
    
        var userAccount = {};
        if (userCardStatus) {
            cardDigits = digits
            digit = 1
            var say = ''
        } else {
            var say = 'That was an invalid response.'
            digit = 2
        }
        const optionActions = {
          '1': helpers.accountInfo2,
          '2': helpers.accountInfo1,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit](userAccount, digits, cardDigits, say)
          : helpers.redirectWelcome();
    },
    account2: async (userAcc, digits, cardDigits) => {

        console.log("Handler account2")
    
        var digit = ''
    
        const userCardStatus = await checkUserPin(digits, cardDigits);
        console.log(userCardStatus)
        var userAccount = {}
    
        if (userCardStatus) {
            userAccount = userCardStatus
            digit = 1
            var say = ''
        } else {
            digit = 2
            var say = "That was an invalid response."
        }
        const optionActions = {
          '1': helpers.accountMenu,
          '2': helpers.accountInfo2,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit](userAccount, digits, cardDigits, say)
          : helpers.redirectWelcome();
    },
    accountOptions: async (digits, pin, cardDigits) => {
    
        console.log("handler accountOptions")
        console.log(pin)
        console.log(cardDigits)
        const userAccount = await getAccountInfo(pin, cardDigits)
        console.log(userAccount)
        const optionActions = {
          '1': helpers.accountBalance,
          '2': helpers.lastTransaction,
          '3': helpers.rewardPoints,
          '4': helpers.customerRep, // card issue
          '5': helpers.customerRep // account issue
        };
        
        return (optionActions[digits])
          ? optionActions[digits](userAccount, pin, cardDigits)
          : helpers.redirectWelcome();
    },
    accountOptionsEnd: async (digits, pin, cardDigits) => {
    
        console.log("handler accountOptionsEnd")
        console.log(digits)
        console.log(pin)
        console.log(cardDigits)
        
        const optionActions = {
          '1': helpers.accountMenu,
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
        
        return (optionActions[digits])
          ? optionActions[digits](null, pin, cardDigits)
          : helpers.redirectWelcome();
    },
    activateCardCvv: async (digits, expDate, cardDigits) => {
    
        console.log("Activate card cvv")
        console.log(digits)
        var digit = ''
    
        // const userCardStatus = await checkActivationCvv(digits, expDate, cardDigits);
        const userCardStatus = true;
        let cvv = '';
        if (userCardStatus) {
            cvv = digits
            digit = '1';
            // addUserDetail(digits, expDate, cardDigits)
        } else {
            digit = '2';
        }
        console.log(digit)
        const optionActions = {
          '1': helpers.activateFinal,
          '2': helpers.activateCardCv,
          '0': helpers.customerRep
        };
        
        return (optionActions[digit])
          ? optionActions[digit](digits, expDate, cardDigits)
          : helpers.redirectWelcome();
    },
    activateCardDate: async (digits, cardDigits) => {
        console.log("Activate card date" + digits + " " + cardDigits)
        var digit = ''
    
        // const userCardStatus = await checkDateActivation(digits, cardDigits);
        const userCardStatus = true
        console.log(userCardStatus + " userCardStatus")
        let expDate = '';
        if (userCardStatus) {
            expDate = digits;
            digit = 1
        } else {
            digit = 2
        }
        console.log(digit)
        const optionActions = {
          '1': helpers.activateCardCv,
          '2': helpers.activateCardDt,
          '0': helpers.customerRep
        };
    
        return (optionActions[digit])
          ? optionActions[digit](digits, expDate, cardDigits)
          : helpers.redirectWelcome();
    },
    activateCardFinal: async (digits) => {
    
        console.log("Activate Final")
        console.log(digits)
        const optionActions = {
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
        
        return (optionActions[digits])
          ? optionActions[digits]()
          : helpers.redirectWelcome();
    },
    activateCardNumber: async (digits) => {
    
        console.log("Activate card number ")
    
        console.log(digits + " activate card number digit")
        var digit = ''
        // const userCardStatus = await checkActivationNum(digits);
        const userCardStatus = true;
        let cardDigits = '';
        if (userCardStatus) {
            cardDigits = digits;
            digit = 1
        } else {
            digit = 2
        }
        console.log(digit)
        const optionActions = {
          '1': helpers.activateCardDt,
          '2': helpers.activateCardNo,
        };
        
        return (optionActions[digit])
          ? optionActions[digit](digits, null, cardDigits)
          : helpers.redirectWelcome();
    },
    customerRp: (res) => {
        console.log("Handler customer support")
        var twimlResponse = new VoiceResponse();
      
      
        console.log(process.env.WORKFLOW_SID)
        
        var enqueue = twimlResponse.enqueue(
          {workflowSid: process.env.WORKFLOW_SID},"support");
        
        enqueue.task({},JSON.stringify({skills: "support"}));
        
        res.type('text/xml');
        return twimlResponse.toString();
    
    },
    menu: (digit) => {
    
        console.log(digit)
        console.log("Menu")
        const optionActions = {
          '1': helpers.accountInfo1,
          '2': helpers.activateCardNo,
          '0': helpers.customerRep,
          '9': helpers.redirectWelcome
        };
      
        return (optionActions[digit])
          ? optionActions[digit]()
          : helpers.redirectWelcome();
    },
    offers: (digit) => {
        console.log("Products")
        console.log(digit)
        const optionActions = {
          '1': helpers.offersList,
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit]()
          : helpers.redirectWelcome();
    },
    products: (digit) => {
        console.log("Products")
        console.log(digit)
        const optionActions = {
          '1': helpers.productsList,
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit]()
          : helpers.redirectWelcome();
    },
    rewards: async (digit, pin, cardDigits) => {
        console.log("Rewards")
        console.log(digit)
    
        const userAccount = await getAccountInfo(pin, cardDigits)
        const optionActions = {
          '1': helpers.pointBalance, //
          '2': helpers.orderDetails,
          '3': helpers.rewardPoints,
          '4': helpers.accountMenu, // rewards
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit](userAccount, pin, cardDigits)
          : helpers.redirectWelcome();
    },
    rewardsFinal: async (digit, pin, cardDigits) => {
        console.log("Rewards")
        console.log(digit)
        const userAccount = await getAccountInfo(pin, cardDigits)
        const optionActions = {
          '1': helpers.rewardPoints, //
          '2': helpers.accountMenu,
          '9': helpers.redirectWelcome,
          '0': helpers.customerRep
        };
      
        return (optionActions[digit])
          ? optionActions[digit](userAccount, pin, cardDigits)
          : helpers.redirectWelcome();
    },
    welcome: () => {
        const voiceResponse = new VoiceResponse();
        console.log("enter welcome")
        const gather = voiceResponse.gather({
          action: '/ivr/menu',
          numDigits: '1',
          method: 'POST',
        });
        
        const text = gatherInputCalls.filter(e => e.name === names_gatherInputCalls[0])
        
        gather.say(text[0].properties.say);
        voiceResponse.say("Sorry, We were not able to get your response.")
        voiceResponse.redirect("/ivr/welcome")
        return voiceResponse.toString();
    },
    accountBalance:  (userAccount, pin, cardDigits) => {
        console.log("options account balance")
        const cardInfo = sayPlay.filter(e => e.name === "acc_bal_say")
        const text_end = gatherInputCalls.filter(e => e.name === "acc_details_end")
        const voiceResponse = new VoiceResponse();
        
        console.log(pin)
        console.log(cardDigits)
        const gather = voiceResponse.gather({
            action: `/ivr/account-options-end/${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
        console.log(userAccount)
        
        const text = "You account balance is $" + userAccount.Balance;
        
        gather.say(text)
        gather.say(text_end[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    accountInfo1: (d, p, c, say) => {
        console.log("options Account 1")
        
        const cardInfo = gatherInputCalls.filter(e => e.name === "card_info_gather")
        
        const voiceResponse = new VoiceResponse();
        const gather = voiceResponse.gather({
            action: '/ivr/account1',
            numDigits: '4',
            method: 'POST',
        });
        gather.say(say)
        gather.say(cardInfo[0].properties.say
        );
        voiceResponse.say("We did not receive any input.")
        voiceResponse.redirect("/ivr/welcome")
        
        return voiceResponse.toString();
    },
    accountInfo2: (userAcc, digits, cardDigits, say) => {
    
        const cardInfo = gatherInputCalls.filter(e => e.name === "card_info_pin_gather")
        
        const voiceResponse = new VoiceResponse();
        
        console.log("options accountInfo2")
        const gather = voiceResponse.gather({
            action: `/ivr/account2${cardDigits}`,
            numDigits: '6',
            method: 'POST',
        });
        gather.say(say)
        gather.say(cardInfo[0].properties.say
        );
        voiceResponse.say("We did not receive any input.")
        voiceResponse.redirect("/ivr/welcome")
        return voiceResponse.toString();
    },
    accountMenu: (userAccount, pin, cardDigits) => {
        console.log("options accountMenu")
        const cardInfo = gatherInputCalls.filter(e => e.name === "check_acc_menu")
        console.log(cardInfo[0].properties.say)
    
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: `/ivr/account-options${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
        voiceResponse.say("Sorry, we did not receive any input.")
        voiceResponse.redirect("/ivr/welcome")
        return voiceResponse.toString();
    },
    activateCardCv: (digits, expDate, cardDigits) => {
        console.log("Activate Card CVV")
        console.log(cardDigits + " in activate cvv")
        const cardInfo = gatherInputCalls.filter(e => e.name === "activate_cvv_gather")
        console.log(cardInfo[0].properties.say)
    
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: `/ivr/activate-card-cvv${expDate}&${cardDigits}`,
            numDigits: '3',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
        voiceResponse.say("We did not receive any input.")
        voiceResponse.redirect("/ivr/welcome")
        return voiceResponse.toString();
    },
    activateCardDt: (digits, exp, cardDigits) => {
        console.log("Activate Card Number")
        const cardInfo = gatherInputCalls.filter(e => e.name === "card_expiry_activate_gather")
    
        const voiceResponse = new VoiceResponse();
        console.log("cardDigits" + cardDigits);
    
        const gather = voiceResponse.gather({
            action: `/ivr/activate-card-date${cardDigits}`,
            numDigits: '4',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
        voiceResponse.say("We did not receive any input.")
        voiceResponse.redirect("/ivr/welcome")
        return voiceResponse.toString();
    },
    activateCardNo: () => {
        console.log("Activate Card Number")
        const cardInfo = gatherInputCalls.filter(e => e.name === "activate_card_16digit")
        console.log(cardInfo[0].properties.say)
    
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: '/ivr/activate-card-number',
            numDigits: '14',
            method: 'POST',
        });
        // gather.say(say)
        gather.say(cardInfo[0].properties.say
        );
    
        return voiceResponse.toString();
    },
    activateFinal:  () => {
        console.log("Activate Card Number")
        const cardInfo = gatherInputCalls.filter(e => e.name === "activation_final_gather")
        console.log(cardInfo[0].properties.say)
    
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: '/ivr/activate-card-final',
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
    
        return voiceResponse.toString();
    },
    becomeMember: () => {
        console.log("accountMenu")
        const cardInfo = gatherInputCalls.filter(e => e.name === "become_member_gather")
        console.log(cardInfo[0].properties.say)
        const offers_ending = gatherInputCalls.filter(e => e.name === "become_member_say")
        const voiceResponse = new VoiceResponse();
        console.log("Account Menu");
    
        const gather = voiceResponse.gather({
            action: '/ivr/account-options',
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
        gather.say(offers_ending[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    customerRep: (userAccount, pin, cardDigits, say) => {
        console.log("Customer Rep")
    
        const response = new VoiceResponse();
        response.say(say)
        response.say("You will be redirected to a customer representative shortly.")
        response.say("Connecting to customer representative.")
    
        console.log(response.toString());
        response.redirect('/ivr/enqueue');
        return response.toString();
    
    },
    invalidInfo: async (url) => {

        const twiml = new VoiceResponse();
        console.log("Invalid info")
        twiml.say('Returning to the main menu');
      
        twiml.redirect(url);
      
        return twiml.toString();
    
    },
    lastTransaction: async (userAccount, pin, cardDigits) => {
        console.log("last transaction")
    
        const text_end = gatherInputCalls.filter(e => e.name === "acc_details_end")
    
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: `/ivr/account-options-end/${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
        var ut = await getTransaction(userAccount)
        console.log(ut)
        const date = new Date(ut.created_at)
        console.log(date.toDateString())
        gather.say("Your last transaction for the amount of $" + ut.TransactionAmount + " at " + ut.Description + " was on " + date.toDateString())
        gather.say(text_end[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    mainMenuFailed: () => {
        console.log("accountMenu")
        const cardInfo = gatherInputCalls.filter(e => e.name === "main_menu_failed")
        console.log(cardInfo[0].properties.say)
    
        const voiceResponse = new VoiceResponse();
        console.log("Account Menu");
    
        const gather = voiceResponse.gather({
            action: '/ivr/account-options',
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
    
        return voiceResponse.toString();
    },
    offersList: () => {
        const offers = sayPlay.filter(e => e.name === "list_of_promos")
        const offers_ending = gatherInputCalls.filter(e => e.name === "promo_ending")
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: '/ivr/offers',
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(offers[0].properties.say
        );
        gather.say(offers_ending[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    orderDetails: (userAccount, pin, cardDigits) => {
        console.log("Order details")
        const offers = sayPlay.filter(e => e.name === "order_status_play")
        const offers_ending = gatherInputCalls.filter(e => e.name === "rewards_ending_gather")
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: `/ivr/account-options-rewards-ending/${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(offers[0].properties.say
        );
        gather.say(offers_ending[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    pointBalance: async (userAccount, pin, cardDigits) => {
        console.log("Point balance")
        // const offers = sayPlay.filter(e => e.name === "points_play")
        const offers_ending = gatherInputCalls.filter(e => e.name === "rewards_ending_gather")
        const voiceResponse = new VoiceResponse();
        // console.log("Products");
    
        const gather = voiceResponse.gather({
            action: `/ivr/account-options-rewards-ending/${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
        var ut = await getPointsSummary(userAccount)
        console.log(ut)
        if (ut) {
            const text = "You reward point balance is " + ut.totalPoints;
            gather.say(text)
            gather.say(offers_ending[0].properties.say);
        } else {
            // await voiceResponse.say("We cannot find that information.")
            return await helpers.customerRep(null, null, null, "Sorry, we cannot find that information.")
        }
        
    
    
        return voiceResponse.toString();
    },
    productsList:  () => {
        const product = sayPlay.filter(e => e.name === "list_of_products")
        const product_ending = gatherInputCalls.filter(e => e.name === "products_ending")
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: '/ivr/products',
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(product[0].properties.say
        );
        gather.say(product_ending[0].properties.say);
    
    
        return voiceResponse.toString();
    },
    redirectWelcome: () => {
        const twiml = new VoiceResponse();
        console.log("Redirect Welcome")
        twiml.say('Returning to the main menu');
      
        twiml.redirect('/ivr/welcome');
      
        return twiml.toString();
    },
    rewardPoints: (userAccount, pin, cardDigits) => {
        console.log("reward points")
        const cardInfo = gatherInputCalls.filter(e => e.name === "reward_menu")
        
        const voiceResponse = new VoiceResponse();
    
        const gather = voiceResponse.gather({
            action: `/ivr/account-options-rewards/${pin}&${cardDigits}`,
            numDigits: '1',
            method: 'POST',
        });
    
        gather.say(cardInfo[0].properties.say
        );
    
        return voiceResponse.toString();
    }
}

module.exports = helpers