import { DataGrid, type GridColDef, type GridPaginationModel  } from '@mui/x-data-grid';
import React from 'react';
import { useInvitationsQuery } from '../../services/api';
import { tableFormat } from '../../utils/dateTIme';
import { useAppSelector } from '../../store/store';
import { UserRole } from '../../utils/enums';

export default function Transactions() {
  const { user } = useAppSelector((root) => root.auth);
      const isAdmin = user?.role === UserRole.ADMIN;
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
      valueFormatter: (value) => tableFormat(value)
    },
  ];

  if (isAdmin) {
    columns.push({
      field: "referrerId",
      headerName: "Referrer",
      width: 200,
      valueGetter: (val: IUser) => {
        return val?.name || val?.email || "N/A";
      }
    });
  }

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
