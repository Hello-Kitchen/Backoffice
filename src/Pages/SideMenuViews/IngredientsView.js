import { Add, Cancel, Delete, Edit, Refresh, Save } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";


export default function IngredientsView({ restaurant }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    fetch(
      `http://localhost:4000/api/${restaurant.id}/ingredient`, // Keeped in case with add the detail param in the back
      {
        headers: {
          Authorization: process.env.REACT_APP_BEARER_TOKEN,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;
    const id = 0;
  
    const handleClick = () => {
  
      setRows((oldRows) => [...oldRows, { id, name: "", isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          Add ingredient
        </Button>
      </GridToolbarContainer>
    );
  }
  

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    fetch(`http://localhost:4000/api/${restaurant.id}/ingredient/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: process.env.REACT_APP_BEARER_TOKEN,
        }
    })
      .then((response) => {
        if (response.status === 200) {
            setRows(rows.filter((row) => row.id !== id));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, price: parseFloat(newRow.price), isNew: undefined };
    if (newRow.isNew) {
    fetch(`http://localhost:4000/api/${restaurant.id}/ingredient/`, {
        method: 'POST',
        headers: {
            Authorization: process.env.REACT_APP_BEARER_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newRow.name})
    })
      .then((response) => {
        if (response.status === 201) {
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    } else {
        fetch(`http://localhost:4000/api/${restaurant.id}/ingredient/${newRow.id}`, {
            method: 'PUT',
            headers: {
                Authorization: process.env.REACT_APP_BEARER_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRow)
        })
        .then((response) => {
            if (response.status === 200)
                setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        })
        .catch((error) => {
        console.error("Error:", error);
        });
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "price", headerName: "Price", width: 100, editable: true,
      valueFormatter: (value) => {
        return `${value} €`;
      }
     },
    { field: "unit", headerName: "Unit", width: 150, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <Typography variant="h5">Ingredients</Typography>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <IconButton
          onClick={() => {
            fetchData();
          }}
        >
          <Refresh />
        </IconButton>
      </Box>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          loading={loading}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
    </div>
  );
}
