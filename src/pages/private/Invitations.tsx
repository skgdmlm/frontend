import { DataGrid, type GridColDef, type GridPaginationModel  } from '@mui/x-data-grid';
import React from 'react';
import { useInvitationsQuery } from '../../services/api';
import { tableFormat } from '../../utils/dateTIme';

export default function Transactions() {
  const [pagination, setPagination] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const skip = pagination.page * pagination.pageSize;
  const limit = pagination.pageSize;

  const { data: invitations, isLoading: transactionLoading } = useInvitationsQuery({ skip, limit });

  const columns: GridColDef[] = [
    { field: "_id", headerName: "#", width: 70 },
    {
      field: "pin",
      headerName: "PIN",
      width: 150
    },
  {
    field: "isUsed",
    headerName: "Is Used",
    width: 100,
    valueGetter: (val) => {
      return val ? "Yes" : "No";
    },
  },
    {
      field: "expiresAt",
      headerName: "Expiry Date",
      width: 150,
      valueFormatter: ({ value }) => tableFormat(value)
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      valueFormatter: ({ value }) => tableFormat(value)
    },
  ];

  return (
    <DataGrid
      rows={invitations?.data?.list ?? []}
      getRowId={(row) => row._id}
      columns={columns}
      rowCount={invitations?.data?.total ?? 0}
      paginationMode="server"                      
      paginationModel={pagination}                 
      onPaginationModelChange={setPagination}      
      pageSizeOptions={[5, 10, 20]}                
      disableRowSelectionOnClick
      loading={transactionLoading}
    />
  );
}
