const functions = require("firebase-functions");
const stripe_key = functions.config().stripeaccount.livepublishkey;
const stripe = require("stripe")(stripe_key);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.stripeEndpoint = functions.https.onRequest(async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("request reached");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(parseInt(amount * 100)),
      currency: "eur",
      payment_method_types: ["card"],
    });
    return res.json({
      status: 1,
      client_secret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "occured" });
  }
});
