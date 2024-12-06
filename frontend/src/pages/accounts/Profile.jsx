import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/userApi";

function Profile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profile: {
      city: "",
      state: "",
      address: "",
      phoneNumber: "",
      profilePicture: "",
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const data = await getProfile();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching request user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      first name: {userData.firstName}
      <br />
      last name: {userData.lastName}
      <br />
      username: {userData.username}
      <br />
      email: {userData.email}
      <br />
      city: {userData.profile.city}
    </div>
  );
}

export default Profile;
