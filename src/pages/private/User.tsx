import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
  CardContent,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  useBalanceQuery,
  usePayoutMutation,
  useTotalCommissionQuery,
  useUpdateUserMutation,
  useUserDetailsQuery,
} from "../../services/api";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";

type PersonalDetails = {
  name: string;
  email: string;
};

type BankDetails = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  upiId?: string;
};

type FormData = {
  personal: PersonalDetails;
  bank: BankDetails;
};

type CustomError = {
  data: { message: string };
};

export default function User() {
  const { id } = useParams();

  const { data: balance, isLoading: balanceLoading } = useBalanceQuery({ id });
  const { data: totalIncome, isLoading: incomeLoading } = useTotalCommissionQuery({ id });
  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserMutation();
  const { data, isLoading } = useUserDetailsQuery({ id: id ?? "" });

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [makePayment, { isLoading: isPaying }] = usePayoutMutation();

  // Main User Form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(
      yup.object().shape({
        personal: yup.object().shape({
          name: yup.string().required("Name is required"),
          email: yup.string().email().required(),
        }),
        bank: yup.object().shape({
          accountHolderName: yup.string().required("Account Holder Name is required"),
          bankName: yup.string().required("Bank Name is required"),
          accountNumber: yup.string().required("Account Number is required"),
          ifscCode: yup.string().required("IFSC Code is required"),
          branch: yup.string(),
          upiId: yup.string(),
        }),
      })
    ),
    defaultValues: {
      personal: { name: "", email: "" },
      bank: {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branch: "",
        upiId: "",
      },
    },
  });

  // Payment form
  const {
    register: registerPay,
    handleSubmit: handlePaySubmit,
    reset: resetPayForm,
    formState: { errors: payErrors },
  } = useForm<{ amount: number }>({
    resolver: yupResolver(
      yup.object({
        amount: yup
          .number()
          .required("Amount is required")
          .positive("Must be positive")
          .max(balance?.data ?? 0, "Cannot pay more than balance"),
      })
    ),
  });

  useEffect(() => {
    if (data?.data) {
      const info = data.data;
      reset({
        personal: {
          name: info.name ?? "",
          email: info.email ?? "",
        },
        bank: {
          accountHolderName: info.bankDetails?.accountHolderName ?? "",
          bankName: info.bankDetails?.bankName ?? "",
          accountNumber: info.bankDetails?.accountNumber ?? "",
          ifscCode: info.bankDetails?.ifscCode ?? "",
          branch: info.bankDetails?.branch ?? "",
          upiId: info.bankDetails?.upiId ?? "",
        },
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    try {
      const { personal, bank } = formData;
      await updateUser({ ...personal, bankDetails: { ...bank, userId: id }, _id: id }).unwrap();
      toast.success("Details updated successfully");
    } catch (error: unknown) {
      const customError = error as CustomError;
      toast.error(customError.data?.message || "Some error occurred");
    }
  };

  const handlePay = async ({ amount }: { amount: number }) => {
    try {
      await makePayment({  amount, userId: id ?? "" }).unwrap();
      toast.success("Payment successful");
      setPayDialogOpen(false);
      resetPayForm();
    } catch (error: unknown) {
      const customError = error as CustomError;
      toast.error(customError?.data?.message || "Payment failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md bg-green-50">
          <CardContent>
            <Typography variant="h6" className="text-green-700 font-bold">
              Total Commission
            </Typography>
            <Typography variant="h4" className="text-green-900 font-semibold mt-2">
              ₹ {incomeLoading ? '-' : totalIncome?.data?.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-blue-50">
          <CardContent>
            <Typography variant="h6" className="text-blue-700 font-bold">
              Amount to Pay
            </Typography>
            <Typography variant="h4" className="text-blue-900 font-semibold mt-2">
              ₹ {balanceLoading ? '-' : balance?.data?.toFixed(2)}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setPayDialogOpen(true)}
              className="mt-4"
            >
              Pay
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <Paper elevation={3} className="p-6 mb-6">
          <Typography variant="h6" gutterBottom>
            Personal Details
          </Typography>

          <Grid container spacing={2}>
            <Grid>
              <Controller
                name="personal.name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.personal?.name}
                    helperText={errors.personal?.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid>
              <Controller
                name="personal.email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    disabled
                    error={!!errors.personal?.email}
                    helperText={errors.personal?.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} className="p-6 mb-6">
          <Typography variant="h6" gutterBottom>
            Bank Details
          </Typography>

          <Grid container spacing={2}>
            {([
              { name: "accountHolderName", label: "Account Holder Name", type: "text" },
              { name: "bankName", label: "Bank Name", type: "text" },
              { name: "accountNumber", label: "Account Number", type: "password" },
              { name: "ifscCode", label: "IFSC Code", type: "text" },
              { name: "branch", label: "Branch (Optional)", type: "text" },
              { name: "upiId", label: "UPI ID (Optional)", type: "text" },
            ] as const).map(({ name, label, type }) => (
              <Grid key={name}>
                <Controller
                  name={`bank.${name}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={type}
                      label={label}
                      fullWidth
                      error={!!errors.bank?.[name]}
                      helperText={(errors.bank?.[name])?.message}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box className="text-right">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty}
            loading={updateUserLoading}
          >
            Update
          </Button>
        </Box>
      </form>

      {/* Payment Dialog */}
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Make a Payment</DialogTitle>
        <form onSubmit={handlePaySubmit(handlePay)} noValidate>
          <DialogContent className="space-y-4 text-black">
            <TextField
              {...registerPay("amount")}
              label="Amount"
              fullWidth
              type="number"
              
              error={!!payErrors.amount}
              helperText={payErrors.amount?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayDialogOpen(false)} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={isPaying}>
              {isPaying ? "Paying..." : "Pay"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
