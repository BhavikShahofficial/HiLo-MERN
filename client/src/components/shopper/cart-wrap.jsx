import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCart }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="w-full md:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <p id="cart-description" className="text-sm text-muted-foreground">
          Review your cart items before checking out.
        </p>
      </SheetHeader>

      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item._id} cartItem={item} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="mt-4 border-t pt-4 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCart(false);
          }}
          className="w-full"
        >
          Check Out
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
