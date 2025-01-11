import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Alert, Autocomplete, Divider, Skeleton, Snackbar, Stack, TextField, Typography } from "@mui/material";
import DishesForm from "./DishesForm";
import { SaveRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";


export default function OrderDetailsSide({ orderId, restaurant }) {
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarType, setSnackBarType] = useState('');
  const [dishes, setDishes] = useState([]);

  const fetchData = (orderId) => {
    setLoading(true);
    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/orders/${orderId}`,
      {
        headers: {
          Authorization: process.env.REACT_APP_BEARER_TOKEN,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedOrder(data);
        setDishes(data.food_ordered);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(orderId);
  }, [orderId]);

  const sendOrder = () => {

    setSendLoading(true);

    const updatedOrder = {
      ...selectedOrder,
      food_ordered: dishes.map(dish => {
        return {
          id: dish.id,
          food: dish.food,
          details: dish.details,
          mods_ingredients: dish.mods_ingredients,
          is_ready: dish.is_ready,
          part: dish.part
        }
      })
    }

    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: {
        Authorization: process.env.REACT_APP_BEARER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedOrder)
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
    .catch(error => {
      console.error('Error updating order:', error);
    });
  };

  const handleChannelChange = (value) => {
    const updatedOrder = {...selectedOrder};
    updatedOrder.channel = value;
    setSelectedOrder(updatedOrder);
  };

  const handleNumberChange = (value) => {
    const updatedOrder = {...selectedOrder};
    updatedOrder.number = value;
    setSelectedOrder(updatedOrder);
  }

  const handleDateChange = (value) => {
    const updatedOrder = {...selectedOrder};
    updatedOrder.date = value;
    setSelectedOrder(updatedOrder);
  }
  
  const handlePartChange = (value) => {
    const updatedOrder = {...selectedOrder};
    updatedOrder.part = parseInt(value);
    setSelectedOrder(updatedOrder);
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
          <Typography variant="h6">Order {selectedOrder.id}</Typography>
          <Stack spacing={0.5} sx={{mb: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <p>Channel:</p>
              <Autocomplete
                options={['Sur place', 'A emporter', 'LAD']}
                value={selectedOrder.channel}
                onChange={(event, value) => handleChannelChange(value)}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" />
                )}
                size='small'
                sx={{width: '100%', ml: 1}}
              />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <p>Number:</p>
              <TextField
                value={selectedOrder.number}
                onChange={(event) => handleNumberChange(event.target.value)}
                size='small'
                variant="standard"
                sx={{width: '100%', ml: 1}}
              />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <p>Date:</p>
              <TextField
                type="datetime-local"
                value={new Date(selectedOrder.date).toISOString().slice(0, 16)}
                onChange={(event) => {handleDateChange(event.target.value)}}
                variant="standard"
                sx={{width: '100%', ml: 1}}
              />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <p>Part:</p>
              <TextField
                value={selectedOrder.part}
                type='number'
                onChange={(event) => handlePartChange(event.target.value)}
                size='small'
                variant="standard"
                sx={{width: '100%', ml: 1}}
              />
            </Box>
          </Stack>
          <Divider/>
          <h3>Items</h3>
          <DishesForm restaurant={restaurant} dishes={dishes} setDishes={setDishes}/>
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end', mt: 3, mb: 3, mr: 2}}>
            <LoadingButton
              onClick={sendOrder}
              endIcon={<SaveRounded/>}
              variant="contained"
              style={{backgroundColor: "#499CA6"}}
              loading={sendLoading}
            >
              Save
            </LoadingButton>
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
          Order updated successfully!
        </Alert> :
        <Alert
          onClose={() => setSnackBarVisible(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Error while updating order.
        </Alert>}
      </Snackbar>
    </Box>
  );
}
