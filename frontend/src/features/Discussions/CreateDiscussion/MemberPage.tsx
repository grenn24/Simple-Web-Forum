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
import { Avatar, Box, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
	AddRounded as AddRoundedIcon,
	SearchRounded as SearchRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	SyncRounded as SyncRoundedIcon,
} from "@mui/icons-material";
import { get } from "../../../utilities/api";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthors } from "../../../utilities/parseApiResponse";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAppSelector } from "../../../utilities/redux";


const MemberPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [searchBarValue, setSearchBarValue] = useState("");
	const [authors, setAuthors] = useState<AuthorDTO[]>([]);
	const [members, setMembers] = useState<AuthorDTO[]>([]);
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
	const navigate = useNavigate();
	const { userAuthorID } = useAppSelector((state) => ({
		userAuthorID: state.userInfo.authorID,
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

	const handleAddAuthorToDiscussion = (id: GridRowId) => () => {
		const author = authors[Number(id.valueOf())];
		setMembers([...members, author]);
	};

	const handleAddAuthorsToDiscussion = () =>
		selectedRows.forEach((id) => {
			handleAddAuthorToDiscussion(id)();
		});

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
							<Tooltip title="Add to Discussion" placement="right">
								<AddRoundedIcon />
							</Tooltip>
						}
						label="Remove"
						onClick={handleAddAuthorToDiscussion(id)}
						color="inherit"
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
						buttonIcon={<AddRoundedIcon />}
						handleButtonClick={handleAddAuthorsToDiscussion}
						disabled={selectedRows.length === 0}
					>
						Add
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

	return (
		<Box>
			<TextField
				fullWidth
				style={{ marginBottom: 20 }}
				value={searchBarValue}
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
				slots={{ toolbar: Toolbar }}
				checkboxSelection
				localeText={{
					noRowsLabel: "No authors found",
				}}
				onRowDoubleClick={(rowInfo) =>
					navigate(`/Profile/${rowInfo.row.authorID}`)
				}
				onRowSelectionModelChange={(newSelection) => {
					setSelectedRows(newSelection);
				}}
				loading={isLoading}
			></DataGrid>
		</Box>
	);
};

export default MemberPage;
