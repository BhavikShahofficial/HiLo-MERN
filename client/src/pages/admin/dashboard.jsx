import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImage } from "@/store/commonSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      // console.log(data);
      if (data?.payload?.success) {
        dispatch(getFeatureImage());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  console.log("featureImageList", featureImageList);
  return (
    <div>
      <h1>Upload Images For Feature Section!</h1>
      <ImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setLoadingImage={setLoadingImage}
        loadingImage={loadingImage}
        // isEditMode={currentEditId !== null}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-3 w-[50%]">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImageItem) => (
              <div>
                <img
                  src={featureImageItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
