
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useUpdatePasswordMutation
} from "../../services/api";
import toast from "react-hot-toast";
import { useAppSelector } from "../../store/store";
import Input from "../../components/common/Input";


type CustomError = {
  data: { message: string };
};

export default function Profile() {
  const { user } = useAppSelector((root) => root.auth);
  const [resetPassword, { isLoading: resetPasswordLoading }] = useUpdatePasswordMutation();
 const {
    register: resetPasswordRegister,
    handleSubmit: resetPasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: resetPasswordErrors },
  } = useForm<{ password: string, confirmPassword: string }>({
    resolver: yupResolver(
      yup.object({
        password: yup.string()
          .min(8, 'Password must be at least 8 characters')
          .matches(/[A-Z]/, 'Must contain one uppercase letter')
          .matches(/[a-z]/, 'Must contain one lowercase letter')
          .matches(/\d/, 'Must contain one number')
          .matches(/[@$!%*?&#]/, 'Must contain one special character')
          .required('Required'),
        confirmPassword: yup.string()
          .oneOf([yup.ref('password')], 'Passwords must match')
          .required('Required'),
      }),
    )
  });


 const handlePasswordReset = async ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
    try {
      await resetPassword({ userId: user?._id ?? "", password, confirmPassword }).unwrap();
      toast.success("Password reset successful");
      resetPasswordForm();
    } catch (error: unknown) {
      const customError = error as CustomError;
      toast.error(customError?.data?.message || "Reset password failed");
    }
  };
  return (
    <>
     <form onSubmit={resetPasswordSubmit(handlePasswordReset)} className="p-4">
                <Paper elevation={3} className="p-6 mb-6">
                  <Typography variant="h6" gutterBottom>
                    Reset Password
                  </Typography>
    
                  <Grid container spacing={2}>
                    <Input
                      label="Password"
                      type="password"
                      fullWidth
                      error={!!resetPasswordErrors.password}
                      helperText={resetPasswordErrors.password?.message}
                      {...resetPasswordRegister("password")}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      error={!!resetPasswordErrors.confirmPassword}
                      helperText={resetPasswordErrors.confirmPassword?.message}
                      {...resetPasswordRegister("confirmPassword")}
                    />
                  </Grid>
                </Paper>
                  <Box className="text-right">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                loading={resetPasswordLoading}
              >
                Reset Password
              </Button>
            </Box>
              </form>
    </>
  );
}
