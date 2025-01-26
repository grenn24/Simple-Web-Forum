import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscussionDTO } from "../../../dtos/DiscussionDTO";
import { get } from "../../../utilities/api";
import { parseDiscussions } from "../../../utilities/parseApiResponse";
import DiscussionCardsViewer from "./DiscussionCardsViewer";

const DiscoverDiscussionsPage = () => {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>();
	const [isLoading, setIsLoading] = useState(true);
	const [popularDiscussions, setPopularDiscussions] = useState<DiscussionDTO[]>([]);
	useEffect(() => {
		get("/discussions/popular", (res) => {
			const responseBody = res.data.data;
			setPopularDiscussions(parseDiscussions(responseBody));
			setIsLoading(false);
		},err=>console.log(err));
	}, []);
	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			{isLoading ? (
				<Box marginTop={30}>
					<CircularProgress size={80} />
				</Box>
			) : (
				<Box width="100%">
					<TextField
						type="search"
						inputRef={inputRef}
						placeholder="Search Discussions"
						size="small"
						sx={{ width: 300 }}
						onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
							if (e.key === "Enter" && inputRef.current?.value !== "") {
								navigate(
									`/Search?query=${inputRef.current?.value}&type=Discussions`
								);
								(document.activeElement as HTMLElement)?.blur();
							}
						}}
					></TextField>
					<br />
					<br />
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={21}
						color="text.primary"
						marginBottom={2}
					>
						Popular Discussions
					</Typography>
					<DiscussionCardsViewer discussions={popularDiscussions} />
				</Box>
			)}
		</Box>
	);
};

export default DiscoverDiscussionsPage;
