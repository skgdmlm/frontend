import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useRegisterMutation } from "../../services/api"
import bg from "../../assets/jpg/5068978.jpg"

const schema = yup.object({
    name: yup.string().min(2, 'Name must be at least 2 characters').required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    pin: yup.string().length(6, 'PIN must be exactly 6 digits').required('Required'),
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
}).required()


type RegisterFormInputs = {
    name: string
    email: string
    pin: string
    password: string
    confirmPassword: string
}

function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    const [verifyInvitation, { isLoading }] = useRegisterMutation();

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            await verifyInvitation(data).unwrap();
            toast.success('Registration successful');
            navigate("/login");
        } catch (error: unknown) {
            const customError = error as CustomError;
            let message = customError?.data?.message;
            if(customError?.data?.message == "Validation error!"){
                message = customError?.data?.data?.errors?.[0]?.msg ?? "Validation error";
            }
            toast.error(message || 'Some error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-black">
            <Input
                label="Name"
                type="text"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
            />
            <Input
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
            />
            <Input
                label="Referral PIN"
                type="text"
                fullWidth
                error={!!errors.pin}
                helperText={errors.pin?.message}
                {...register("pin")}
            />
            <Input
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
            />
            <Input
                label="Confirm Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
            >
                Register
            </Button>
        </form>
    )
}

export default function Register() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center opacity-90"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
                <Typography variant="h5" className="!font-bold !mb-4 !text-center text-black">
                    Register
                </Typography>
                <RegisterForm />
            </div>
        </div>
    )
}
