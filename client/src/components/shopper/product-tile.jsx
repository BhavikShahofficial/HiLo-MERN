import { useSelector } from "react-redux";
import StarRatingComponent from "../common/star-rating";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  // console.log("Product in Tile:", product);
  // console.log("Product Image in Tile:", product.image);
  const { reviews } = useSelector((state) => state.shopProductReview);

  // Instead of filtering the entire list:
  const productReviews = reviews?.[product._id] || [];

  const averageReview =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.reviewValue, 0) /
        productReviews.length
      : 0;

  return (
    <Card className="w-full max-w-sm mx-auto border-green-400">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product.title}
            className="w-[95%] mx-auto h-[250px] p-2 object-cover rounded-[15px]"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              Out of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} Items Left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-3 left-5 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground text-orange-400">
              {brandOptionsMap[product.brand]}
            </span>
            <span className="text-sm text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
          </div>
          <h2 className="text-lg font-bold">{product.title}</h2>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground ml-1 pb-1">
              ({averageReview.toFixed(1)})
            </span>
          </div>

          <div className="flex items-end gap-1">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-green-400">
                  ${product?.salePrice}
                </span>
                <span className="text-md font-lite line-through pb-0.5 text-gray-500">
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
      <CardFooter>
        {product.totalStock === 0 ? (
          <Button className="w-full opacity-70 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            className="w-full mb-0"
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          >
            Add To Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
