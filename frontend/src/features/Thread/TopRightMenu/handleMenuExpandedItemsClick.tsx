import React from "react";
import { Delete, postJSON } from "../../../utilities/apiClient";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { useNavigate } from "react-router-dom";

const handleMenuExpandedItemsClick = (
	bookmarkStatus: boolean,
	setBookmarkStatus: (status: boolean) => void,
	archiveStatus: boolean,
	setArchiveStatus: (status: boolean) => void,
	isEditing: boolean,
	setIsEditing: (status: boolean) => void,
	thread: ThreadDTO,
	navigate: (x: any) => void
) => {
	return [
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation();
		setIsEditing(!isEditing);
	},
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation();
		setArchiveStatus(!archiveStatus);
		archiveStatus
			? Delete(
					`threads/${thread.threadID}/archives/user`,
					{},
					() => {},
					(err) => console.log(err)
			  )
			: postJSON(
					`threads/${thread.threadID}/archives/user`,
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
					`threads/${thread.threadID}/bookmarks/user`,
					{},
					() => {},
					(err) => console.log(err)
			  )
			: postJSON(
					`threads/${thread.threadID}/bookmarks/user`,
					{},
					() => {},
					(err) => console.log(err)
			  );
	},
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => {event.stopPropagation();
		navigate(-1);
		Delete(
			`threads/${thread.threadID}`,
			{},
			() => {},
			(err) => console.log(err)
		);
	},
	(event: React.MouseEvent<HTMLElement, MouseEvent>) => event.stopPropagation(),
];}

export default handleMenuExpandedItemsClick;
