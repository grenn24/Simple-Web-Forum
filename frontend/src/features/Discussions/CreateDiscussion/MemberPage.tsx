import { useState } from "react";
import {
	DataGrid,
	GridActionsCellItem,
	GridColDef,
	GridRowId,
	GridRowSelectionModel,
	GridRowsProp,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import {
	Avatar,
	Box,
	InputAdornment,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	AddRounded as AddRoundedIcon,
	SearchRounded as SearchRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	SyncRounded as SyncRoundedIcon,
	RemoveCircleOutlineRounded as RemoveCircleOutlineRoundedIcon,
	RotateLeftRounded as RotateLeftRoundedIcon,
} from "@mui/icons-material";
import { get } from "../../../utilities/api";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthors } from "../../../utilities/parseApiResponse";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../utilities/redux";
import { arrayContains } from "../../../utilities/arrayManipulation";
import { changeSelectedAuthors } from "../createDiscussionSlice";

const MemberPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [searchBarValue, setSearchBarValue] = useState("");
	const [authors, setAuthors] = useState<AuthorDTO[]>([]);
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const { userAuthorID, selectedAuthors } = useAppSelector((state) => ({
		userAuthorID: state.userInfo.authorID,
		selectedAuthors: state.createDiscussion.selectedAuthors,
	}));
	const handleSearchAuthors = (query: string) => {
		if (query) {
			setIsLoading(true);
			get(
				`/authors/search?query=${query}`,
				(res) => {
					const responseBody = res.data.data;
					let authors = parseAuthors(responseBody);
					//Filter out authors who are already discussion member
					authors = authors.filter(
						(author) => author.authorID !== userAuthorID
					);
					setAuthors(authors);
					setRows(
						authors.map((author, index) => ({
							id: index,
							authorID: author.authorID,
							avatar: author.avatarIconLink,
							name: author.name,
							username: author.username,
						}))
					);
					setIsLoading(false);
				},
				(err) => console.log(err)
			);
		} else {
			setRows([]);
		}
	};

	const columns: GridColDef[] = [
		{
			field: "avatar",
			headerName: "Avatar",
			headerAlign: "center",
			width: 80,
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					height="100%"
				>
					<Avatar src={params.row.avatar} alt={params.row.name} />
				</Box>
			),
		},
		{ field: "name", headerName: "Name", width: 170 },
		{ field: "username", headerName: "Username", width: 170 },
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 90,
			align: "center",
			cellClassName: "actions",
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={
							<Tooltip title="Remove Member" placement="right">
								<RemoveCircleOutlineRoundedIcon />
							</Tooltip>
						}
						label="Remove"
						color="inherit"
						disabled={
							!arrayContains(
								selectedAuthors,
								authors[Number(id)],
								(x, y) => x.authorID === y.authorID
							)
						}
						onClick={() =>
							dispatch(
								changeSelectedAuthors(
									selectedAuthors.filter(
										(author) => author.authorID !== authors[Number(id)].authorID
									)
								)
							)
						}
					/>,
				];
			},
		},
	];

	const Toolbar = () => {
		return (
			<GridToolbarContainer>
				<Box>
					<Button
						buttonIcon={<RotateLeftRoundedIcon />}
						handleButtonClick={() => dispatch(changeSelectedAuthors([]))}
						disabled={selectedAuthors.length === 0}
					>
						Reset
					</Button>
					<Button
						buttonIcon={<SyncRoundedIcon />}
						handleButtonClick={() => handleSearchAuthors(searchBarValue)}
					>
						Refresh
					</Button>
				</Box>
			</GridToolbarContainer>
		);
	};

	const Footer = () => (
		<Box sx={{ px: 2, py: 1, display: "flex" }}>
			<Typography fontSize={17} fontWeight={600} textAlign="right" width="100%">
				{selectedAuthors.length} Members Added
			</Typography>
		</Box>
	);

	return (
		<Box>
			<TextField
				fullWidth
				style={{ marginBottom: 20 }}
				value={searchBarValue}
				type="search"
				size="small"
				placeholder="Search for authors"
				onChange={(e) => {
					setSearchBarValue(e.target.value);
					handleSearchAuthors(e.target.value);
				}}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<SearchRoundedIcon sx={{ color: "primary.dark" }} />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment
								position="start"
								onClick={() => {
									setSearchBarValue("");
									handleSearchAuthors("");
								}}
								sx={{
									"&:hover": { cursor: "pointer" },
									display: searchBarValue ? "inherit" : "none",
								}}
							>
								<CloseRoundedIcon sx={{ color: "primary.dark" }} />
							</InputAdornment>
						),
					},
				}}
				sx={{
					"& input::-webkit-search-cancel-button": {
						display: "none",
					},
				}}
			/>

			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				slotProps={{
					loadingOverlay: {
						variant: "skeleton",
						noRowsVariant: "skeleton",
					},
				}}
				pageSizeOptions={[10, 25]}
				slots={{ toolbar: Toolbar, footer: Footer }}
				localeText={{
					noRowsLabel: "No authors found",
				}}
				onRowDoubleClick={(rowInfo) =>
					navigate(`/Profile/${rowInfo.row.authorID}`)
				}
				onRowSelectionModelChange={(newSelection) => {
					// Add selected authors to state variable
					newSelection.forEach((id) => {
						if (
							!arrayContains(
								selectedAuthors,
								authors[Number(id)],
								(x, y) => x.authorID === y.authorID
							)
						) {
							dispatch(
								changeSelectedAuthors([...selectedAuthors, authors[Number(id)]])
							);
						}
					});
				}}
				onRowClick={(rowInfo) => {
					if (
						arrayContains(
							selectedAuthors,
							rowInfo.row.authorID,
							(x, y) => x.authorID === y
						)
					) {
						dispatch(
							changeSelectedAuthors(
								selectedAuthors.filter(
									(author) => author.authorID !== rowInfo.row.authorID
								)
							)
						);
					}
				}}
				rowSelectionModel={authors
					.map((_, index) => index)
					.filter((index) =>
						arrayContains(
							selectedAuthors,
							index,
							(selectedAuthor: AuthorDTO, index: number) =>
								selectedAuthor?.authorID === authors[index]?.authorID
						)
					)}
				loading={isLoading}
			></DataGrid>
		</Box>
	);
};

export default MemberPage;
