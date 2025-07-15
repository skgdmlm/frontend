import Button, { type ButtonProps } from "@mui/material/Button"

type CommonButtonProps = ButtonProps

export default function CommonButton(props: CommonButtonProps) {
    return (
        <Button
            {...props}
            className={`py-2 rounded font-semibold transition-colors duration-200 ${props.className ?? ""}`}
            variant={props.variant ?? "contained"}
            fullWidth={props.fullWidth ?? true}
            sx={{
                ...props.sx,
                "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                },
            }}
        >
            {props.children}
        </Button>
    )
}