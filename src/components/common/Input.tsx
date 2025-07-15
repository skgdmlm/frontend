import TextField, { type TextFieldProps } from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import React from "react"

type InputProps = TextFieldProps

export default function Input(props: InputProps) {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = props.type === "password"

    return (
        <TextField
            {...props}
            type={isPassword && !showPassword ? "password" : "text"}
            className={`mb-2 ${props.className ?? ""}`}
            variant={props.variant ?? "outlined"}
            fullWidth={props.fullWidth ?? true}
            InputProps={{
                ...(props.InputProps || {}),
                endAdornment: isPassword ? (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((show) => !show)}
                            edge="end"
                            disableFocusRipple
                            disableRipple
                            style={{ outline: "none" }}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <VisibilityOff sx={{ color: "#222", ":focus": 'none' }} />
                            ) : (
                                <Visibility sx={{ color: "#222" }} />
                            )}
                        </IconButton>
                    </InputAdornment>
                ) : (
                    props.InputProps?.endAdornment
                ),
            }}
        />
    )
}