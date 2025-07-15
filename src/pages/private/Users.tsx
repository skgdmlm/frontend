import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import React from 'react';
import { useUsersQuery } from '../../services/api';
import { tableFormat } from '../../utils/dateTIme';
import { useNavigate } from 'react-router-dom';
import { TextField, Box } from '@mui/material';

export default function Users() {
  const navigate = useNavigate();

  const [pagination, setPagination] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Debounce effect
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const skip = pagination.page * pagination.pageSize;
  const limit = pagination.pageSize;

  const { data: users, isLoading: usersLoading } = useUsersQuery({
    skip,
    limit,
    search: debouncedSearch,
  });

  const columns: GridColDef[] = [
    { field: "_id", headerName: "#", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 170 },
    { field: "badgeType", headerName: "Badge", width: 100 },
    {
      field: "active",
      headerName: "Active",
      width: 80,
      renderCell: ({ value }) => (
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: value ? 'green' : 'gray',
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      valueFormatter: ({ value }) => tableFormat(value),
    },
  ];

  return (
    <>
      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Data Table */}
      <DataGrid
        rows={users?.data?.list ?? []}
        getRowId={(row) => row._id}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        rowCount={users?.data?.total ?? 0}
        paginationMode="server"
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        onRowClick={(params) => navigate(`/users/${params.row._id}`)}
        loading={usersLoading}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: '#f5f5f5',
          },
          height: 600, width: "100%"
        }}
      />
    </>
  );
}
