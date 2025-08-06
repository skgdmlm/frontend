import { useEffect, useState } from 'react';
import { Button, MenuItem, Typography, Box, TextField, DialogContent, DialogTitle, Dialog, DialogActions } from '@mui/material';
import { useForm } from 'react-hook-form';
import { UserRole } from "../../utils/enums";
import Input from '../../components/common/Input';

import toast from 'react-hot-toast';
import { useAppSelector } from '../../store/store';
import { useInviteUsersMutation, useUsersQuery } from '../../services/api';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { tableFormat } from '../../utils/dateTIme';

type FormValues = {
    password: string;
};

export default function Dashboard() {
    const [badgeType, setBadgeType] = useState('green');
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);
    const { user } = useAppSelector((root) => root.auth);
    const isAdmin = user?.role === UserRole.ADMIN;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
    const [invite, { isLoading }] = useInviteUsersMutation();

    const generatePin = async (data: FormValues) => {
        if(!selectedUser) {
            toast.error('Please select a user to generate PIN for.');
            return;
        }
        try {
            const response = await invite({
                badgeType: isAdmin ? badgeType : undefined,
                password: data.password,
                user: selectedUser?._id,
            }).unwrap();

            toast.success('PIN generated successfully.');
            reset()
            setGeneratedPin(response.data.pin);
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };

    const [pagination, setPagination] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    useEffect(()=>{
        let timeoutId: ReturnType<typeof setTimeout>;
        if (generatedPin) {
            timeoutId = setTimeout(() => {
                setSelectedUser(null);
            setDialogOpen(false);
            }, 5000);
        }   
        return () => clearTimeout(timeoutId);
    },[generatedPin])

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');


    useEffect(() => {
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
        { field: "userId", headerName: "#", width: 110 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 170 },
         { field: "phone", headerName: "Phone", width: 170, 
        renderCell: ({ value }) => (
          <span>{value ? value : '-'}</span>
        ),
    },
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
      const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Generate PIN for {selectedUser?.name ?? selectedUser?.email}</DialogTitle>
                    <DialogContent className="space-y-4 text-black">
                        <form onSubmit={handleSubmit(generatePin)} className="flex flex-col gap-4 py-1.5">
                                <Input
                                    select
                                    label="Badge Type"
                                    fullWidth
                                    value={badgeType}
                                    onChange={(e) => setBadgeType(e.target.value)}
                                >
                                    <MenuItem value="green">Green</MenuItem>
                                    <MenuItem value="yellow">Yellow</MenuItem>
                                </Input>

                            <Input
                                {...register("password", { required: "Password is required" })}
                                label="Enter Password"
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate PIN"}
                            </Button>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        {generatedPin && (
                            <Typography variant="h6" className="w-100 text-center text-green-700">
                                Referral PIN: <strong>{generatedPin}</strong>
                            </Typography>
                        )}
                    </DialogActions>
            </Dialog>
            <>
                {/* Search Bar */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search users to send referrals..."
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
                    onRowClick={(params) => {setSelectedUser(params.row); setDialogOpen(true)}}
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
        </>


    );
}
