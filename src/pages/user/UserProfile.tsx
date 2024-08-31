import React,{useState} from 'react';
import ProfileHeader from '../../components/users/ProfileHeader';
import ProfileSideBar from '../../components/users/ProfileSideBar';
import Profile from '../../components/users/Profile';
import MyBooks from '../../components/users/MyBooks';
import OrdersList from '../../components/users/OrdersList'

const UserProfile:React.FC=()=>{
   const [activeSection, setActiveSection] = useState('profile');

   const handleSectionChange = (section: string) => {
       setActiveSection(section);
   };


   const renderContent = () => {
      switch (activeSection) {
          case 'myBooks':
              return <MyBooks />;
          case 'Profile':
              return <Profile />;
          case 'security':
              return <div>Security</div>;
          case 'Orders':
              return <div><OrdersList/></div>;
          case 'reviews':
              return <div>Reviews</div>;
          default:
              return <Profile />;
      }
  };

   return (
      <>
         <ProfileHeader />
             <div className="flex flex-col md:flex-row gap-8 p-4">
                <ProfileSideBar onSectionChange={handleSectionChange} />
                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
      </>
   )
}
export default UserProfile;