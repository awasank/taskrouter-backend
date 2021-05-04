const Router = require('express').Router;
const router = new Router();

const helper = require("../utils/helper");
const controller = require("../controllers")

// POST: /ivr/welcome

router.post('/welcome', async (req, res) => {
  console.log("/welcome")
  res.send(await helper.welcome());
});

// POST: /ivr/menu
router.post('/menu', async (req, res) => {
  console.log("/ivr/menu")
  const digit = req.body.Digits;
  return res.send(await helper.menu(digit));
});

router.post('/products', (req, res) => {
  console.log("/ivr/products")
  const digit = req.body.Digits;
  return res.send(helper.products(digit));
});

router.post('/offers', (req, res) => {
  console.log("/ivr/offers")
  const digit = req.body.Digits;
  return res.send(helper.offers(digit));
});

router.post('/account1', async (req, res) => {
  console.log("/ivr/account1")
  const digit = req.body.Digits;
  return res.send(await helper.account1(digit, res));
});

router.post('/account2:cardDigits', async (req, res) => {
  console.log("/ivr/account2")
  const digit = req.body.Digits;
  const cardDigits = req.params.cardDigits
  return res.send(await helper.account2(null, digit, cardDigits));

});

router.post('/account-options:pin&:cardDigits', async (req, res) => {
  console.log("/ivr/account-options")
  const digit = req.body.Digits;
  return res.send(await helper.accountOptions(digit, req.params.pin, req.params.cardDigits));
});

router.post('/account-options-rewards/:pin&:cardDigits', async (req, res) => {
  console.log("/ivr/account-options-rewards")
  const digit = req.body.Digits;
  return res.send(await helper.rewards(digit, req.params.pin, req.params.cardDigits));
});

router.post('/account-options-rewards-ending/:pin&:cardDigits', async (req, res) => {
  console.log("/account-options-rewards-ending")
  const digit = req.body.Digits;
  return res.send(await helper.rewardsFinal(digit, req.params.pin, req.params.cardDigits));
});

router.post('/account-options-end/:pin&:cardDigits', async (req, res) => {
  console.log("/ivr/account-end")
  const digit = req.body.Digits;
  return res.send(await helper.accountOptionsEnd(digit, req.params.pin, req.params.cardDigits));
});

router.post('/activate-card-number', async (req, res) => {
  console.log("/ivr/activate-card-number")
  const digit = req.body.Digits;
  return res.send( await helper.activateCardNumber(digit));
});

router.post('/activate-card-date:cardDigits', async (req, res) => {
  console.log("/ivr/activate-card-date")
  const digit = req.body.Digits;
  const cardDigits = req.params.cardDigits;
  console.log(cardDigits);

  return res.send( await helper.activateCardDate(digit, cardDigits));
});

router.post('/activate-card-cvv:expDate&:cardDigits', async (req, res) => {
  console.log("/ivr/activate-card-cvv")
  const digit = req.body.Digits;
  return res.send( await helper.activateCardCvv(digit, req.params.expDate ,req.params.cardDigits));
});

router.post('/activate-card-final', (req, res) => {
  console.log("/ivr/activate-card-cvv")
  const digit = req.body.Digits;
  return res.send(helper.activateCardFinal(digit));
});

router.post('/enqueue', function (req, res) {
  console.log("/ivr/enqueue")
  return res.send(helper.customerRp(res));
});



router.post("/task-router/fetch-caller-details", controller.fetchCallerDetails)

// Get gr token
router.post("/task-router/get-gr-token", controller.getGrToken)

// Worker 
router.get("/task-router/fetch-workers", controller.fetchWorkers)
router.post("/task-router/create-worker", controller.createWorker)
router.post("/task-router/update-worker", controller.updateWorker)
router.post("/task-router/delete-worker", controller.deleteWorker)
router.post("/task-router/update-availability", controller.updateAvailability)

// Accept/Reject Reservation
router.post("/task-router/accept-reservation", controller.acceptRejectReservation)

// End conference
router.post ("/task-router/end-conference", controller.endConference)

module.exports = router;
