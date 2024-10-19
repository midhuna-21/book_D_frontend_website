import React, { useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
    src: string;
    onCropComplete: (croppedImage: Blob) => void;
};

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCropComplete }) => {
    const [crop, setCrop] = useState<Crop>({
        unit: "px",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    const onLoad = (image: HTMLImageElement) => {
        setImageRef(image);
    };

    const onChange = (newCrop: Crop) => {
        setCrop(newCrop);
    };

    const onComplete = (c: PixelCrop) => {
        setCompletedCrop(c);
    };

    const makeClientCrop = async () => {
        if (imageRef && completedCrop?.width && completedCrop?.height) {
            const croppedImage = await getCroppedImg(
                imageRef,
                completedCrop,
                "newFile.jpeg"
            );
            onCropComplete(croppedImage);
        }
    };

    const getCroppedImg = (
        image: HTMLImageElement,
        crop: PixelCrop,
        fileName: string
    ): Promise<Blob> => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const file = new File([blob], fileName, {
                            type: "image/jpeg",
                        });
                        resolve(file);
                    } else {
                        reject(new Error("Failed to crop image"));
                    }
                },
                "image/jpeg",
                1
            );
        });
    };

    return (
        <div>
            <ReactCrop
                crop={crop}
                onChange={onChange}
                onComplete={onComplete}
                // onImageLoaded={onLoad}
            >
                <img
                    src={src}
                    alt="Crop me"
                    onLoad={(e) => onLoad(e.currentTarget)}
                />
            </ReactCrop>
            {completedCrop && (
                <button
                    onClick={makeClientCrop}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                    Crop Image
                </button>
            )}
        </div>
    );
};

export default ImageCropper;
