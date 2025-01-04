import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRemoveRoundedIcon from "@mui/icons-material/BookmarkRemoveRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import ArchiveRoundedIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { ThreadDTO } from "../../../dtos/ThreadDTO";

const MenuExpandedIcons = (
	bookmarkStatus: boolean,
	archiveStatus: boolean,
	thread: ThreadDTO
) => {
	return thread.author.isUser
		? [
				<EditRoundedIcon sx={{ marginRight: 2 }} />,
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
				<DeleteOutlineRoundedIcon sx={{ marginRight: 2 }} />,
				<OutlinedFlagRoundedIcon sx={{ marginRight: 2 }} />,
		  ]
		: [
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
};

export default MenuExpandedIcons;
