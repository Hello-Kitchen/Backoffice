import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Alert, Autocomplete, Divider, Skeleton, Snackbar, Stack, Switch, TextField, Typography } from "@mui/material";
import DishesForm from "./DishesForm";
import { SaveRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import DetailsForm from "./DetailsForm";


export default function DetailsDetailsSide({ detailId, restaurant }) {

  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarType, setSnackBarType] = useState('');
  const [detailsData, setDetailsData] = useState([]);

  const fetchData = (detailId) => {
    setLoading(true);
    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/details/${detailId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetailsData(data.data.map((item) => {return {type: item.type, value: item.value}}));
        setSelectedDetail(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(detailId);
  }, [detailId]);

  useEffect(() => {
    if (restaurant) {
      setAvailableCategories(restaurant.food_category.map(category => category.id + " - " + category.name));
    }
  }, [restaurant]);

  const handleNameChange = (name) => {
    setSelectedDetail({...selectedDetail, name: name});
  }

  const handlePriceChange = (price) => {
    setSelectedDetail({...selectedDetail, price: price});
  }

  const handleCategoryChange = (category) => {
    setSelectedDetail({...selectedDetail, id_category: category});
  }

  const handleDetailsChange = (details) => {
    setSelectedDetail({...selectedDetail, details: details});
  }

  const handleIngredientsChange = (ingredients) => {
    setSelectedDetail({...selectedDetail, ingredients: ingredients});
  }

  const sendFood = () => {
    setSendLoading(true);

    const foodToSend = {
      ...selectedDetail,
      id_category: parseInt(selectedDetail.id_category.split(" - ")[0]),
      details: selectedDetail.details.map(detail => parseInt(detail.split(" - ")[0])),
      ingredients: selectedDetail.ingredients.map(ingredient => parseInt(ingredient.split(" - ")[0])),
      price: parseFloat(selectedDetail.price)
    }

    console.log(foodToSend);

    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/details/${detailId}`, {
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
          <Typography variant="h6">Food {detailId}</Typography>
          <Box>
            <Stack spacing={0.5}>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>Name:</p>
                <TextField
                  value={selectedDetail.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  size='small'
                  variant="standard"
                  sx={{width: '100%', ml: 1}}
                />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>Multiple:</p>
                <Switch
                  checked={selectedDetail.multiple}
                  onChange={(event) => setSelectedDetail({...selectedDetail, multiple: event.target.checked})}
                  size='small'
                  color='primary'
                />
              </Box>
              <DetailsForm restaurant={restaurant} data={detailsData} setData={setDetailsData} />
              // TO DO : Ajouter les champs data, faire comme pour les orders avec deux Autocomplete l'un sur l'autre et des boutons pour ajouter/supprimer
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
