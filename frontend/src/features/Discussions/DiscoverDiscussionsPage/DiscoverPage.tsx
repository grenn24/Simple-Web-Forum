import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscussionDTO } from "../../../dtos/DiscussionDTO";
import { get } from "../../../utilities/api";
import { parseDiscussions } from "../../../utilities/parseApiResponse";
import DiscussionCardsViewer from "./DiscussionCardsViewer";

const DiscoverPage = () => {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>();
	const [popularDiscussions, setPopularDiscussions] = useState<DiscussionDTO[]>([]);
	useEffect(() => {
		get("/discussions/popular", (res) => {
			const responseBody = res.data.data;
			setPopularDiscussions(parseDiscussions(responseBody));
			console.log(responseBody);
		});
	}, []);
	return (
		<Box width="100%">
			<TextField
				type="search"
				inputRef={inputRef}
				placeholder="Search Discussions"
				size="small"
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
				fontSize={20}
				color="text.primary"
			>
				Popular Discussions
			</Typography>
			<DiscussionCardsViewer discussions={popularDiscussions}/>
		</Box>
	);
};

export default DiscoverPage;
