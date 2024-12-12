import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

interface Prop {
	placeholder: string;
}
const SearchBar = ({ placeholder }: Prop) => {
	const Search = styled("div")(({ theme }) => ({
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.black, 0.1),
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.black, 0.15),
		},
		marginLeft: 0,
		[theme.breakpoints.up("sm")]: {
			width: "auto",
		},
		[theme.breakpoints.down("sm")]: {
			width: "50%",
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
		color: "primary",
		width: "100%",
		"& .MuiInputBase-input": {
			padding: theme.spacing(1, 1, 1, 0),
			paddingLeft: `calc(1em + ${theme.spacing(4)})`,
			transition: theme.transitions.create("width"),
			[theme.breakpoints.up("xs")]: {
				width: "17ch",
			},
			[theme.breakpoints.up("xs")]: {
				width: "17ch",
				"&:focus": {
					width: "25ch",
				},
			},
		},
	}));

	const setSearchBarInput = useState("")[1];

	return (
		<Search sx={{ border: "5px" }}>
			<SearchIconWrapper>
				<SearchIcon color="primary" />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder={placeholder}
				inputProps={{ "aria-label": "search" }}
				defaultValue=""
				onKeyDown={(e) =>
					e.key === "Enter" ? setSearchBarInput(e.currentTarget.value) : null
				}
			/>
		</Search>
	);
};

export default SearchBar;
