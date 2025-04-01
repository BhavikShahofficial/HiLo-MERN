import { useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePayment } from "@/store/shop/orderSlice";
import { useEffect, useState } from "react";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Use URLSearchParams to retrieve the query parameters from the URL
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId"); // paymentId is correct as per the URL
  const payerId = params.get("PayerID"); // Correct case for PayerID

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log to check the extracted parameters
    console.log("paymentId:", paymentId);
    console.log("payerId:", payerId);

    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      console.log("Dispatching capturePayment with:", {
        paymentId,
        payerId,
        orderId,
      });

      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          console.log("Response from capturePayment:", data);

          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            console.log("Navigating to success page...");
            navigate("/shop/payment-success");
          } else {
            console.log(
              "Payment capture failed:",
              data?.payload?.message || "Unknown error"
            );
            setError("Payment failed. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Error during payment capture:", err);
          setError("An error occurred. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Missing paymentId or payerId in URL");
    }
  }, [paymentId, payerId, dispatch, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please Wait!</CardTitle>
      </CardHeader>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </Card>
  );
}

export default PaypalReturnPage;
