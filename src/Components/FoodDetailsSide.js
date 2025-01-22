import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Alert, Autocomplete, Divider, Skeleton, Snackbar, Stack, TextField, Typography } from "@mui/material";
import DishesForm from "./DishesForm";
import { SaveRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";


export default function FoodDetailsSide({ foodId, restaurant }) {

  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarType, setSnackBarType] = useState('');

  const fetchData = (foodId) => {
    setLoading(true);
    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/food/${foodId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data.id_category = data.id_category + " - " + restaurant.food_category.find(category => category.id === data.id_category).name;
        data.details = data.details.map(detail => detail + " - " + restaurant.details.find(d => d.id === detail).name);
        data.ingredients = data.ingredients.map(ingredient => ingredient + " - " + restaurant.ingredients.find(i => i.id === ingredient).name);
        setSelectedFood(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(foodId);
  }, [foodId]);

  useEffect(() => {
    if (restaurant) {
      setAvailableCategories(restaurant.food_category.map(category => category.id + " - " + category.name));
    }
  }, [restaurant]);

  const handleNameChange = (name) => {
    setSelectedFood({...selectedFood, name: name});
  }

  const handlePriceChange = (price) => {
    setSelectedFood({...selectedFood, price: price});
  }

  const handleCategoryChange = (category) => {
    setSelectedFood({...selectedFood, id_category: category});
  }

  const handleDetailsChange = (details) => {
    setSelectedFood({...selectedFood, details: details});
  }

  const handleIngredientsChange = (ingredients) => {
    setSelectedFood({...selectedFood, ingredients: ingredients});
  }

  const sendFood = () => {
    setSendLoading(true);

    const foodToSend = {
      ...selectedFood,
      id_category: parseInt(selectedFood.id_category.split(" - ")[0]),
      details: selectedFood.details.map(detail => parseInt(detail.split(" - ")[0])),
      ingredients: selectedFood.ingredients.map(ingredient => parseInt(ingredient.split(" - ")[0])),
      price: parseFloat(selectedFood.price)
    }

    console.log(foodToSend);

    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/food/${foodId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(foodToSend)
    })
    .then(data => {
      setSendLoading(false);
      if (data.status === 200) {
        setSnackBarType('success');
        setSnackBarVisible(true);
      } else {
        setSnackBarType('error');
        setSnackBarVisible(true);
      }
    })
  }

  return (
    <Box>
      {loading ? (
        <Stack spacing={1}>
            <Skeleton
                variant="rounded"
                width="100%"
                height={120}
                animation="wave"
            />
            <Skeleton
                variant="rounded"
                width="80%"
                height={100}
                animation="wave"
            />
            <Skeleton
                variant="rounded"
                width="80%"
                height={100}
                animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="80%"
              height={100}
              animation="wave"
            />
        </Stack>
      ) : (
        <Box>
          <Typography variant="h6">Food {foodId}</Typography>
          <Box>
            <Stack spacing={0.5}>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>Name:</p>
                <TextField
                  value={selectedFood.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  size='small'
                  variant="standard"
                  sx={{width: '100%', ml: 1}}
                />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>Price:</p>
                <TextField
                  value={selectedFood.price}
                  type='number'
                  onChange={(event) => handlePriceChange(event.target.value)}
                  size='small'
                  variant="standard"
                  sx={{width: '100%', ml: 1}}
                />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>Category:</p>
                <Autocomplete
                  options={availableCategories}
                  value={selectedFood.id_category}
                  onChange={(event, value) => handleCategoryChange(value)}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                  size='small'
                  sx={{width: '100%', ml: 1}}
                />
              </Box>
              <Stack spacing={1} sx={{pt: 1}}>
                <Autocomplete
                    multiple
                    value={selectedFood.details}
                    options={restaurant.details.map(detail => detail.id + " - " + detail.name)}
                    onChange={(event, value) => handleDetailsChange(value)}
                    renderInput={(params) => <TextField {...params} label="Details" />}
                />
                <Autocomplete
                    multiple
                    value={selectedFood.ingredients}
                    options={restaurant.ingredients.map(ingredient => ingredient.id + " - " + ingredient.name)}
                    onChange={(event, value) => handleIngredientsChange(value)}
                    renderInput={(params) => <TextField {...params} label="Ingredients" />}
                />
              </Stack>
            </Stack>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end', mt: 3, mb: 3, mr: 2}}>
              <LoadingButton
                onClick={sendFood}
                endIcon={<SaveRounded/>}
                variant="contained"
                style={{backgroundColor: "#499CA6"}}
                loading={sendLoading}
              >
                Save
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar open={snackBarVisible} autoHideDuration={6000} onClose={() => setSnackBarVisible(false)}>
        {snackBarType === 'success' ? <Alert
          onClose={() => setSnackBarVisible(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Food updated successfully!
        </Alert> :
        <Alert
          onClose={() => setSnackBarVisible(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Error while updating Food.
        </Alert>}
      </Snackbar>
    </Box>
  );
}
