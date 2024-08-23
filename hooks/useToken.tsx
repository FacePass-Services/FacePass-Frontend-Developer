import { useState, useEffect } from "react";

function useToken() {
  const getToken = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
      }
      return null;
    }
    return null;
  };

  const getFullName = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        const first_name = userToken?.user.first_name;
        const last_name = userToken?.user.last_name;
        const full_name = `${first_name} ${last_name}`;
        return full_name;
      }
      return null;
    }
    return null;
  };

  const getFirstName = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.first_name;
      }
      return null;
    }
    return null;
  };

  const getLastName = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.last_name;
      } else null;
    }
    return null;
  };

  const getEmail = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.email;
      }
      return null;
    }
    return null;
  };

  const getPhoneNumber = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.phone_number;
      }
      return null;
    }
    return null;
  };

  const getGender = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.gender;
      }
      return null;
    }
    return null;
  };

  const getDateOfBirth = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.date_of_birth;
      }
      return null;
    }
    return null;
  };

  const getID = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.id;
      }
      return null;
    }
    return null;
  };
  
  const getLastLoggedIn = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.last_logged_in;
      }
      return null;
    }
    return null;
  }

  const getRole = () => {
    if (typeof window !== "undefined") {
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const userToken = JSON.parse(tokenString);
        return userToken?.user.role;
      }
      return null;
    }
    return null;
  };

  const [token, setToken] = useState(getToken());
  const [username, setUsername] = useState(getFullName());
  const [firstName, setFirstName] = useState(getFirstName());
  const [lastName, setLastName] = useState(getLastName());
  const [email, setEmail] = useState(getEmail());
  const [phoneNumber, setPhoneNumber] = useState(getPhoneNumber());
  const [gender, setGender] = useState(getGender());
  const [dateOfBirth, setDateOfBirth] = useState(getDateOfBirth());
  const [userId, setUserId] = useState(getID());
  const [role, setRole] = useState(getRole());
  const [lastLoggedIn, setLastLoggedIn] = useState(getLastLoggedIn);

  const saveToken = (userToken: any) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
    setUsername(`${userToken.user.first_name} ${userToken.user.last_name}`);
    setFirstName(userToken.user.first_name);
    setLastName(userToken.user.last_name);
    setEmail(userToken.user.email);
    setPhoneNumber(userToken.user.phone_number);
    setGender(userToken.user.gender);
    setDateOfBirth(userToken.user.date_of_birth);
    setUserId(userToken.user.id);
    setLastLoggedIn(userToken.user.last_logged_in);
    setRole(userToken.user.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setPhoneNumber(null);
    setGender(null);
    setDateOfBirth(null);
    setUserId(null);
    setLastLoggedIn(null);
    setRole(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getToken());
      setUsername(getFullName());
      setFirstName(getFirstName());
      setLastName(getLastName());
      setEmail(getEmail());
      setPhoneNumber(getPhoneNumber());
      setGender(getGender());
      setDateOfBirth(getDateOfBirth());
      setUserId(getID());
      setLastLoggedIn(getLastLoggedIn());
      setRole(getRole());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    setToken: saveToken,
    token,
    isLoggedIn: !!token,
    logout,
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    userId,
    lastLoggedIn,
    role,
  };
}

export default useToken;
