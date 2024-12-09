import React from 'react'
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

interface Prop {
    placeholder: string;
}
const SearchBar = ({placeholder} : Prop) => {

  	const Search = styled("div")(({ theme }) => ({
			position: "relative",
			borderRadius: theme.shape.borderRadius,
			backgroundColor: alpha(theme.palette.common.black, 0.1),
			"&:hover": {
				backgroundColor: alpha(theme.palette.common.black, 0.15),
			},
			marginLeft: 0,
			width: "100%",
			[theme.breakpoints.up("sm")]: {
				marginLeft: theme.spacing(1),
				width: "auto",
			},
		}));

		const SearchIconWrapper = styled("div")(({ theme }) => ({
			padding: theme.spacing(0, 2),
			height: "100%",
			position: "absolute",
			pointerEvents: "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}));

		const StyledInputBase = styled(InputBase)(({ theme }) => ({
			color: "inherit",
			width: "100%",
			"& .MuiInputBase-input": {
				padding: theme.spacing(1, 1, 1, 0),
				// vertical padding + font size from searchIcon
				paddingLeft: `calc(1em + ${theme.spacing(4)})`,
				transition: theme.transitions.create("width"),
				[theme.breakpoints.up("sm")]: {
					width: "17ch",
					"&:focus": {
						width: "25ch",
					},
				},
			},
		}));
  return (
		<Search sx={{ border: "5px" }}>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder={placeholder}
				inputProps={{ "aria-label": "search" }}
				sx={{ border: "5px" }}
			/>
		</Search>
	);
}

export default SearchBar