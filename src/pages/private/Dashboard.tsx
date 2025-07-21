import { useState } from 'react';
import { Button, MenuItem, Typography, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { UserRole } from "../../utils/enums";
import Input from '../../components/common/Input';

import toast from 'react-hot-toast';
import { useAppSelector } from '../../store/store';
import { useInviteUsersMutation } from '../../services/api';

type FormValues = {
    password: string;
};

export default function Dashboard() {
    const [badgeType, setBadgeType] = useState('green');
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);
    const { user } = useAppSelector((root) => root.auth);
    const isAdmin = user?.role === UserRole.ADMIN;

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [invite, { isLoading }] = useInviteUsersMutation();

    const generatePin = async (data: FormValues) => {
        try {
            const response = await invite({
                badgeType: isAdmin ? badgeType : undefined,
                password: data.password,
            }).unwrap();

            toast.success('PIN generated successfully.');
            setGeneratedPin(response.data.pin);
            setTimeout(() => setGeneratedPin(null), 10000);
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <Paper className="p-6 space-y-5 flex flex-col gap-5" elevation={3}>
                <Typography variant="h5" className="font-bold">
                    Send Referral
                </Typography>

                <form onSubmit={handleSubmit(generatePin)} className="flex flex-col gap-4">
                    {isAdmin && (
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
                    )}

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

                {generatedPin && (
                    <Typography variant="h6" className="text-center text-green-700">
                        Referral PIN: <strong>{generatedPin}</strong>
                    </Typography>
                )}
            </Paper>
        </div>
    );
}
