import { Add, Delete } from '@mui/icons-material';
import { Autocomplete, Box, Divider, IconButton, MenuItem, Select, Stack, TextField } from '@mui/material';
import React from 'react';

export default function DetailsForm({ restaurant, data, setData }) {

    console.log("Data:");
    console.log(data);

    const handleAddDetail = () => {
        setData([...data, {type: "text", value: ""}]);
    };

    const handleDeleteDetail = (index) => () => {
        const updatedData = [...data];
        updatedData.splice(index, 1);
        setData(updatedData);
    }

    const handleTypeChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].type = value;
        setData(updatedData);
    }

    const handleValueChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].value = value;
        setData(updatedData);
    }

    return (
        <div>
            {data.map((detail, index) => (
                <Box sx={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1.5, mt: 2 }}>
                        <Stack sx={{ width: '100%' }} spacing={1}>
                            <Select
                                value={detail.type}
                                onChange={(event) => handleTypeChange(index, event.target.value)}
                            >
                                <MenuItem value="text">Text</MenuItem>
                                <MenuItem value="food">Food</MenuItem>
                            </Select>
                            <TextField
                                value={detail.value}
                                onChange={(event) => handleValueChange(index, event.target.value)}
                            />
                        </Stack>
                        <Stack sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} spacing={1}>
                            <IconButton onClick={handleAddDetail} color="primary">
                                <Add />
                            </IconButton>
                            {index !== 0 && <IconButton onClick={handleDeleteDetail(index)}>
                                <Delete/>
                            </IconButton>}
                        </Stack>
                    </Box>
                {index !== data.length - 1 && <Divider />}
                </Box>
            ))}
        </div>
    )
}