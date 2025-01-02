import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRemoveRoundedIcon from "@mui/icons-material/BookmarkRemoveRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import ArchiveRoundedIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

const MenuExpandedIcons = (bookmarkStatus: boolean, archiveStatus: boolean) => [
	archiveStatus ? (
		<UnarchiveIcon sx={{ marginRight: 2 }} />
	) : (
		<ArchiveRoundedIcon sx={{ marginRight: 2 }} />
	),
	bookmarkStatus ? (
		<BookmarkRemoveRoundedIcon sx={{ marginRight: 2 }} />
	) : (
		<BookmarkBorderRoundedIcon sx={{ marginRight: 2 }} />
	),
	<OutlinedFlagRoundedIcon sx={{ marginRight: 2 }} />,
];

export default MenuExpandedIcons;
