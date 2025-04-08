import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/addressSlice";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 2 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "Maximum 2 addresses allowed",
        variant: "destructive",
      });
      return;
    }
    currentEditedId !== null
      ? dispatch(
          editAddress({
            addressId: currentEditedId,
            userId: user.id,
            formData,
          })
        ).then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllAddress(user.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address Updated Successfully",
              status: "success",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user.id,
          })
        ).then((data) => {
          // console.log(data);
          if (data?.payload.success) {
            dispatch(fetchAllAddress(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address Added Successfully",
              status: "success",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    // console.log(getCurrentAddress);
    console.log("Deleting address:", getCurrentAddress);
    dispatch(
      deleteAddress({ userId: user.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload.success) {
        dispatch(fetchAllAddress(user?.id));
        toast({
          title: "Address Deleted Successfully",
          status: "success",
        });
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress.address,
      city: getCurrentAddress.city,
      pincode: getCurrentAddress.pincode,
      phone: getCurrentAddress.phone,
      notes: getCurrentAddress.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user.id));
  }, [dispatch]);

  console.log("address list", addressList);
  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Save" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
