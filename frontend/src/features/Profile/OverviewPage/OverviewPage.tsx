import { useEffect, useState } from "react";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthor } from "../../../utilities/parseApiResponse";
import { useParams } from "react-router-dom";
import { get } from "../../../utilities/apiClient";
import { dateToYear } from "../../../utilities/dateToString";
import { Box, CircularProgress, Typography } from "@mui/material";

const OverviewPage = () => {
    const { authorID} = useParams();
    const [isLoading, setIsLoading] = useState(true);
	const [author, setAuthor] = useState<AuthorDTO>({} as AuthorDTO);
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}`,
				(res) => {
					const responseBody = res.data.data;
					setAuthor(parseAuthor(responseBody));
					setIsLoading(false);
					console.log(parseAuthor(responseBody));
				},
				(err) => console.log(err)
			),
		[authorID]
	);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
		{isLoading && <CircularProgress size={70} />}
			<Typography>
				{!isLoading && "User since " + dateToYear(author.createdAt, "short")}
			</Typography>
		</Box>
	);
};

export default OverviewPage;
