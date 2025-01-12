import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "../../../utilities/api";
import { parseAuthors } from "../../../utilities/parseApiResponse";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import List from "../../../components/List";
import AuthorCardMini from "./AuthorCardMini";
import { Box, CircularProgress, Typography } from "@mui/material";

const AuthorsSearchPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [authors, setAuthors] = useState<AuthorDTO[]>([]);
	const [searchParams, _] = useSearchParams();
	const query = searchParams.get("query");
	const navigate = useNavigate();
	useEffect(() => {
		setIsLoading(true);
		get(
			"/authors/search?query=" + query,
			(res) => {
				const responseBody = res.data.data;
				setAuthors(parseAuthors(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [query]);

	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={80} />
			) : authors.length === 0 ? (
				<Typography
					width="100%"
					fontFamily="Open Sans"
					fontSize={18}
					fontWeight={500}
					textAlign="center"
					marginTop={10}
				>
					No authors were found related to "{query}". Did you mean something
					else?
				</Typography>
			) : (
				<List
					listItemsArray={authors.map((author, index) => (
						<AuthorCardMini key={index} author={author} />
					))}
					listItemsDataValues={authors.map((author) => String(author.authorID))}
					handleListItemsClick={authors.map(
						() => (e: React.MouseEvent<HTMLElement>) =>
							navigate(`/Profile/${e.currentTarget.dataset.value}`)
					)}
					listItemTextStyle={{ flexGrow: 1 }}
					divider
					disableRipple
					listStyle={{ width: "100%" }}
				/>
			)}
		</Box>
	);
};

export default AuthorsSearchPage;
