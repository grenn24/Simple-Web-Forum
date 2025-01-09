import {
	Box,
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Typography,
} from "@mui/material";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardRounded as ArrowForwardRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useAppDispatch, useAppSelector } from "../../utilities/reduxHooks";
import {
	incrementStage,
	changeBirthday,
	changeFaculty,
	changeNusStudent,
} from "./signUpSlice";

const SignUpStage2 = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [disableFacultySelect, setDisableFacultySelect] = useState(false);
	const {
		currentSignUpStage,
		birthday,
		faculty,
	} = useAppSelector((state) => ({
		currentSignUpStage: state.signUp.currentSignUpStage,
		name: state.signUp.name,
		username: state.signUp.username,
		email: state.signUp.email,
		birthday: state.signUp.birthday,
		biography: state.signUp.biography,
		faculty: state.signUp.faculty,
		password: state.signUp.password,
		nusStudent: state.signUp.nusStudent,
	}));

	// check if current sign up stage is at 0
	useEffect(() => {
		if (currentSignUpStage === 0) {
			navigate("/Welcome");
		}
	}, []);

	const handleBirthdaySelect = (date: Date) => {
		console.log(date);
		dispatch(changeBirthday(date));
	};
	const handleFacultySelect = (faculty: string) => {
		console.log(faculty);
		dispatch(changeFaculty(faculty));
	};
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box marginBottom={3} width={350}>
				<Typography textAlign="center">
					Share with others your birthday 🎂 and the faculty you are in 🏫
				</Typography>
			</Box>

			<Card elevation={4} sx={{ width: 350, marginBottom: 10 }}>
				<CardContent>
					<Box
						width="100%"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						marginBottom={1}
					>
						<Button
							buttonIcon={<ArrowBackRoundedIcon />}
							color="primary.dark"
							handleButtonClick={() => navigate("../1")}
							toolTipText="Return"
						/>
						<Typography fontFamily="Open Sans" fontSize={20}>
							Step 2
						</Typography>
						<Button
							buttonIcon={<ArrowForwardRoundedIcon />}
							color="primary.dark"
							handleButtonClick={() => {
								dispatch(incrementStage());
								navigate("../3");
							}}
							toolTipText="Skip"
						/>
					</Box>
					<DatePicker
						label="Birthday"
						handleDateSelect={handleBirthdaySelect}
						defaultValue={birthday}
						width="100%"
					/>
					<br />
					<br />
					<Select
						label="Faculty"
						defaultValue={faculty}
						handleSelect={handleFacultySelect}
						values={[
							"Computing",
							"Business",
							"Dentistry",
							"Law",
							"Medicine",
							"Science",
							"Arts and Social Sciences",
							"Public Health",
							"Engineering",
						]}
						disabled={disableFacultySelect}
					/>
					<br />
					<br />
					<FormControlLabel
						control={<Checkbox />}
						label="I am currently not a NUS student"
						onChange={(_, checked) => {
							setDisableFacultySelect(!disableFacultySelect);
							if (checked) {
								
								dispatch(changeFaculty(undefined));
								dispatch(changeNusStudent(false));
							}
						}}
					/>
					<br />
					<br />
					<Box display="flex" justifyContent="center">
						<Button
							variant="outlined"
							buttonIcon={<ArrowForwardIosRoundedIcon />}
							iconPosition="end"
							color="primary.dark"
							handleButtonClick={() => navigate("../3")}
						>
							Next
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default SignUpStage2;
