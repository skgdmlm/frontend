import { useState } from 'react';
import { Button, MenuItem, Typography, Paper } from '@mui/material';
import { UserRole } from "../../utils/enums"
import Input from '../../components/common/Input';

import toast from 'react-hot-toast';
import { useAppSelector } from '../../store/store';
import { useInviteUsersMutation } from '../../services/api';

export default function Dashboard() {
    const [badgeType, setBadgeType] = useState('green');
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);
    const { user } = useAppSelector((root) => root.auth);
    const [invite, { isLoading }] = useInviteUsersMutation()
    const generatePin = async () => {
        try {
            const response = await invite({ badgeType: isAdmin ? badgeType : undefined }).unwrap();
            toast.success('PIN generated successfully.');
            setGeneratedPin(response.data.pin);

            setTimeout(() => setGeneratedPin(null), 10000);
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };

    const isAdmin = user?.role == UserRole.ADMIN
    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <Paper className="p-6 space-y-5 flex flex-col gap-5" elevation={3}>
                <Typography variant="h5" className="font-bold">
                    Send Referral
                </Typography>
                {isAdmin && <Input
                    select
                    label="Badge Type"
                    variant="outlined"
                    fullWidth
                    value={badgeType}
                    onChange={(e) => setBadgeType(e.target.value)}
                >
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="yellow">Yellow</MenuItem>
                </Input>}

                <Button
                    variant="contained"
                    fullWidth
                    onClick={generatePin}
                    loading={isLoading}
                >
                    Generate PIN
                </Button>
                {generatedPin && (
                    <Typography variant="h6" className="text-center text-green-700">
                        Referral PIN: <strong>{generatedPin}</strong>
                    </Typography>
                )}
            </Paper>
        </div>
    );
}
