import Resizer from "react-image-file-resizer";

const handleFileChange = (event, setSelectedImageFile) => {
  const imageFile = event.target.files[0];
  if (imageFile) {
    Resizer.imageFileResizer(
      imageFile,
      300,
      300,
      "PNG",
      90,
      0,
      (image) => {
        setSelectedImageFile(image);
      },
      "blob",
    );
  }
};

export default handleFileChange;
