import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQuantity } from "@/store/shop/cartSlice";
import { toast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const product = cartItem;
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProduct);
  const dispatch = useDispatch();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user.id, productId: getCartItem.productId })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Item Deleted successfully",
        });
      }
    });
  }

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getCurrentStock = productList[getCurrentProductIndex].totalStock;
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getCurrentStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this product`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }
    dispatch(
      updateCartItemQuantity({
        userId: user.id,
        productId: getCartItem.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data.payload.success) {
        toast({
          title: "Quantity updated successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-3 p-3 border-rounded">
      <img
        src={product.image}
        alt={product.title || "No title"}
        className="w-[10rem] h-[10rem] rounded object-cover bg-gray-200"
      />
      <div className="flex-1">
        <h3 className="font-extrabold text-black">
          {product.title || "Untitled"}
        </h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
            disabled={cartItem.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <Button
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Qty: {cartItem.quantity}
        </p>
        <div className="flex items-center mt-2">
          <span className="ml-3 font-semibold">
            $
            {(
              (product.salePrice > 0 ? product.salePrice : product.price) *
              cartItem.quantity
            ).toFixed(2)}
          </span>
        </div>
      </div>
      <Trash
        onClick={() => handleCartItemDelete(cartItem)}
        className="cursor-pointer mt-1"
        size={20}
      />
    </div>
  );
}

export default UserCartItemsContent;
