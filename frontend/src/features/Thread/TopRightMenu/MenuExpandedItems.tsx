import { ThreadDTO } from "../../../dtos/ThreadDTO";

const MenuExpandedItems = (thread: ThreadDTO, archiveStatus: boolean) => {
	return thread.author.isUser
		? [
				"Edit",
				archiveStatus ? "Unarchive" : "Archive",
				"Bookmark",
				"Delete",
				"Report",
		  ]
		: ["Archive", "Bookmark", "Report"];
};

export default MenuExpandedItems;
