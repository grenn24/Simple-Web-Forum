import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

interface Prop {
	placeholder: string;
	handleKeyDown ?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>)=>void
}

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.black, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.black, 0.25),
	},
	marginLeft: 0,
	width: "auto",
	[theme.breakpoints.up("md")]: {
		width: "auto",
	},
	[theme.breakpoints.down("md")]: {
		width: "40%",
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
	color: "primary.light",
	width: "100%",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		[theme.breakpoints.up("sm")]: {
			width: "17ch",
			"&:focus": {
				width: "28ch",
			},
		},
	},
}));

const SearchBar = ({ placeholder , handleKeyDown}: Prop) => {

	return (
		<Search>
			<SearchIconWrapper>
				<SearchIcon style={{ color: "rgb(0, 0, 0, 0.5)" }} />
			</SearchIconWrapper>
			<StyledInputBase
			type="search"
				placeholder={placeholder}
				inputProps={{ "aria-label": "search" }}
				onKeyDown={handleKeyDown}
			/>
		</Search>
	);
};

export default SearchBar;
