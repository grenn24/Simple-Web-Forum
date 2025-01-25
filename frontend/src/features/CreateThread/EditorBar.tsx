import * as React from "react";
import { styled, SxProps, Theme } from "@mui/material/styles";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
	toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { EditorState, RichUtils } from "draft-js";
import { ChromePicker, ColorResult, RGBColor } from "react-color";
import { Box } from "@mui/material";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		margin: theme.spacing(0.5),
		border: 0,
		borderRadius: theme.shape.borderRadius,
		[`&.${toggleButtonGroupClasses.disabled}`]: {
			border: 0,
		},
	},
	[`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
		{
			marginLeft: -1,
			borderLeft: "1px solid transparent",
		},
}));

interface Prop {
	setEditorState: (editorState: EditorState) => void;
	editorState: EditorState;
	color: RGBColor;
	setColor: (color: RGBColor) => void;
	style?: SxProps<Theme>;
}

export default function EditorBar({
	setEditorState,
	editorState,
	color,
	setColor,
	style,
}: Prop) {
	const [openColourPicker, setOpenColourPicker] = React.useState(false);
	const [alignment, setAlignment] = React.useState<String>("left");
	const [formats, setFormats] = React.useState<string[]>(["center"]);

	const handleFormat = (
		event: React.MouseEvent<HTMLElement>,
		newFormats: string[]
	) => {
		event.preventDefault();
		setFormats(newFormats);
	};

	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string
	) => {
		event.preventDefault();
		setAlignment(newAlignment);
	};

	const handleColorSelect = (color: ColorResult) => {
		setColor(color.rgb);
		const colorStyle = `rgbcolor-${color.rgb.r}-${color.rgb.g}-${color.rgb.b}-${color.rgb.a}`;
		const newEditorState = RichUtils.toggleInlineStyle(editorState, colorStyle);
		setEditorState(newEditorState);
	};

	React.useEffect(() => {
		const updatedFormats: string[] = [];
		// Get current inline style
		const currentInlineStyle = editorState.getCurrentInlineStyle();
		currentInlineStyle.forEach((styleName) => {
			if (styleName === "BOLD") updatedFormats.push("bold");
			if (styleName === "ITALIC") updatedFormats.push("italic");
			if (styleName === "UNDERLINE") updatedFormats.push("underlined");
		});
		setFormats(updatedFormats);
		// Get current block style
		const contentState = editorState.getCurrentContent();
		const selection = editorState.getSelection();
		const blockKey = selection.getStartKey();
		const block = contentState.getBlockForKey(blockKey);
		const blockType = block.getType();
		if (blockType === "left" || blockType === "unstyled") setAlignment("left");
		if (blockType === "center") setAlignment(blockType);
		if (blockType === "right") setAlignment(blockType);
		if (blockType === "justify") setAlignment(blockType);
	}, [editorState]);

	return (
		<div>
			<Paper
				elevation={0}
				sx={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					...style,
				}}
			>
				<StyledToggleButtonGroup
					size="small"
					value={alignment}
					exclusive
					onChange={handleAlignment}
				>
					<ToggleButton
						value="left"
						aria-label="left aligned"
						sx={{ px: 1.2 }}
						onClick={() =>
							setEditorState(RichUtils.toggleBlockType(editorState, "left"))
						}
					>
						<FormatAlignLeftIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
					<ToggleButton
						value="center"
						aria-label="centered"
						onClick={() =>
							setEditorState(RichUtils.toggleBlockType(editorState, "center"))
						}
						sx={{ px: 1.2 }}
					>
						<FormatAlignCenterIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
					<ToggleButton
						value="right"
						aria-label="right aligned"
						onClick={() =>
							setEditorState(RichUtils.toggleBlockType(editorState, "right"))
						}
						sx={{ px: 1.2 }}
					>
						<FormatAlignRightIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
					<ToggleButton
						value="justify"
						aria-label="justified"
						onClick={() =>
							setEditorState(RichUtils.toggleBlockType(editorState, "justify"))
						}
						sx={{ px: 1.2 }}
					>
						<FormatAlignJustifyIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
				</StyledToggleButtonGroup>
				<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
				<StyledToggleButtonGroup
					size="small"
					value={formats}
					onChange={handleFormat}
					aria-label="text formatting"
				>
					<ToggleButton
						value="bold"
						aria-label="bold"
						onClick={() =>
							setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
						}
						sx={{ px: 1.2 }}
					>
						<FormatBoldIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
					<ToggleButton
						value="italic"
						aria-label="italic"
						onClick={() =>
							setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
						}
						sx={{ px: 1.2 }}
					>
						<FormatItalicIcon sx={{ fontSize: 20 }} />
					</ToggleButton>
					<ToggleButton
						value="underlined"
						aria-label="underlined"
						onClick={() =>
							setEditorState(
								RichUtils.toggleInlineStyle(editorState, "UNDERLINE")
							)
						}
						sx={{ px: 1.2 }}
					>
						<FormatUnderlinedIcon sx={{ fontSize: 20 }} />
					</ToggleButton>

					<ToggleButton
						value="color"
						aria-label="color"
						disableTouchRipple
						onClick={() => setOpenColourPicker(!openColourPicker)}
						sx={{ px: 1.2 }}
					>
						<FormatColorFillIcon
							sx={{
								color: color
									? `rgb(${color.r},${color.g},${color.b},${color.a})`
									: "inherit",
								fontSize: 20,
							}}
						/>
						<ArrowDropDownIcon
							sx={{
								color: color
									? `rgb(${color.r},${color.g},${color.b},${color.a})`
									: "inherit",
								fontSize: 20,
							}}
						/>
						<Box
							display={openColourPicker ? "inherit" : "none"}
							position="absolute"
							right={0}
							top={50}
							zIndex={1}
							onClick={(e) => e.stopPropagation()}
						>
							<ChromePicker color={color} onChange={handleColorSelect} />
						</Box>
					</ToggleButton>
				</StyledToggleButtonGroup>
			</Paper>
		</div>
	);
}
