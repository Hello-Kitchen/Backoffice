import { Add, Close, DeleteRounded, Replay, SendRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import DishesForm from './DishesForm';

export default function AddOrderDialog({ restaurant }) {
    const [displayAddOrderDialog, setDisplayAddOrderDialog] = useState(false);
    const [dishes, setDishes] = useState([{}]);
    const [channel, setChannel] = useState('');
    const [number, setNumber] = useState('');
    const [part, setPart] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState('');

    const handleClose = () => {
        setDisplayAddOrderDialog(false);
        setDishes([{}]);
        setChannel('');
        setNumber('');
        setPart('');
        setDate(new Date().toISOString());
        setIsSending(false);
        setSendStatus('');
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setDate(newDate.toISOString());
    };

    const sendOrder = () => {
        setIsSending(true);
        const order = {
            food_ordered: dishes,
            channel: channel,
            number: number,
            part: parseInt(part),
            date: date,
            served: false
        };
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${restaurant.id}/orders/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
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
            <IconButton onClick={() => setDisplayAddOrderDialog(true)}>
                <Add />
            </IconButton>
            <Dialog
                open={displayAddOrderDialog}
                onClose={() => handleClose()}
            >
                <DialogTitle className="bg-kitchen-blue" style={{color: "white"}}>Add Order</DialogTitle>
                <DialogContent>
                    <Stack
                        sx={{ display: 'flex', flexDirection: 'column', width: '400px', marginTop: 1 }}
                        spacing={1}
                    >
                        <TextField
                            label="Date"
                            type="datetime-local"
                            value={new Date(date).toISOString().slice(0, 16)}
                            onChange={handleDateChange}
                        />
                        <Select
                            label="Channel"
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                        >
                            <MenuItem value="Sur place">Sur place</MenuItem>
                            <MenuItem value="A emporter">A emporter</MenuItem>
                            <MenuItem value="LAD">LAD</MenuItem>
                        </Select>
                        <TextField
                            label="Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <TextField
                            label="Part"
                            type="number"
                            value={part}
                            onChange={(e) => setPart(e.target.value)}
                        />
                        <DishesForm restaurant={restaurant} dishes={dishes} setDishes={setDishes}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {sendStatus === 'success' && <Alert severity="success" sx={{width: '100%'}}>Order sent successfully</Alert>}
                    {sendStatus === 'error' && <Alert severity="error">Error sending order</Alert>}
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
