import { Box, TextField, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const DiscoverPage = () => {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>();
	return (
		<Box width="100%">
			<TextField
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
			<Typography
				textAlign={"left"}
				fontFamily="Open Sans"
				fontWeight={700}
				fontSize={20}
				color="text.primary"
			>
				Popular Discussions
			</Typography>
		</Box>
	);
};

export default DiscoverPage;
