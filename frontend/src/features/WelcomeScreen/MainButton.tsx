import Button from '../../components/Button';
import { Box } from '@mui/material';

interface Prop {
    setFormStatus: (status: string)=> void;
    visibility: string;
    opacity: number
}
const MainButton = ({setFormStatus, visibility, opacity}: Prop) => {
  return (
		<Box
			position="absolute"
			top="50%"
			left="50%"
			sx={{
				transform: "translate(-50%, -50%)",
				opacity: opacity,
				visibility: visibility,
				transition: "all 1.0s ease-in-out",
			}}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
			
		>
			<Button
				variant="contained"
				backgroundColor="primary.dark"
				handleButtonClick={() => setFormStatus("log in")}
			>
				Log In
			</Button>
			<br />
			<br />
			<Button
				variant="contained"
				backgroundColor="primary.dark"
				handleButtonClick={() => setFormStatus("sign up")}
			>
				Sign Up
			</Button>
		</Box>
	);
}

export default MainButton