import { styled } from "@mui/material";
import { useEffect, useRef } from "react";

interface Prop {
	openCameraInput: boolean;
	setOpenCameraInput: (state: boolean) => void;
	onFileSubmit: (files: FileList) => void;
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

export default function CameraInput ({
	openCameraInput,
	setOpenCameraInput,
	onFileSubmit,
	acceptedFileTypes,
    multiple
}: Prop) {
	useEffect(() => {
		if (openCameraInput) {
			cameraInputRef.current?.click();
			setOpenCameraInput(false);
		}
	}, [openCameraInput]);
	const cameraInputRef = useRef<HTMLInputElement>(null);
	return (
		<Input
			type="file"
			ref={cameraInputRef}
			onChange={(event) => {
				event.target.files && onFileSubmit(event.target.files);
			}}
			accept={acceptedFileTypes + ";capture=camera"}
			capture="user"
			multiple={multiple}
		/>
	);
}
