import React from "react";
import { Delete, postJSON } from "../../../utilities/api";
import { ThreadDTO } from "../../../dtos/ThreadDTO";

const handleMenuExpandedItemsClick = (
	bookmarkStatus: boolean,
	setBookmarkStatus: (status: boolean) => void,
	archiveStatus: boolean,
	setArchiveStatus: (status: boolean) => void,
	isEditing: boolean,
	setIsEditing: (status: boolean) => void,
	thread: ThreadDTO,
	setOpenDeleteThreadDialog: (status: boolean) => void
) =>
	thread.author.isUser
		? [
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
				(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
					event.stopPropagation();
					setOpenDeleteThreadDialog(true);
				},
				(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
					event.stopPropagation(),
		  ]
		: [
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
		  ];

export default handleMenuExpandedItemsClick;
