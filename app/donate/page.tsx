"use client";

import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";

export default function Page() {
  return (
    <div>
      <PaymentForm
        applicationId="sandbox-sq0idb-m44QXynEl8VBo7XqpxkEIw"
        cardTokenizeResponseReceived={async (
          token: any,
          verifiedBuyer: any
        ) => {
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
  );
}
