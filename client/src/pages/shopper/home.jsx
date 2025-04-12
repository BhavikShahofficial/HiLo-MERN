import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/home1.webp";
import bannerTwo from "../../assets/home2.webp";
import bannerThree from "../../assets/home3.webp";
import nikeLogo from "../../assets/brands/nike.png";
import adidasLogo from "../../assets/brands/adidas.png";
import gucciLogo from "../../assets/brands/gucci.png";
import pumaLogo from "../../assets/brands/puma.png";
import jordansLogo from "../../assets/brands/jordans.png";
import zaraLogo from "../../assets/brands/zara.png";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FootprintsIcon,
  ShirtIcon,
  SparkleIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopper/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItem } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailDialog from "@/components/shopper/product-details";
import { getFeatureImage } from "@/store/commonSlice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: SparkleIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "Accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: FootprintsIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", image: nikeLogo },
  { id: "adidas", label: "Adidas", image: adidasLogo },
  { id: "gucci", label: "Gucci", image: gucciLogo },
  { id: "puma", label: "Puma", image: pumaLogo },
  { id: "jordans", label: "Jordans", image: jordansLogo },
  { id: "zara", label: "Zara", image: zaraLogo },
];

function ShopperHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProduct
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  // const slides = [bannerOne, bannerTwo, bannerThree];

  function handleNavigateToListingPage(getCurrentItem, section) {
    // sessionStorage.removeItem("filter");
    // const currentFilter = {
    //   [section]: [getCurrentItem.id],
    // };
    // sessionStorage.setItem("filter", JSON.stringify(currentFilter));
    // navigate("/shop/listing");
    const queryParam = `${section}=${getCurrentItem.id}`;
    navigate(`/shop/listing?${queryParam}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    // console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
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
        }
      })
      .catch((error) => console.error("Cart Error:", error));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    // console.log("productDetails changed:", productDetails);
    if (productDetails && Object.keys(productDetails).length > 0) {
      setOpenDetailDialog(true);
    }
  }, [productDetails]);

  // console.log("productList", productList);

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full relative h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                alt="Slide"
                className={` ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000`}
                key={index}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 ">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    product={productItem}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Shop By Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brand) => (
              <Card
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                key={brand.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={brand.image}
                    alt={brand.label}
                    className="w-16 h-16 object-contain mb-4"
                  />
                  <span className="font-bold">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <ProductDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShopperHome;
