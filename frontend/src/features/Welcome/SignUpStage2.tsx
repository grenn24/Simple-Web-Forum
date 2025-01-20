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
import { useAppDispatch, useAppSelector } from "../../utilities/redux";
import {
	incrementStage,
	changeBirthday,
	changeFaculty,
	changeGender,
} from "./signUpSlice";
import { motion } from "motion/react";

const SignUpStage2 = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [disableFacultySelect, setDisableFacultySelect] = useState(false);
	const { currentSignUpStage, birthday, faculty, gender } = useAppSelector((state) => ({
		currentSignUpStage: state.signUp.currentSignUpStage,
		birthday: state.signUp.birthday,
		faculty: state.signUp.faculty,
		gender: state.signUp.gender,
	}));

	// check if current sign up stage is at 0
	useEffect(() => {
		if (currentSignUpStage === 0) {
			navigate("/Welcome");
		}
	}, []);

	const handleBirthdaySelect = (date: Date) => {
		dispatch(changeBirthday(date));
	};
	const handleFacultySelect = (faculty: string) => {
		dispatch(changeFaculty(faculty));
	};
	const handleGenderSelect = (gender: string)=>{
		dispatch(changeGender(gender));
	}
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1.4 }}
		>
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
						<Select
							label="Gender"
							defaultValue={gender}
							handleSelect={handleGenderSelect}
							values={["Male", "Female"]}
						/>
						<br />
						<br />
						<DatePicker
							label="Birthday"
							handleDateSelect={handleBirthdaySelect}
							defaultValue={birthday}
							width="100%"
							onClear={()=>dispatch(changeBirthday(null))}
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
								console.log(faculty);
								setDisableFacultySelect(!disableFacultySelect);
								if (!checked) {
									dispatch(changeFaculty(""));
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
		</motion.div>
	);
};

export default SignUpStage2;
