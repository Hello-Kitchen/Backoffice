import { Add, Close, DeleteRounded, Replay, SendRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import DishesForm from './DishesForm';

export default function AddFoodDialog({ restaurant }) {
    const [displayAddFoodDialog, setDisplayAddFoodDialog] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [details, setDetails] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [category, setCategory] = useState('');

    const handleClose = () => {
        setDisplayAddFoodDialog(false);
        setName('');
        setPrice('');
        setDetails([]);
        setIngredients([]);
        setCategory('');
        setIsSending(false);
        setSendStatus('');
    };

    const sendOrder = () => {
        setIsSending(true);
        const food = {
            name: name,
            price: parseFloat(price),
            details: details.map(detail => parseInt(detail.split(" - ")[0], 10)),
            ingredients: ingredients.map(ingredient => parseInt(ingredient.split(" - ")[0], 10)),
            id_category: parseInt(category.split(" - ")[0], 10)
        };
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/food/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(food)
        })
        .then(data => {
            setIsSending(false);
            if (data.status === 201) {
                setSendStatus('success');
            } else {
                setSendStatus('error');
            }
        })
        .catch(error => console.error(error));
    };

    return (
        <div>
            <IconButton onClick={() => setDisplayAddFoodDialog(true)}>
                <Add />
            </IconButton>
            <Dialog
                open={displayAddFoodDialog}
                onClose={() => handleClose()}
            >
                <DialogTitle className="bg-kitchen-blue" style={{color: "white"}}>Add Order</DialogTitle>
                <DialogContent>
                    <Stack
                        sx={{ display: 'flex', flexDirection: 'column', width: '400px', marginTop: 1 }}
                        spacing={1}
                    >
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Autocomplete
                            value={category}
                            options={restaurant.food_category.map(category => category.id + " - " + category.name)}
                            onChange={(event, value) => setCategory(value)}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                        />
                        <Autocomplete
                            multiple
                            value={details}
                            options={restaurant.details.map(detail => detail.id + " - " + detail.name)}
                            onChange={(event, value) => setDetails(value)}
                            renderInput={(params) => <TextField {...params} label="Details" />}
                        />
                        <Autocomplete
                            multiple
                            value={ingredients}
                            options={restaurant.ingredients.map(ingredient => ingredient.id + " - " + ingredient.name)}
                            onChange={(event, value) => setIngredients(value)}
                            renderInput={(params) => <TextField {...params} label="Ingredients" />}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {sendStatus === 'success' && <Alert severity="success" sx={{width: '100%'}}>Food sent successfully</Alert>}
                    {sendStatus === 'error' && <Alert severity="error">Error sending food</Alert>}
                    {sendStatus === 'success' ? (
                        <Button
                            onClick={() => handleClose()}
                            startIcon={<Close/>}
                        >
                            Close
                        </Button>
                    ) : (
                        <div>
                            <Button
                                onClick={() => handleClose()}
                                startIcon={<DeleteRounded/>}
                                disabled={isSending}
                            >
                                Cancel
                            </Button>
                            {sendStatus === 'error' ? (
                                <LoadingButton
                                    onClick={() => sendOrder()}
                                    endIcon={<Replay/>}
                                    loading={isSending}
                                >
                                    Retry
                                </LoadingButton>
                            ) : (
                                <LoadingButton
                                    onClick={() => sendOrder()}
                                    endIcon={<SendRounded/>}
                                    loading={isSending}
                                >
                                    Send
                                </LoadingButton>
                            )}
                        </div>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
