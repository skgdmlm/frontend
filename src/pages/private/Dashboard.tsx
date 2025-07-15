import { useState } from 'react';
import { Button, MenuItem, Typography, Paper } from '@mui/material';
import {UserRole} from "../../utils/enums"
import Input from '../../components/common/Input';
import EmailChipInput from '../../components/common/EmailChipInput';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../store/store';
import { useInviteUsersMutation } from '../../services/api';

export default function Dashboard() {
    const [badgeType, setBadgeType] = useState('green');
    const [emails, setEmails] = useState<Array<string>>([]);
const { user } = useAppSelector((root) => root.auth);
const [invite, {isLoading}] = useInviteUsersMutation()
    const sendReferral = async() => {
        if (emails.length == 0) {
            toast.error('Atleast 1 email is required')
            return;
        }
        try {
             await invite({ emails, badgeType: isAdmin ? badgeType : undefined }).unwrap();
                    toast.success('Referral send successfully.');
                    setEmails([])
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
                <EmailChipInput emails={emails} setEmails={setEmails} />
              {isAdmin &&  <Input
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
                    onClick={sendReferral}
                    loading={isLoading}
                >
                    Send Referral
                </Button>

            </Paper>
        </div>
    );
}
