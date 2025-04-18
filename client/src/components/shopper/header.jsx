import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Logo from "../../assets/logo.png";
import { CircleUser, LogOut, Menu, ShoppingCart, Search } from "lucide-react";
import { SheetTrigger, Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/authSlice";
import UserCartWrapper from "./cart-wrap";
import { useEffect, useState } from "react";
import { fetchCartItem } from "@/store/shop/cartSlice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // function handleNavigate(getCurrentMenuItem) {
  //   sessionStorage.removeItem("filters");
  //   const currentFilter =
  //     getCurrentMenuItem.id !== "home" &&
  //     getCurrentMenuItem.id !== "products" &&
  //     getCurrentMenuItem.id !== "search"
  //       ? {
  //           category: [getCurrentMenuItem.id],
  //         }
  //       : null;

  //   sessionStorage.setItem("filters", JSON.stringify(currentFilter));

  //   location.pathname.includes("listing") && currentFilter !== null
  //     ? setSearchParams(
  //         new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
  //       )
  //     : navigate(getCurrentMenuItem.path);
  // }

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    if (getCurrentMenuItem.id === "home") {
      navigate("/shop/home");
      return;
    }

    if (getCurrentMenuItem.id === "products") {
      navigate("/shop/listing");
      return;
    }

    const category =
      getCurrentMenuItem.id !== "search" ? getCurrentMenuItem.id : null;
    sessionStorage.setItem("filters", JSON.stringify({ category }));

    if (category) {
      if (!location.pathname.includes("/shop/listing")) {
        // Navigate to /shop/listing first, ensuring query parameters are set after
        navigate(`/shop/listing?category=${category}`, { replace: true });
      } else {
        // If already on /shop/listing, just update the query params
        setSearchParams({ category });
      }
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
          to={menuItem.path}
        >
          {menuItem.lable}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  useEffect(() => {
    dispatch(fetchCartItem(user?.id));
  }, [dispatch]);
  return (
    <div className="flex flex-row items-center gap-4 lg:gap-6">
      {/* 🔍 Search Icon */}
      <Button
        onClick={() => navigate("/shop/search")}
        variant="outline"
        size="icon"
      >
        <Search className="w-6 h-6" />
        <span className="sr-only">Search</span>
      </Button>

      {/* 🛒 Cart Button */}
      <Sheet open={openCart} onOpenChange={() => setOpenCart(false)}>
        <Button
          onClick={() => setOpenCart(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-3px] right-[2px] text-lime-500 font-bold ">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCart={setOpenCart}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* 👤 Avatar + Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged In As {user.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <CircleUser className="h-5 w-5 mr-2" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShopHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-background">
      <div className="flex justify-between items-center h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home">
          <img
            src={Logo}
            alt="HiLo"
            className="w-12 lg:w-28 h-auto object-contain"
          />
        </Link>

        {/* Mobile View: Hamburger + Cart + Avatar */}
        <div className="flex items-center gap-4 lg:hidden">
          {/* Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs p-4 overflow-y-auto"
            >
              <MenuItems />
            </SheetContent>
          </Sheet>

          {/* Cart + Avatar */}
          <HeaderRightContent />
        </div>

        {/* Desktop View: Navigation + Account */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShopHeader;
