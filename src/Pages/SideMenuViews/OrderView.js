import React, {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddOrderDialog from '../../Components/AddOrderDialog';
import { IconButton, Slide, Typography } from '@mui/material';
import { Close, Delete, Refresh } from '@mui/icons-material';
import OrderDetailsSide from '../../Components/OrderDetailsSide';

export default function OrderView({ restaurant }) {

  const [restaurantData, setRestaurantData] = useState();
  const [rows, setRows] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [ordersLoading, setOrdersLoading] = useState(true);


  const fetchData = async () => {
    setOrdersLoading(true);
    fetch(`http://localhost:4000/api/restaurants/${restaurant.id}`, // Keeped in case with add the detail param in the back
      {headers: {
        Authorization: process.env.REACT_APP_BEARER_TOKEN,
      }}
    )
    .then(response => response.json())
    .then(data => {
      setRestaurantData(data);
      data.orders.forEach((order) => {
        order.date = new Date(order.date);
      });
      setRows(data.orders);
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
    fetch(`http://localhost:4000/api/${restaurant.id}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: process.env.REACT_APP_BEARER_TOKEN,
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
    { field: 'channel', headerName: 'Channel', width: 100 },
    { field: 'number', headerName: 'Number', width: 150 },
    { field: 'date', headerName: 'Date', width: 180, type: 'dateTime' },
    { field: 'actions', headerName: 'Actions', width: 100, type: 'actions', getActions: (params) => [
      <Box>
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Details"
          onClick={() => setSelectedOrder(params.id)}
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
          <Box sx={{display: 'flex', flexDirection: 'column', width: selectedOrder ? '70%' : '100%'}}>
          <Typography variant='h5'>Orders</Typography>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
              <IconButton onClick={() => {fetchData()}}>
                <Refresh/>
              </IconButton>
              {restaurantData && <AddOrderDialog restaurant={restaurantData}/> /* Includes a button to add a new order */}
            </Box>
            {rows && <DataGrid
              columns={columns}
              rows={rows}
              loading={ordersLoading}
            />}
          </Box>
          <Slide in={selectedOrder} direction='left'>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '30%', paddingLeft: 2}}>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant='h5'>Order detail</Typography>
                <IconButton onClick={() => setSelectedOrder(null)}>
                  <Close/>
                </IconButton>
              </Box>
              {selectedOrder && <OrderDetailsSide orderId={selectedOrder} restaurant={restaurant}/>}
            </Box>
          </Slide>
        </Box>
      </Box>
    </Box>
  );
}
