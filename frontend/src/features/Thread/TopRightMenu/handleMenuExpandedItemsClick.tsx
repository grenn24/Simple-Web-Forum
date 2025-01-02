import React from "react";
import { Delete, postJSON } from "../../../utilities/apiClient";

const handleMenuExpandedItemsClick = (
	bookmarkStatus: boolean,
	setBookmarkStatus: (status: boolean) => void,
	archiveStatus: boolean,
	setArchiveStatus: (status: boolean) => void,
	threadID: number
) => [
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation();
		setArchiveStatus(!archiveStatus);
		archiveStatus
			? Delete(
					`threads/${threadID}/archives/user`,
					{},
					() => {},
					(err) => console.log(err)
			  )
			: postJSON(
					`threads/${threadID}/archives/user`,
					{},
					() => {},
					(err) => console.log(err)
			  );
	},
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation();
		setBookmarkStatus(!bookmarkStatus);
		bookmarkStatus
			? Delete(
					`threads/${threadID}/bookmarks/user`,
					{},
					() => {},
					(err) => console.log(err)
			  )
			: postJSON(
					`threads/${threadID}/bookmarks/user`,
					{},
					() => {},
					(err) => console.log(err)
			  );
	},
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => event.stopPropagation(),
];

export default handleMenuExpandedItemsClick;
