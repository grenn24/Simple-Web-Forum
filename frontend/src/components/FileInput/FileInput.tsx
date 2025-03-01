import { styled } from "@mui/material";
import { useEffect, useRef } from "react";

interface Prop {
	openFileInput: boolean;
	setOpenFileInput: (state: boolean) => void;
	onFileSubmit: (files : FileList) => void;
	acceptedFileTypes: string;
	multiple?: boolean
}
const Input = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function FileInput ({
	openFileInput,
	setOpenFileInput,
	onFileSubmit,
	acceptedFileTypes,
	multiple
}: Prop) {
	useEffect(() => {
		if (openFileInput) {
			fileInputRef.current?.click();
			setOpenFileInput(false);
		}
	}, [openFileInput]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	return (
		<Input
			type="file"
			ref={fileInputRef}
			onChange={(event) => {
				event.target.files && onFileSubmit(event.target.files);
			}}
			accept={acceptedFileTypes}
			multiple={multiple}
		/>
	);
}
