import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import { GoogleService } from '../services/GoogleService';
import { SessionStorageService } from '../services/SessionStorage';
import { ACCESS_TOKEN_KEY } from '../constants/storage';

const LogIn = () => {
  const [token, setToken] = useState();
  const [profile, setProfile] = useState();

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      setToken(codeResponse.access_token);
      SessionStorageService.setItem(ACCESS_TOKEN_KEY, codeResponse.access_token);
      navigate('/stripe');
    },
    onError: error => console.log('Login Failed:', error),
  });

  const fetchGoogleProfileData = useCallback(async () => {
    const { data } = await GoogleService.getProfileInfo(token);

    setProfile(data);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchGoogleProfileData();
  }, [token, fetchGoogleProfileData]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="flex justify-center items-center flex-col h-full">
      {profile ? (
        <div>
          <img src={profile.picture} alt="user_image" />
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button className="btn-base" onClick={() => login()}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default LogIn;
