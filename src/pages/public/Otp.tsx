import React, { useState, useEffect } from "react"
import OTPInput from "react-otp-input"
import Button from "../../components/common/Button"
import { useVerifyOtpMutation } from "../../services/api"
import { useLocation } from "react-router-dom"
import { handleSetLocalStorage } from "../../utils/functions"
import { setTokens } from "../../store/reducers/authReducer"
import { useAppDispatch } from "../../store/store"
import { TokenType } from "../../utils/enums"
import toast from "react-hot-toast"

export default function Otp() {
    const location = useLocation();
    const dispatch = useAppDispatch()

    const [otp, setOtp] = useState("")
    const [resendTimer, setResendTimer] = useState(30)
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
    const handleChange = (otpValue: string) => {
        setOtp(otpValue)
    }
    const { email = "" } = location?.state ?? {};


    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            const response = await verifyOtp({ otp: Number(otp), email: email.toString() }).unwrap();
            dispatch(setTokens(response.data));
            handleSetLocalStorage(TokenType.ACCESS_TOKEN, response.data.accessToken);
            handleSetLocalStorage(TokenType.REFRESH_TOKEN, response.data.refreshToken);
            toast.success('OTP verified successfully');
            // window.location.reload()
            // navigate("/")
            window.location.replace("/")
        } catch (error: unknown) {
            const customError = error as CustomError;
            toast.error(customError.data.message || 'Some error occured');
        }
    };
    const handleResend = () => {
        // Simulate resend logic (e.g., API call)
        toast.success("OTP resent!")
        setResendTimer(30)
    }

    useEffect(() => {
        if (resendTimer === 0) return
        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [resendTimer])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center opacity-90">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-black">
                <h2 className="text-xl font-semibold mb-6 text-center text-black">Enter OTP</h2>

                <div className="flex justify-center mb-4">
                    <OTPInput
                        value={otp}
                        onChange={handleChange}
                        numInputs={6}
                        containerStyle="flex justify-center gap-2 mb-3"
                        skipDefaultStyles
                        renderInput={(props) => (
                            <input
                                {...props}
                                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg"
                            />
                        )}
                    />

                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    disabled={otp.length < 6 || isLoading}
                    loading={isLoading}
                >
                    Verify OTP
                </Button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Didn’t receive the code?
                    <span
                        onClick={resendTimer === 0 ? handleResend : undefined}
                        className={`ml-2 font-medium cursor-pointer ${resendTimer > 0 ? "text-gray-400 pointer-events-none" : "text-blue-600 hover:underline"
                            }`}
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </span>
                </div>

            </form>
        </div>
    )
}
