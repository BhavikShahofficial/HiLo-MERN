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

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} Items Left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent>
          <h2 className="text-lg font-bold mb-1">{product.title}</h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {brandOptionsMap[product.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
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
