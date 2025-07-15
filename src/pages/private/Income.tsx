import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useBalanceQuery, useCommissionsQuery, useTotalCommissionQuery } from "../../services/api";
import React from "react";
import { tableFormat } from "../../utils/dateTIme";

export default function Income() {
  const [pagination, setPagination] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const skip = pagination.page * pagination.pageSize;
  const limit = pagination.pageSize;
    const {data: totalIncome, isLoading: incomeLoading} = useTotalCommissionQuery({})
    const {data: balance, isLoading: balanceLoading} = useBalanceQuery({})
    const {data: commissions, isLoading: commissionsLoading} = useCommissionsQuery({skip, limit})

  const rows = commissions?.data?.list?.map((item) => ({
    ...item,
    referredUserName: item.referredUserId?.name || 'N/A',
  })) ?? [];
  const columns: GridColDef[] = [
    { field: "_id", headerName: "#", width: 70 },
    {
      field: "amount",
      headerName: "Amount (₹)",
      width: 150
    },
    {
      field: "level",
      headerName: "Level",
      width: 100
    },

    {
      field: "referredUserName",
      headerName: "Referred User",
      width: 150
    },

    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      valueFormatter: ({ value }) => {
        return tableFormat(value)
      }
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md bg-green-50">
          <CardContent>
            <Typography variant="h6" className="text-green-700 font-bold">
              Total Income Generated
            </Typography>
            <Typography variant="h4" className="text-green-900 font-semibold mt-2">
              ₹ {incomeLoading ? '-' : totalIncome?.data?.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-blue-50">
          <CardContent>
            <Typography variant="h6" className="text-blue-700 font-bold">
              Current Balance
            </Typography>
            <Typography variant="h4" className="text-blue-900 font-semibold mt-2">
              ₹ {balanceLoading ? '-' : balance?.data?.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Box className="bg-white rounded shadow" sx={{ height: 400, width: "100%" }}>
        <Typography variant="h6" className="mb-2 text-slate-700 p-4">
          Comission History
        </Typography>
        <DataGrid
          rows={rows}
          getRowId={(row) => row._id}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          rowCount={commissions?.data?.total ?? 0}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          loading={commissionsLoading}
        />
      </Box>
    </div>
  );
}
