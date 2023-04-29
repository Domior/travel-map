import React, { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import { getGoogleProfileInfo } from '../../services/GoogleService';
import { SessionStorageService } from '../../services/SessionStorage';
import { ACCESS_TOKEN_KEY } from '../../constants/storage';

import styles from './index.module.scss';

const LogIn = () => {
  const [token, setToken] = useState();
  const [profile, setProfile] = useState();

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      setToken(codeResponse.access_token);
      SessionStorageService.setItem(ACCESS_TOKEN_KEY, codeResponse.access_token);
    },
    onError: error => console.log('Login Failed:', error),
  });

  const fetchGoogleProfileData = useCallback(async () => {
    const { data } = await getGoogleProfileInfo(token);

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
    <div className={styles.container}>
      {profile ? (
        <div>
          <img src={profile.picture} alt="user_image" />
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button className={styles.loginButton} onClick={() => login()}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default LogIn;
