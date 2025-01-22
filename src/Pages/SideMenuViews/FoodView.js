import React, {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddOrderDialog from '../../Components/AddOrderDialog';
import { IconButton, Slide, Typography } from '@mui/material';
import { Close, Delete, Refresh } from '@mui/icons-material';
import OrderDetailsSide from '../../Components/OrderDetailsSide';
import FoodDetailsSide from '../../Components/FoodDetailsSide';
import AddFoodDialog from '../../Components/AddFoodDialog';

export default function FoodView({ restaurant }) {

  const [restaurantData, setRestaurantData] = useState();
  const [rows, setRows] = useState();
  const [selectedFood, setSelectedFood] = useState();
  const [ordersLoading, setOrdersLoading] = useState(true);


  const fetchData = async () => {
    setOrdersLoading(true);
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/restaurants/${restaurant.id}`, // Keeped in case with add the detail param in the back
      {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
    )
    .then(response => response.json())
    .then(data => {
      setRestaurantData(data);
      data.foods.forEach((food) => {
        food.id_category = food.id_category + " - " + data.food_category.find(category => category.id === food.id_category).name;
      });
      setRows(data.foods);
      setOrdersLoading(false);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOrder = (id) => {
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/food/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then(response => {
      if (response.status === 200) {
        fetchData();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'id_category', headerName: 'Category', width: 180 },
    { field: 'actions', headerName: 'Actions', width: 100, type: 'actions', getActions: (params) => [
      <Box>
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Details"
          onClick={() => setSelectedFood(params.id)}
        />
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => deleteOrder(params.id)}
        />
      </Box>
    ]},
  ];

  return (

    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', width: selectedFood ? '70%' : '100%'}}>
          <Typography variant='h5'>Food</Typography>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
              <IconButton onClick={() => {fetchData()}}>
                <Refresh/>
              </IconButton>
              {restaurantData && <AddFoodDialog restaurant={restaurantData}/> /* Includes a button to add a new order */}
            </Box>
            {rows && <DataGrid
              columns={columns}
              rows={rows}
              loading={ordersLoading}
            />}
          </Box>
          <Slide in={selectedFood} direction='left'>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '30%', paddingLeft: 2}}>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant='h5'>Food detail</Typography>
                <IconButton onClick={() => setSelectedFood(null)}>
                  <Close/>
                </IconButton>
              </Box>
              <FoodDetailsSide foodId={selectedFood} restaurant={restaurant}/>
            </Box>
          </Slide>
        </Box>
      </Box>
    </Box>
  );
}
