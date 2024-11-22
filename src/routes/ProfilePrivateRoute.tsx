// import React,{ useEffect,useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../utils/ReduxStore/store/store";

// interface ProfileProtectRouteName {
//     children: React.FC;
// }

// export const ProfileProtectRoute: React.FC<ProfileProtectRouteName> = ({
//     children: Children,
// }) => {
 
//     const { username } = useParams<{ username: string }>();
//     const navigate = useNavigate();
//     const loggedUserName = useSelector(
//         (state: RootState) => state?.user?.userInfo?.user?.name
//     );

//     useEffect(() => {
//         if (!username || username === "home") {
//             return;
//         }
//         if (!loggedUserName) {
            
//             navigate("/error", { replace: true });
//             return;
//         }
        
//         if (username !== loggedUserName) {
//             navigate("/error", { replace: true });
//         }
//         // if (username !== loggedUserName && loggedUserName) {
//         //     navigate(`/${loggedUserName}`, { replace: true });
//         // }
//     }, [username, loggedUserName, navigate]);

  
//     return <Children />;
// };


