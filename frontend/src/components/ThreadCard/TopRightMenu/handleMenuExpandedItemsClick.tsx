import React from "react";
import { Delete, postJSON } from "../../../utilities/api";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { NavigateOptions, To } from "react-router-dom";

const handleMenuExpandedItemsClick = (
	bookmarkStatus: boolean,
	setBookmarkStatus: (status: boolean) => void,
	archiveStatus: boolean,
	setArchiveStatus: (status: boolean) => void,
	thread: ThreadDTO,
	navigate: (to: To, options?: NavigateOptions) => void | Promise<void>,
	setOpenDeleteThreadDialog: (status: boolean) => void
) =>
	thread.author.isUser
		? [
				(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
					event.stopPropagation();
					// Pass in a isEditing boolean value during navigation
					navigate(`../Thread/${thread.threadID}`, {
						state: { isEditing: true },
					});
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
				(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
					event.stopPropagation();
					Delete(
						`threads/${thread.threadID}`,
						{},
						() => {},
						(err) => console.log(err)
					);
				},
		  ];

export default handleMenuExpandedItemsClick;
