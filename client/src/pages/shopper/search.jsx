import ProductDetailDialog from "@/components/shopper/product-details";
import ShoppingProductTile from "@/components/shopper/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItem } from "@/store/shop/cartSlice";
import { fetchProductDetails } from "@/store/shop/productSlice";
import { getSearchResults, resetSearchResults } from "@/store/shop/searchSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function ShopperSearch() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProduct);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    // console.log("cart items", cartItems);

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this product`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    const payload = {
      productId: getCurrentProductId,
      userId: user?.id,
      quantity: 1,
    };

    console.log("Adding to cart:", payload);

    dispatch(addToCart(payload))
      .then((data) => {
        if (data.payload.success) {
          dispatch(fetchCartItem(user?.id));
          toast({
            title: "Product added to cart",
          });
        }
      })
      .catch((error) => console.error("Cart Error:", error));
  }
  function handleGetProductDetails(getCurrentProductId) {
    // console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);
  useEffect(() => {
    // console.log("productDetails changed:", productDetails);
    if (productDetails !== null) {
      setOpenDetailDialog(true);
    }
  }, [productDetails]);
  // console.log("searchResults", searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8 ">
      <div className="flex justify-center mb-8 ">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold text-center">
          No Results Found!
        </h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddToCart={handleAddToCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShopperSearch;
