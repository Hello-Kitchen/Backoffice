import React, { useState } from 'react';

import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Alert, Autocomplete, Box, IconButton, Snackbar, TextField } from '@mui/material';
import { Save } from '@mui/icons-material';

export default function DetailsOrderRow({ order, food }) {
  const [detailsOptions, setDetailsOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDetails, setNewDetails] = useState(food.details);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarType, setSnackBarType] = useState();

  const getDetailsOptions = (foodId) => {
    setLoading(true);
    const detailsOptions = [];
    fetch(`http://localhost:4000/api/${process.env.REACT_APP_RESTAURANT_ID}/food/${foodId}`, 
      { headers: { 
        Authorization: process.env.REACT_APP_BEARER_TOKEN 
      } }
    )
    .then(response => response.json())
    .then(data => {
      return Promise.all(
        data.details.map(detail => 
          fetch(`http://localhost:4000/api/${process.env.REACT_APP_RESTAURANT_ID}/details/${detail}`, 
            { headers: { Authorization: process.env.REACT_APP_BEARER_TOKEN } }
          )
          .then(response => response.json())
          .then(data => {
            data.data.forEach(data =>
              detailsOptions.push(data)
            );
          })
        )
      );
    })
    .then(() => {
      setDetailsOptions(detailsOptions);
      setLoading(false);
    });
  };

  const sendNewDetails = () => {
    const { id, ...orderRest } = order;
    const updatedOrder = {
      ...orderRest,
      food_ordered: order.food_ordered.map(item => {
        const { id, quantity, name, ...rest } = item;
        if (item.id === food.id) {
          return { ...rest, details: newDetails };
        }
        return {...rest};
      })
    };
    fetch(`http://localhost:4000/api/${process.env.REACT_APP_RESTAURANT_ID}/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        Authorization: process.env.REACT_APP_BEARER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedOrder)
    })
    .then(data => {
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

  return (
    <div>
      <TreeItem itemId={food.id} label={food.name}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Autocomplete
            multiple
            onOpen={() => getDetailsOptions(food.food)}
            onClose={() => setDetailsOptions([])}
            onChange={(event, value) => setNewDetails(value)}
            options={detailsOptions}
            defaultValue={food.details}
            loading={loading}
            renderInput={(params) => <TextField {...params} label="Details" />}
          />
          <IconButton onClick={sendNewDetails}>
            <Save />
          </IconButton>
        </Box>
      </TreeItem>
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
    </div>
    
  );
}
