import { useEffect, useState } from "react";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthor } from "../../../utilities/parseApiResponse";
import { useParams } from "react-router-dom";
import { get } from "../../../utilities/api";
import {
	Box,
	CircularProgress,
	Divider,
	Typography,
} from "@mui/material";
import Button from "../../../components/Button";
import {
	MoreHorizRounded as MoreHorizRoundedIcon,
} from "@mui/icons-material";
import ProfileInfo from "./ProfileInfo";

const OverviewPage = () => {
	const { authorID } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [_, setAuthor] = useState<AuthorDTO>({} as AuthorDTO);
	const [openProfileInfoDialog, setOpenProfileInfoDialog] = useState(false);
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}`,
				(res) => {
					const responseBody = res.data.data;
					setAuthor(parseAuthor(responseBody));
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[authorID]
	);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={70} />
			) : (
				<>
					<Box width="97%" marginBottom={0.5}>
						<Typography textAlign="left" fontFamily="Open Sans" fontSize={22}>
							Profile Info
						</Typography>
					</Box>
					<Box width="100%">
						<Divider />
					</Box>
					<Box width="100%">
						<Button
							fontSize={18}
							buttonStyle={{ px: 0, my: 1 }}
							handleButtonClick={() => setOpenProfileInfoDialog(true)}
							buttonIcon={<MoreHorizRoundedIcon style={{ fontSize: 28 }} />}
						>
							View Profile Info
						</Button>
					</Box>

					<Box width="97%" marginBottom={0.5}>
						<Typography textAlign="left" fontFamily="Open Sans" fontSize={22}>
							Activity
						</Typography>
					</Box>
					<Box width="100%">
						<Divider />
					</Box>
				</>
			)}
			<ProfileInfo openProfileInfoDialog={openProfileInfoDialog} setOpenProfileInfoDialog={setOpenProfileInfoDialog}/>
		</Box>
	);
};

export default OverviewPage;
