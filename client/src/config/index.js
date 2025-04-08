export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter User-Name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "E-mail",
    placeholder: "Enter E-mail",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Your Password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "E-mail",
    placeholder: "Enter E-mail",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Your Password",
    componentType: "input",
    type: "password",
  },
];

export const addProductsFormElements = [
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "Enter Product Title",
    componentType: "input",
  },
  {
    label: "Description",
    name: "description",
    placeholder: "Describe Product",
    componentType: "textarea",
  },
  {
    label: "Category",
    name: "category",
    type: "text",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    type: "text",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "gucci", label: "Gucci" },
      { id: "puma", label: "Puma" },
      { id: "jordans", label: "Jordans" },
      { id: "zara", label: "Zara" },
    ],
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    componentType: "input",
    placeholder: "Enter Price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    type: "number",
    componentType: "input",
    placeholder: "Enter Price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    type: "number",
    componentType: "input",
    placeholder: "Available?",
  },
];

export const shoppingMenuItems = [
  {
    id: "home",
    lable: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    lable: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    lable: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    lable: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    lable: "Kids",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    lable: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    lable: "Footwear",
    path: "/shop/listing",
  },
  // {
  //   id: "search",
  //   lable: "Search",
  //   path: "/shop/search",
  // },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  adidas: "Adidas",
  nike: "Nike",
  gucci: "Gucci",
  puma: "Puma",
  jordans: "Jordans",
  zara: "Zara",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "Adidas", label: "adidas" },
    { id: "gucci", label: "Gucci" },
    { id: "puma", label: "Puma" },
    { id: "jordans", label: "Jordans" },
    { id: "zara", label: "Zara" },
  ],
};

export const sortOptions = [
  { id: "price-asc", label: "Price (Lowest)" },
  { id: "price-desc", label: "Price (Highest)" },
  { id: "title-atoz", label: "Title A to Z" },
  { id: "title-ztoa", label: "Title Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
