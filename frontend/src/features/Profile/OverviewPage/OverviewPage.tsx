import { useEffect, useState } from "react";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthor } from "../../../utilities/parseApiResponse";
import { useParams } from "react-router-dom";
import { get } from "../../../utilities/apiClient";
import { dateToYear } from "../../../utilities/dateToString";
import { Typography } from "@mui/material";

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
		<>
			<Typography>
				{!isLoading && "User since " + dateToYear(author.createdAt, "short")}
			</Typography>
		</>
	);
};

export default OverviewPage;
