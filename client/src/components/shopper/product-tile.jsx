import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import StarRatingComponent from "../common/star-rating";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { getProductReviews } from "../../store/shop/product-reviewSlice/index";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.shopProductReview);
  const productReviews = reviews?.[product._id] || [];

  useEffect(() => {
    if (product._id && !productReviews.length) {
      dispatch(getProductReviews(product._id));
    }
  }, [dispatch, product._id, productReviews.length]);

  const averageReview =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.reviewValue, 0) /
        productReviews.length
      : 0;

  return (
    <Card className="w-full max-w-sm mx-auto border-green-400">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={product?.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              Out of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} Left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="space-y-2 pt-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-orange-400">
              {brandOptionsMap[product.brand]}
            </span>
            <span>{categoryOptionsMap[product.category]}</span>
          </div>

          <h2 className="text-base font-bold line-clamp-2">{product.title}</h2>

          <div className="flex items-center gap-1 text-sm">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground text-xs">
              ({averageReview.toFixed(1)})
            </span>
          </div>

          <div className="flex items-end gap-2">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-green-500">
                  ${product?.salePrice}
                </span>
                <span className="text-sm line-through text-gray-500">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-primary">
                ${product?.price}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-0">
        <Button
          className="w-full"
          disabled={product.totalStock === 0}
          onClick={() => handleAddToCart(product?._id, product?.totalStock)}
        >
          {product.totalStock === 0 ? "Out Of Stock" : "Add To Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
