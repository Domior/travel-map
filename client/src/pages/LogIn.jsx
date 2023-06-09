import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { fetchProfile, resetGoogle } from '../redux/slices/googleSlice';
import { SessionStorageService } from '../services/SessionStorage';
import { ACCESS_TOKEN_KEY } from '../constants/storage';
import { STATUSES } from '../constants/redux';

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, status } = useSelector(state => state.google);

  const [token, setToken] = useState();

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      setToken(codeResponse.access_token);
      SessionStorageService.setItem(ACCESS_TOKEN_KEY, codeResponse.access_token);
      toast.success('You successfully logged in');
    },
    onError: error => {
      toast.error(error.message);
      console.log('Login Failed:', error);
    },
  });

  const logOut = () => {
    googleLogout();
    dispatch(resetGoogle());

    toast.success('You successfully logged out');
  };

  useEffect(() => {
    if (!token) return;

    dispatch(fetchProfile(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (status === STATUSES.SUCCESS) navigate('/stripe');
  }, [status, navigate]);

  return (
    <div className="flex justify-center items-center flex-col h-full">
      {profile ? (
        <button className="btn-base" onClick={logOut}>
          Log out
        </button>
      ) : (
        <button className="btn-base" onClick={() => login()}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default LogIn;
