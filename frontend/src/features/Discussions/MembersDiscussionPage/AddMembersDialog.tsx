import { useEffect, useState } from "react";
import SimpleDialog from "../../../components/SimpleDialog";
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
import { get, postJSON } from "../../../utilities/api";
import { AuthorDTO } from "../../../dtos/AuthorDTO";
import { parseAuthors } from "../../../utilities/parseApiResponse";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { arrayContains } from "../../../utilities/arrayManipulation";

interface Prop {
	openAddMembersDialog: boolean;
	setOpenAddMembersDialog: (value: boolean) => void;
}
const AddMembersDialog = ({
	openAddMembersDialog,
	setOpenAddMembersDialog,
}: Prop) => {
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [searchBarValue, setSearchBarValue] = useState("");
	const [authors, setAuthors] = useState<AuthorDTO[]>([]);
	const [members, setMembers] = useState<AuthorDTO[]>([]);
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
	const navigate = useNavigate();
	const { discussionID } = useParams();
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
						(author) =>
							!arrayContains(
								members,
								author,
								(m: AuthorDTO, a: AuthorDTO) => m.authorID === a.authorID
							)
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
		const authorID = authors[Number(id.valueOf())].authorID;
		setRows(rows.filter((row) => row.id !== id));
		postJSON(
			`/discussions/${discussionID}/members`,
			{ author_id: authorID },
			() => handleRetrieveMembers(),
			(err) => console.log(err)
		);
	};

	const handleAddAuthorsToDiscussion = () =>
		selectedRows.forEach((id) => {
			handleAddAuthorToDiscussion(id)();
		});

	const handleRetrieveMembers = () => {
		setIsLoading(true);
		get(
			`discussions/${discussionID}/members`,
			(res) => {
				const responseBody = res.data.data;
				setMembers(parseAuthors(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
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

	useEffect(() => {
		handleRetrieveMembers();
	}, []);

	return (
		<SimpleDialog
			openDialog={openAddMembersDialog}
			setOpenDialog={setOpenAddMembersDialog}
			title="Add Members"
			fullWidth
			maxWidth="md"
			backdropBlur={5}
		>
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
		</SimpleDialog>
	);
};

export default AddMembersDialog;
