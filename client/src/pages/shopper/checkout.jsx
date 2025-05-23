import Address from "@/components/shopper/address";
import coimg from "../../assets/ckeckout/banner.png";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopper/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/orderSlice";
import { toast, useToast } from "@/hooks/use-toast";

function ShopperCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [paymentStart, setPaymentStart] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  // console.log("currentSeletedAddress", currentSeletedAddress);
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;
  function handleInitialPayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your Cart Is Empty!",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address!",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem.productId,
        title: singleCartItem.title,
        image: singleCartItem.image,
        price:
          singleCartItem.salePrice > 0
            ? singleCartItem.salePrice
            : singleCartItem.price,
        quantity: singleCartItem.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "Pending",
      paymentMethod: "Paypal",
      paymentStatus: "Pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("Order Response:", data); // Debugging line

      if (data?.payload && data.payload.success) {
        setPaymentStart(true);
      } else {
        toast({
          title: "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
        setPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={coimg} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 mt-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((cartItem) => (
                <UserCartItemsContent cartItem={cartItem} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="w-full mt-4">
            <Button onClick={handleInitialPayment} className="w-full">
              {paymentStart ? "Processing" : "Payment With Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopperCheckout;
