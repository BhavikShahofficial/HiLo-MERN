import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItem } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/productSlice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import {
  addProductReview,
  getProductReviews,
} from "@/store/shop/product-reviewSlice";

function ProductDetailDialog({ open, setOpen, productDetails }) {
  // Ensure productDetails is always an object to avoid null errors
  const safeProduct = productDetails || {};

  const {
    image = "/placeholder.jpg",
    title = "Product Name",
    description = "No description available.",
    price = 0,
    salePrice = 0,
  } = safeProduct;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopProductReview);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
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

    // console.log("Adding to cart:", payload);

    dispatch(addToCart(payload))
      .then((data) => {
        if (data.payload.success) {
          dispatch(fetchCartItem(user?.id));
          toast({
            title: "Product added to cart",
          });
          // .then((cartRes) => {
          //    console.log("fetchCartItem response:", cartRes);
          // });
        }
      })
      .catch((error) => console.error("Cart Error:", error));
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      addProductReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getProductReviews(productDetails?._id));
        toast({
          title: "Review Added Successfully!",
          success: true,
        });
      }
      // console.log(data);
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails?._id));
    }
  }, [productDetails]);
  // console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            width={600}
            height={600}
            className="object-cover object-center w-full h-full aspect-square"
          />
        </div>

        <div className="gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold">{title}</h2>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {description}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <p
              className={`text-2xl font-bold text-primary ${
                salePrice > 0 && salePrice < price ? "line-through" : ""
              }`}
            >
              ${price.toFixed(2)}
            </p>
            {salePrice > 0 && salePrice < price ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${salePrice.toFixed(2)}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(1)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-70 cursor-not-allowed">
                Out Of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add To Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="overflow-auto max-h-[300px]">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="gap-1 grid">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <Label>
                Write A Review
                <div className="flex">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
              </Label>
              <Input
                placeholder="Write A Review"
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
              />
              <Button
                onClick={handleAddReview}
                className="w-full"
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailDialog;
