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
import DetailsDetailsSide from '../../Components/DetailsDetailsSide';

export default function DetailsView({ restaurant }) {

  const [restaurantData, setRestaurantData] = useState();
  const [rows, setRows] = useState();
  const [selectedDetail, setSelectedDetail] = useState();
  const [ordersLoading, setOrdersLoading] = useState(true);


  const fetchData = async () => {
    setOrdersLoading(true);
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/restaurants/${restaurant.id}`, // Keeped in case with add the detail param in the back
      {headers: {
        Authorization: process.env.REACT_APP_BEARER_TOKEN,
      }}
    )
    .then(response => response.json())
    .then(data => {
      setRestaurantData(data);
      setRows(data.details);
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
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/details/${id}`, {
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
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'multiple', headerName: 'multiple', type: 'boolean', width: 100 },
    { field: 'actions', headerName: 'Actions', width: 100, type: 'actions', getActions: (params) => [
      <Box>
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Details"
          onClick={() => setSelectedDetail(params.id)}
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
          <Box sx={{display: 'flex', flexDirection: 'column', width: selectedDetail ? '70%' : '100%'}}>
          <Typography variant='h5'>Details</Typography>
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
          <Slide in={selectedDetail} direction='left'>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '30%', paddingLeft: 2}}>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant='h5'>Food detail</Typography>
                <IconButton onClick={() => setSelectedDetail(null)}>
                  <Close/>
                </IconButton>
              </Box>
              {selectedDetail && <DetailsDetailsSide detailId={selectedDetail} restaurant={restaurant}/>}
            </Box>
          </Slide>
        </Box>
      </Box>
    </Box>
  );
}
