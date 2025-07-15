import { useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  usePersonalDetailsQuery,
  useUpdateUserMutation,
} from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { useAppSelector } from "../../store/store";
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

const schema = yup.object().shape({
  personal: yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required(),
  }),
  bank: yup.object().shape({
    accountHolderName: yup
      .string()
      .required("Account Holder Name is required"),
    bankName: yup.string().required("Bank Name is required"),
    accountNumber: yup.string().required("Account Number is required"),
    ifscCode: yup.string().required("IFSC Code is required"),
    branch: yup.string(),
    upiId: yup.string(),
  }),
});

type CustomError = {
  data: { message: string };
};

export default function Profile() {
  const { user } = useAppSelector((root) => root.auth);
  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();
  const { data, isLoading } = usePersonalDetailsQuery();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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

  useEffect(() => {
    if (data?.data) {
      const info = data.data;
      console.log('info: ', info);
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

  if (isLoading) return <Loader />;

  const onSubmit = async (formData: FormData) => {
    try {
      const { personal, bank } = formData;
      await updateUser({ ...personal, bankDetails: {...bank, userId: user?._id}, _id: user?._id }).unwrap();
      toast.success("Details updated successfully");
    } catch (error: unknown) {
      const customError = error as CustomError;
      toast.error(customError.data?.message || "Some error occurred");
    }
  };

  return (
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
            { name: "accountNumber", label: "Account Number", type: "password"},
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
  );
}
