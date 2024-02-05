import { Client } from "square";
import { randomUUID } from "crypto";
console.log(process.env.SQUARE_ACCESS_TOKEN);
const { paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox",
});

export default async function handler(req, res) {
  console.log("API triggered");
  if (req.method === "POST") {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: "AUD",
        amount: 100,
      },
    });
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(500).send();
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
