interface Prop {
	path: string;
	fullScreenImage: boolean;
	setFullScreenImage: (state: boolean) => void;
}
const FullScreenImage = ({
	path,
	setFullScreenImage,
	fullScreenImage,
}: Prop) => {

	const handleClose = () => {
		setFullScreenImage(false);
	};

	return (
		<div>
			{/* Full-Screen Modal */}
			{fullScreenImage && (
				<div
					className="modal"
					onClick={handleClose}
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
						style={{ position: "relative", width: "80%", maxWidth: "800px" }}
					>
						<span
							className="close"
							onClick={handleClose}
							style={{
								position: "absolute",
								top: "10px",
								right: "10px",
								fontSize: "30px",
								color: "white",
								cursor: "pointer",
							}}
						>
							&times;
						</span>
						<img
							src={path}
							className="full-screen-image"
							style={{ width: "100%", height: "auto" }}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default FullScreenImage;
