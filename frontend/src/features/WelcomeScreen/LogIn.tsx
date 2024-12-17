import { Box ,  TextField } from "@mui/material"
import { useForm } from "react-hook-form";
import Button from "../../components/Button";

interface Prop {
	opacity: number;
	visibility: string
}
const LogIn = ({opacity, visibility}: Prop) => {
	const { register, handleSubmit , formState: { errors}} = useForm();
  return (
		<Box
			position="absolute"
			top="50%"
			sx={{
				transform: "translateY(-50%) translateX(50%)",
				opacity: opacity,
				visibility: visibility,
				transition: "all 1.0s ease-in-out",
			}}
			{...register("email", { required: true })}
		>
			<form
				onSubmit={handleSubmit((data) => console.log(data))}
				onKeyDown={(event) =>
					event.key === "Enter" && handleSubmit((data) => console.log(data))
				}
			>
				<TextField
					label="Email"
					variant="outlined"
					{...register("email", { required: true })}
					error={!!errors.email}
					helperText={errors.email ? "The email field is required" : null}
				/>
				<br />
				<br />
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					{...register("password", { required: true })}
					error={!!errors.password}
					helperText={errors.password ? "The password field is required" : null}
				/>
				<Button type="submit" buttonStyle={{ display: "none" }}>
					Submit
				</Button>
			</form>
		</Box>
	);
}

export default LogIn