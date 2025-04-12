import ProductFilter from "@/components/shopper/filter";
import ProductDetailDialog from "@/components/shopper/product-details";
import ShoppingProductTile from "@/components/shopper/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItem } from "@/store/shop/cartSlice";
import { getProductReviews } from "@/store/shop/product-reviewSlice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/productSlice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShopperListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProduct
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // const cart = useSelector((state) => state.shopCart);
  // console.log("Full shopCart slice:", cart);
  const [sort, setSort] = useState(null);
  const [filter, setFilter] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  useEffect(() => {
    dispatch(getProductReviews()); // fetch all reviews once when shopper page loads
  }, [dispatch]);

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

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
          // .then((cartRes) => {
          //    console.log("fetchCartItem response:", cartRes);
          // });
        }
      })
      .catch((error) => console.error("Cart Error:", error));
  }

  function handleFilter(getSectionId, getCurrentOption) {
    // console.log(getSectionId, getCurrentOption);
    let copyFilters = { ...filter };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilter(copyFilters);
    sessionStorage.setItem("filter", JSON.stringify(copyFilters));
  }
  useEffect(() => {
    setSort("title-atoz");
    setFilter(JSON.parse(sessionStorage.getItem("filter")) || {});
  }, [categorySearchParam]);
  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQueryString = createSearchParamsHelper(filter);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filter]);
  useEffect(() => {
    if (filter !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filter, sortParams: sort })
      );
    }
  }, [dispatch, sort, filter]);

  useEffect(() => {
    // console.log("productDetails changed:", productDetails);
    if (productDetails !== null) {
      setOpenDetailDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value.split(",");
    }
    if (Object.keys(params).length > 0) {
      setFilter(params);
    }
  }, [searchParams]);
  // useEffect(() => {
  //   console.log("cartItem updated:", cartItem);
  // }, [cartItem]);

  // console.log(filter, searchParams, "filter");
  // console.log("cartItem", cartItems);
  // console.log("productList", productList);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-4 md:p-6">
      <ProductFilter filter={filter} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-3 border-b md:flex item-center justify-between">
          <h2 className="text-lg font-bold">Shopper Listings</h2>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {productList?.length || 0}-Items
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-5 w-5" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => {
                    return (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddToCart={handleAddToCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShopperListing;
