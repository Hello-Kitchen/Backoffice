import { Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, Chip, Divider, IconButton, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function DishesForm({ restaurant, dishes, setDishes }) {
    const [availableFood, setavailableFood] = useState([]);
    const [detailsOptions, setDetailsOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAddDish = () => {
        setDishes([...dishes, {is_ready: false}]);
    };

    const handleDeleteDish = (index) => () => {
        const updatedDishes = [...dishes];
        updatedDishes.splice(index, 1);
        setDishes(updatedDishes);
    }

    const handleDishChange = (index, value) => {
        const updatedDishes = [...dishes];
        if (value === "") {
            updatedDishes[index] = {};
            setDishes(updatedDishes);
            return;
        }
        updatedDishes[index] = {
            food: parseInt(value.split(" - ")[0], 10),
            is_ready: false,
            mods_ingredients: [],
            details: []
        };
        setDetailsOptions([]);
        setDishes(updatedDishes);
    };

    const handleChangeStatus = (index) => {
        const updatedDishes = [...dishes];
        updatedDishes[index].is_ready = !updatedDishes[index].is_ready;
        setDishes(updatedDishes);
    }

    useEffect(() => {
        if (restaurant) {
            setavailableFood(restaurant.foods.map((dish) => dish.id + " - " + dish.name));
        }
    }, [restaurant]);

    const getDetailsOptions = (index) => {
        setLoading(true);
        const detailsOptions = [];
        restaurant.foods.find(food => food.id === dishes[index].food).details.forEach(detail => {
            restaurant.details.find(d => d.id === detail).data.forEach(data => {
                detailsOptions.push(data);
            });
        });
        setDetailsOptions(detailsOptions);
        setLoading(false);
    };

    const setNewDetails = (index, value) => {
        const updatedDishes = [...dishes];
        updatedDishes[index].details = value;
        setDishes(updatedDishes);
    };

    const setNewPart = (index, value) => {
        const updatedDishes = [...dishes];
        updatedDishes[index].part = parseInt(value);
        setDishes(updatedDishes);
    }

    console.log(dishes);

    return (
        <div>
            {dishes.map((dish, index) => (
                <Box>
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, mt: 2 }}>
                        <Stack sx={{ width: '100%' }} spacing={1}>
                            <Autocomplete
                                options={availableFood}
                                onClose={(event) => handleDishChange(index, event.target.textContent)}
                                renderInput={(params) => <TextField {...params} label={"Dish " + (index + 1)} />}
                                sx={{ width: '100%' }}
                                value={availableFood.find(food => food.split(" - ")[0] === (dish.food || "").toString()) || ""}
                            />
                            <Autocomplete
                                multiple
                                onOpen={() => getDetailsOptions(index)}
                                onChange={(event, value) => setNewDetails(index, value)}
                                options={detailsOptions}
                                value={dish.details || []}
                                loading={loading}
                                renderInput={(params) => <TextField {...params} label="Details" />}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    label={dish.is_ready ? "Ready" : "Not ready"}
                                    color={dish.is_ready ? "success" : "error"}
                                    onClick={() => handleChangeStatus(index)}
                                    sx={{ mr: 1}}
                                />
                                <TextField
                                    label='Part'
                                    size='small'
                                    type='number'
                                    value={dish.part || ""}
                                    onChange={(event) => setNewPart(index, event.target.value)}
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                        </Stack>
                        <Stack sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} spacing={1}>
                            <IconButton onClick={handleAddDish} color="primary">
                                <Add />
                            </IconButton>
                            {index !== 0 && <IconButton onClick={handleDeleteDish(index)}>
                                <Delete />
                            </IconButton>}
                        </Stack>
                    </Box>
                    {index !== dishes.length - 1 && <Divider />}
                </Box>
            ))}
        </div>
    );
}
