import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filterIngredientsHandler = useCallback(filterIngredients => {
    // setUserIngredients(filterIngredients);
    dispatch({ type: 'SET', ingredients: filterIngredients });
  }, []);

  const addIngredentsHandler = useCallback(
    ingredient => {
      sendRequest(
        'https://react-hook-updating-default-rtdb.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
      //   dispatchHttp({ type: 'SEND' });
      //   fetch(
      //     'https://react-hook-updating-default-rtdb.firebaseio.com/ingredients.json',
      //     {
      //       method: 'POST',
      //       body: JSON.stringify(ingredient),
      //       headers: { 'Content-Type': 'application/json' },
      //     }
      //   )
      //     .then(response => {
      //       dispatchHttp({ type: 'RESPONSE' });
      //       return response.json();
      //     })
      //     .then(responseData => {
      //       // setUserIngredients(prevIngredients => [
      //       //   ...prevIngredients,
      //       //   { id: responseData.name, ...ingredient },
      //       // ]);
      //       dispatch({
      //         type: 'ADD',
      //         ingredient: { id: responseData.name, ...ingredient },
      //       });
      //     });
    },
    [sendRequest]
  );

  const removeIngredientsHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://react-hook-updating-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
      // dispatchHttp({ type: 'SEND' });
    },
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientsList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientsHandler}
      />
    );
  }, [userIngredients, removeIngredientsHandler]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredentsHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
