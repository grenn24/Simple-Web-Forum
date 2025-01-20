import { Box} from "@mui/material";
import { useState } from "react";
import {
	Editor,
	EditorState,
} from "draft-js";
import EditorBar from "../../features/CreateThread/EditorBar";
import "./blockStyles.css";
import { RGBColor } from "react-color";
import blockStyleFn from "./blockStyleFn";
import customStyleFn from "./customStyleFn";

interface Prop {
	editorState: EditorState;
	setEditorState?: (state: EditorState) => void;
	editable?: boolean;
	showBorders?: boolean;
}

const RichTextField = ({
	editorState,
	setEditorState = () => {},
	editable = true,
	showBorders = true,
}: Prop) => {


	const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 0, a: 1 });

	return (
		<Box
			border={showBorders ? 1 : 0}
			borderRadius={1}
			px={editable ? 2 : 0}
			paddingBottom={editable ? 2 : 0}
			borderColor="rgb(180,180,180,1)"

		>
			<EditorBar
				setEditorState={setEditorState}
				editorState={editorState}
				color={color}
				setColor={setColor}
				style={{
					marginTop: 0.5,
					marginBottom: 1.5,
					display: editable ? "flex" : "none",
				}}
			/>

			<Editor
				readOnly={!editable}
				editorState={editorState}
				onChange={setEditorState}
				blockStyleFn={blockStyleFn}
				customStyleFn={customStyleFn}
				
			/>

		</Box>
	);
};

export default RichTextField;
