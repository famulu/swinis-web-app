"use client";

import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";

export default function Page() {
  return (
    <div className="grid min-h-screen place-content-center">
      <div className="w-fit">
        <PaymentForm
          applicationId="sandbox-sq0idb-m44QXynEl8VBo7XqpxkEIw"
          cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
            console.log("Starting payment");
            const response = await fetch("/api/pay", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
              }),
            });
            console.log(await response.json());
          }}
          locationId="LSEEVT7Q6EY50"
        >
          <CreditCard />
        </PaymentForm>
      </div>
    </div>
  );
}
