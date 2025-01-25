import {
	Box,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
} from "@mui/material";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import Button from "../../../components/Button";
import {
	CakeRounded as CakeRoundedIcon,
	EmailRounded as EmailRoundedIcon,
	AlternateEmailRounded as AlternateEmailRoundedIcon,
	FontDownloadRounded as FontDownloadRoundedIcon,
	PersonRounded as PersonRoundedIcon,
	SchoolRounded as SchoolRoundedIcon,
} from "@mui/icons-material";
import { dateToYear } from "../../../utilities/dateToString";
import { useEffect, useState } from "react";
import DatePicker from "../../../components/DatePicker/DatePicker";
import Select from "../../../components/Select";
import { useForm } from "react-hook-form";
import { get, putFormData } from "../../../utilities/api";
import { useParams } from "react-router-dom";
import { parseAuthor } from "../../../utilities/parseApiResponse";
import faculty from "../faculty";
import gender from "../gender";

interface Prop {
	openProfileInfoDialog: boolean;
	setOpenProfileInfoDialog: (value: boolean) => void;
}
const ProfileInfo = ({
	openProfileInfoDialog,
	setOpenProfileInfoDialog,
}: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({ mode: "onChange" });
	const { authorID } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [author, setAuthor] = useState({} as AuthorDTO);
	const [selectedFaculty, setSelectedFaculty] = useState("");
	const [selectedGender, setSelectedGender] = useState("");
	const [birthday, setBirthday] = useState<Date | null>(null);
	const handleUpdateProfileInfo = handleSubmit((data) => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("username", data.username);
		formData.append("faculty", selectedFaculty);
		formData.append("gender", selectedGender);
		birthday
			? formData.append("birthday", birthday.toLocaleDateString("en-sg"))
			: formData.append("birthday", "");
		putFormData(
			`/authors/${author.authorID}`,
			formData,
			() => {
				setIsEditing(false);
				setIsLoading(false);
			},
			(err) => {
				console.log(err);
				setIsLoading(false);
				const errBody = err.data;
				if (errBody.error_code === "NAME_ALREADY_EXISTS") {
					setError("name", {
						type: "custom",
						message: errBody.message,
					});
				}
				if (errBody.error_code === "USERNAME_ALREADY_EXISTS") {
					setError("username", {
						type: "custom",
						message: errBody.message,
					});
				}
			}
		);
	});

	useEffect(() => {
		get(
			`/authors/${authorID === "User" ? "user" : authorID}`,
			(res) => {
				const responseBody = res.data.data;
				const author = parseAuthor(responseBody);
				setAuthor(author);
				author.faculty && setSelectedFaculty(author.faculty);
				author.birthday && setBirthday(author.birthday);
				author.gender && setSelectedGender(author.gender);
			},
			(err) => console.log(err)
		);
	}, [isEditing]);

	return (
		<Dialog
			scroll="paper"
			open={openProfileInfoDialog}
			onClose={() => setOpenProfileInfoDialog(false)}
			BackdropProps={{
				sx: {
					backdropFilter: `blur(5px)`,
				},
			}}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="alert-dialog-title">
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography fontFamily="Open Sans" fontSize={24}>
						Profile Info
					</Typography>
					{author.isUser && (
						<Button
							disableHoverEffect
							fontSize={20}
							handleButtonClick={() =>
								isEditing ? handleUpdateProfileInfo() : setIsEditing(true)
							}
							loadingStatus={isLoading}
							fontFamily="Open Sans"
						>
							{isEditing ? "Save" : "Edit All"}
						</Button>
					)}
				</Box>
			</DialogTitle>
			<DialogContent dividers>
				<Box display="flex" alignItems="center" marginBottom={2}>
					<Button
						buttonIcon={
							<FontDownloadRoundedIcon sx={{ color: "primary.dark" }} />
						}
						buttonStyle={{ marginRight: 3 }}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Name"
					></Button>
					{isEditing ? (
						<TextField
							placeholder="Name"
							size="small"
							defaultValue={author.name}
							fullWidth
							{...register("name", {
								required: "The name field is required",
							})}
							autoComplete="name"
							error={!!errors.name}
							helperText={errors.name?.message as string}
						/>
					) : (
						<Typography>{author.name}</Typography>
					)}
				</Box>

				<Box display="flex" alignItems="center" marginBottom={2}>
					{" "}
					<Button
						buttonStyle={{ marginRight: 3 }}
						buttonIcon={
							<AlternateEmailRoundedIcon sx={{ color: "primary.dark" }} />
						}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Username"
					></Button>
					{isEditing ? (
						<TextField
							placeholder="Username"
							size="small"
							defaultValue={author.username}
							fullWidth
							{...register("username", {
								required: "The username field is required",
							})}
							autoComplete="username"
							error={!!errors.username}
							helperText={errors.username?.message as string}
						/>
					) : (
						<Typography>{author.username}</Typography>
					)}
				</Box>

				<Box display="flex" alignItems="center" marginBottom={2}>
					{" "}
					<Button
						buttonStyle={{ marginRight: 3 }}
						buttonIcon={<EmailRoundedIcon sx={{ color: "primary.dark" }} />}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Email"
					></Button>
					<Typography>{author.email}</Typography>
				</Box>

				<Box display="flex" alignItems="center" marginBottom={2}>
					{" "}
					<Button
						buttonStyle={{ marginRight: 3 }}
						buttonIcon={<SchoolRoundedIcon sx={{ color: "primary.dark" }} />}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Faculty"
					></Button>
					{isEditing ? (
						<Select
							label="Faculty"
							currentItemIndex={faculty.findIndex(
								(faculty) => faculty === selectedFaculty
							)}
							handleSelect={(index) =>
								index !== -1
									? setSelectedFaculty(faculty[index])
									: setSelectedFaculty("")
							}
							selectItemsArray={faculty}
							fullWidth
						/>
					) : (
						<Typography>{author.faculty}</Typography>
					)}
				</Box>

				<Box display="flex" alignItems="center" marginBottom={2}>
					<Button
						buttonStyle={{ marginRight: 3 }}
						buttonIcon={<PersonRoundedIcon sx={{ color: "primary.dark" }} />}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Gender"
					></Button>
					{isEditing ? (
						<Select
							label="Gender"
							currentItemIndex={["Male", "Female"].findIndex(gender=>gender===selectedGender)}
							handleSelect={(index) =>
								index !== -1
									? setSelectedGender(gender[index])
									: setSelectedGender("")}
							selectItemsArray={gender}
							fullWidth
						/>
					) : (
						<Typography>{author.gender}</Typography>
					)}
				</Box>

				<Box display="flex" alignItems="center">
					<Button
						buttonStyle={{ marginRight: 3 }}
						buttonIcon={<CakeRoundedIcon sx={{ color: "primary.dark" }} />}
						disableHoverEffect
						disableRipple
						backgroundColor="primary.light"
						toolTipText="Birthday"
					></Button>
					{isEditing ? (
						<Box flexGrow={1}>
							<DatePicker
								label="Birthday"
								handleDateSelect={(birthday) => setBirthday(birthday)}
								defaultValue={author.birthday}
								width="100%"
								onClear={() => setBirthday(null)}
								maxDate={new Date()}
							/>
						</Box>
					) : (
						<Typography>
							{author.birthday ? dateToYear(author.birthday, "short") : null}
						</Typography>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default ProfileInfo;
