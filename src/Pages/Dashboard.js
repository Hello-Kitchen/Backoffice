import React, {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SideMenu from '../Components/SideMenu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Appbar from '../Components/AppBar';
import { Button } from '@mui/material';
import OrderView from './SideMenuViews/OrderView';
import FoodCategoriesView from './SideMenuViews/FoodCategoriesView';
import FoodView from './SideMenuViews/FoodView';
import DetailsView from './SideMenuViews/DetailsView';
import IngredientsView from './SideMenuViews/IngredientsView';
export default function Dashboard() {

  const [restaurantData, setRestaurantData] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [sideMenuOpen, setSideMenuOpen] = React.useState(false);
  const [display, setDisplay] = useState("Home");
  const [title, setTitle] = useState("Dashboard");

  const handleDrawerOpen = () => {
    setSideMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setSideMenuOpen(false);
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    console.log(restaurant);
  }

  const fetchData = async () => {
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/restaurants/`,
      {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }}
    )
    .then(response => response.json())
    .then(data => {
      setRestaurantData(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (display === "Home") {
      setTitle("Dashboard");
    } else {
      setTitle(selectedRestaurant ? selectedRestaurant.name + " - " + display : "Dashboard");
    }
  }, [selectedRestaurant, display]);

  const displayOption = []

  displayOption["Home"] = (
    <Box>
      {/* TO BE MOVED*/}
      <h1>Dashboard</h1>
      <List>
        {restaurantData.map((restaurant) => (
          <ListItem key={restaurant.id}>
            <Button onClick={() => handleSelectRestaurant(restaurant)}>Select</Button>
            <ListItemText secondary={restaurant.id}/>
            <ListItemText primary={restaurant.name}/>
            <ListItemText secondary={restaurant.location}/>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  displayOption["Orders"] = (<OrderView restaurant={selectedRestaurant}/>);
  displayOption["Food categories"] = (<FoodCategoriesView restaurant={selectedRestaurant}/>);
  displayOption["Food"] = (<FoodView restaurant={selectedRestaurant}/>);
  displayOption["Details"] = (<DetailsView restaurant={selectedRestaurant}/>);
  displayOption["Ingredients"] = (<IngredientsView restaurant={selectedRestaurant}/>);
  displayOption["Details"] = (<DetailsView restaurant={selectedRestaurant}/>);
  displayOption["WIP"] = (<Box><h1>WIP</h1></Box>);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Appbar open={sideMenuOpen} handleDrawerOpen={handleDrawerOpen} title={title}/>
      <SideMenu open={sideMenuOpen} handleDrawerClose={handleDrawerClose} setDisplay={setDisplay} restaurant={selectedRestaurant}/>
      <Box
        component="main"
        sx={{ flexGrow: 1, px: 2, pt: 10 }}
      >
        {displayOption[display]}
    </Box>
  </Box>
  );
}
