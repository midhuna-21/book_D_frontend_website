import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../utils/ReduxStore/store/store";
import { toast } from "sonner";
import { addUser } from "../../utils/ReduxStore/slice/userSlice";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import {validate} from '../../utils/validations/profile-validation';
import GmailUpdate from './GmailUpdate';

interface Address {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  
  }

interface User {
    name?: string;
    email?:string;
    phone?: string;
    isGoogle?: boolean;
    address?: Address;
}


const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state?.user?.userInfo?.user) as User;
    const initialFormData: User = {
        name: user?.name || "",
        email:user?.email || "",
        phone: user?.phone || "",
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            district: user?.address?.district || "",
            state: user?.address?.state || "",
            pincode: user?.address?.pincode || "",
           
          },
    };
 
    const [formData, setFormData] = useState<User>(initialFormData);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      
        setFormData((prevData) => {
          if (['street', 'city', 'district', 'state', 'pincode', 'latitude', 'longitude'].includes(name)) {
            return {
              ...prevData,
              address: {
                ...prevData.address,
                [name]: value,
              },
            };
          }
          return {
            ...prevData,
            [name]: value,
          };
        });
      };
      
      useEffect(() => {
        const hasChanges = Object.keys(formData).some((key) => {
            const currentValue = formData[key as keyof User];
            const initialValue = initialFormData[key as keyof User];
    
            if (typeof currentValue === "string" && typeof initialValue === "string") {
                return currentValue.trim() !== initialValue.trim();
            }
    
            if (typeof currentValue === "object" && typeof initialValue === "object" && currentValue !== null && initialValue !== null) {
       
                return Object.keys(currentValue).some((nestedKey) => {
                    const nestedCurrentValue = currentValue[nestedKey as keyof typeof currentValue];
                    const nestedInitialValue = initialValue[nestedKey as keyof typeof initialValue];
    
                    return nestedCurrentValue !== nestedInitialValue;
                });
            }
    
            return currentValue !== initialValue;
        });
    
        setIsFormChanged(hasChanges);
    }, [formData, initialFormData]);
    


    const handleCancel = () => {
        setFormData(initialFormData);
        setIsFormChanged(false);
    };  

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const { address } = formData;
    
      const isAddressEntered = address?.street || address?.city || address?.district || address?.state || address?.pincode;
      const isFullAddressProvided = address?.street && address?.city && address?.district && address?.state && address?.pincode;
    
      if (isAddressEntered && !isFullAddressProvided) {
        toast.error("Please fill in the complete address details.");
        return;
      }
   
      const isGoogle = user?.isGoogle ?? false;
      const validationResult = validate(
        formData.name || "",
        formData.email || "",
        formData.phone || "",
        address?.street || "",
        address?.city || "",
        address?.district || "",
        address?.state || "",
        address?.pincode || "",
        isGoogle
      );
    
      if (validationResult === true) {
        try {
          const filteredFormData: User = {
            ...formData,
            address: {
              ...address,
              street: address?.street?.trim() || "",
              city: address?.city?.trim() || "",
              district: address?.district?.trim() || "",
              state: address?.state?.trim() || "",
              pincode: address?.pincode?.trim() || "",
           
            }
          };
    
          const response = await userAxiosInstance.put(
            "/update-profile",
            { formData: filteredFormData },
            { withCredentials: true }
          );
    
          if (response.status === 200) {
            setIsFormChanged(false);
            dispatch(addUser(response.data));

            navigate("/home/profile");
            setFormData(filteredFormData);
            toast.success("Profile updated successfully");
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An error occurred, please try again later");
          }
        }
      } else {
        toast.error(validationResult);
      }
    };
       
    return (
      <div className="container px-4 md:px-8 flex flex-col md:flex-row gap-5">
         {user.isGoogle  && (
             <GmailUpdate />
         )}
            <div
    className={`bg-white rounded-lg shadow-xl p-7 ${user.isGoogle ? 'w-full' : 'w-full md:w-2/3 mx-auto'} h-full `}
  >
       <h2 className="text-lg font-bold mb-5 text-gray-700">Profile</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">Name</p>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData.name ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    {!user.isGoogle &&(
                        <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">Email</p>
                        <input
                            type="text"         
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData.email ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    )}
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">Phone</p>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData.phone ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">street</p>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData?.address?.street || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData?.address?.street ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">City</p>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData?.address?.city || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData?.address?.city ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">District</p>
                        <input
                            type="text"
                            id="district"
                            name="district"
                            value={formData?.address?.district || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData?.address?.district ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">State</p>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData?.address?.state || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData?.address?.state ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                    <div>
                        <p className="text-gray-600 font-semibold text-sm mb-3">Pincode</p>
                        <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={formData?.address?.pincode || ""}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border p-2 h-9 ${
                                formData?.address?.pincode ? "bg-gray-100 border-gray-300" : "bg-white border-gray-500"
                            }`}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                {isFormChanged && (
                        <button
                        className="bg-gray-400 hover:bg-gray-500 rounded-md p-1 px-2 font-semibold text-white"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    )}
                    <button
                    onClick={handleSubmit}
                        className={`bg-green-950 rounded-md p-1 px-2 font-semibold text-white ${
                            !isFormChanged ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isFormChanged}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;