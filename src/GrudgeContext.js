import id from 'uuid/v4';
import React from 'react';
import initialState from './initialState';
import { createContext, useCallback, useReducer } from 'react';

const ADD_GRUDGE = 'ADD_GRUDGE';
const FORGIVE = 'FORGIVE';

export const GrudgeContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_GRUDGE:
      return [action.payload, ...state];
    case FORGIVE:
      return state.map((grudge) => {
        if (grudge.id !== action.payload.id) return grudge;
        return { ...grudge, forgiven: !grudge.forgiven };
      });
    default:
      return state;
  }
};

export const GrudgeProvider = ({ children }) => {
  const [grudges, dispatch] = useReducer(reducer, initialState);

  const addGrudge = useCallback(
    ({ person, reason }) => {
      dispatch({
        type: ADD_GRUDGE,
        payload: {
          id: id(),
          person,
          reason,
          forgiven: false
        }
      });
    },
    [dispatch]
  );

  const toggleForgiveness = useCallback(
    (id) => {
      dispatch({
        type: FORGIVE,
        payload: { id }
      });
    },
    [dispatch]
  );

  const value = { grudges, addGrudge, toggleForgiveness };

  return (
    <GrudgeContext.Provider value={value}>{children}</GrudgeContext.Provider>
  );
};
