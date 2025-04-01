import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { addProductsFormElements } from "@/config";
import { Fragment, useEffect, useState } from "react";
import ImageUpload from "@/components/admin/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProducts,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/productSlice";
import { toast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin/product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const { productList } = useSelector((state) => state.adminProduct);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    // console.log("Image URL before submission:", uploadedImageUrl);
    // console.log("Form Data before submission:", formData);

    currentEditId !== null
      ? dispatch(editProduct({ id: currentEditId, formData })).then((data) => {
          console.log(data);
          if (data.payload.success) {
            toast({ title: "Product updated successfully!" });
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProduct(false);
            setCurrentEditId(null);
          }
        })
      : dispatch(
          addNewProducts({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          console.log(data);
          if (data.payload.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProduct(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product Added",
            });
          }
        });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleDelete(getCurrentProductId) {
    // console.log(getCurrentProductId);
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data.payload.success) {
        toast({ title: "Product deleted successfully!" });
        dispatch(fetchAllProducts());
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(productList, uploadedImageUrl, "productList");
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProduct(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProduct={setOpenCreateProduct}
                setCurrentEditId={setCurrentEditId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProduct}
        onOpenChange={() => {
          setOpenCreateProduct(false);
          setCurrentEditId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditId !== null ? "Edit Product" : "Create New Product"}
            </SheetTitle>
            <SheetDescription>
              {currentEditId !== null
                ? "Edit Your Product Details"
                : "Add Your Product Details "}
            </SheetDescription>
          </SheetHeader>
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setLoadingImage={setLoadingImage}
            loadingImage={loadingImage}
            isEditMode={currentEditId !== null}
          />
          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditId !== null ? "Edit" : "Add"}
              formControls={addProductsFormElements}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
