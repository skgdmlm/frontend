import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import { Typography } from "@mui/material"
import { useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useRegisterMutation } from "../../services/api"
import bg from "../../assets/jpg/5068978.jpg"

const schema = yup.object({
    name: yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .required('Required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Required'),
}).required()

type RegisterFormInputs = {
    name: string
    password: string
    confirmPassword: string
}

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const invitationId = searchParams.get('code') ?? '';

    const [verifyInvitation, { isLoading }] = useRegisterMutation();

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            await verifyInvitation({ token: invitationId, ...data }).unwrap();
            toast.success('Registration success');
            navigate("/login")
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-black" >
             <Input
                label="Name"
                type="text"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
                className="!mb-4"
            />
            <Input
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                className="!mb-4"
            />
            <Input
                label="Confirm Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                className="!mb-4"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
            >
                ACCEPT INVITATION
            </Button>
        </form>
        
    )
}


export default function Register() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center opacity-90"    style={{
        backgroundImage: `url(${bg})`
      }}>
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
                <Typography variant="h5" className="!font-bold !mb-4 !text-center text-black">
                    SET PASSWORD
                </Typography>
                <LoginForm />
            </div>
        </div>
    )
}
