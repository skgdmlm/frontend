import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import { Typography } from "@mui/material"
import toast from "react-hot-toast"
import { useLoginMutation } from "../../services/api"
import { useAppDispatch } from "../../store/store"
import { setTokens } from "../../store/reducers/authReducer"
import { handleSetLocalStorage } from "../../utils/functions"
import { TokenType } from "../../utils/enums"
import { Link } from "react-router-dom"

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Min 6 characters").required("Password is required"),
}).required()

type LoginFormInputs = {
    email: string
    password: string
}

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    })

    
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await login({ email: data.email, password: data.password }).unwrap();
            dispatch(setTokens(response.data));
            handleSetLocalStorage(TokenType.ACCESS_TOKEN, response.data.accessToken);
            handleSetLocalStorage(TokenType.REFRESH_TOKEN, response.data.refreshToken);
            toast.success('Login successfull');
            window.location.replace("/")
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-black">
            <Input
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
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
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
            >
                Login
            </Button>
            <Typography variant="body2" className="text-center text-gray-600">
                Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>   
            </Typography>
        </form>
    )
}


export default function Login() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center opacity-90">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
                <Typography variant="h5" className="!font-bold !mb-4 !text-center text-black">
                    LOGIN
                </Typography>
                <LoginForm />
            </div>
        </div>
    )
}
