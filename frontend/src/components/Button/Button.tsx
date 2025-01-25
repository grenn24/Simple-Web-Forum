import {
	IconButton,
	Tooltip,
	Button as ButtonBase,
	CircularProgress,
	SxProps,
	Theme,
} from "@mui/material";

interface Prop {
	children?: React.ReactNode;
	role?: string;
	variant?: "text" | "contained" | "outlined";
	size?: "small" | "medium" | "large";
	component?: string;
	tabIndex?: number;
	buttonIcon?: JSX.Element;
	color?: string;
	backgroundColor?: string;
	borderRadius?: string | number;
	borderWeight?: string | number;
	borderColor?: string;
	buttonStyle?: SxProps<Theme>;
	handleButtonClick?: (event: React.MouseEvent<HTMLElement>) => void;
	allUppercaseText?: boolean;
	fontSize?: string | number;
	fontFamily?: string;
	fontWeight?: string | number;
	toolTipText?: string;
	disabled?: boolean;
	disableRipple?: boolean;
	disableHoverEffect?: boolean;
	iconPosition?: "start" | "end";
	type?: string;
	loadingStatus?: boolean;
	fullWidth?: boolean;
}
const Button = ({
	role = "undefined",
	variant,
	tabIndex = 0,
	buttonIcon,
	children,
	color,
	backgroundColor,
	buttonStyle,
	size,
	handleButtonClick,
	borderColor,
	borderRadius,
	borderWeight,
	component = "button",
	allUppercaseText = false,
	fontSize,
	fontFamily,
	fontWeight,
	toolTipText,
	disabled = false,
	disableRipple = false,
	iconPosition = "start",
	type,
	loadingStatus,
	fullWidth,
}: Prop) => {
	const buttonWithoutTooltipText = (
		<>
			{children ? (
				<>
					<ButtonBase
						type={type}
						component={component as React.ElementType}
						role={role}
						variant={variant}
						tabIndex={tabIndex}
						startIcon={iconPosition === "start" ? buttonIcon : undefined}
						endIcon={iconPosition === "end" ? buttonIcon : undefined}
						disabled={disabled || loadingStatus}
						size={size}
						disableRipple={disableRipple}
						fullWidth={fullWidth}
						sx={{
							...buttonStyle,
							borderRadius: { borderRadius },
							border: { borderWeight },
							color: color,
							textTransform: allUppercaseText ? "uppercase" : "none",
							fontSize: { fontSize },
							fontFamily: { fontFamily },
							fontWeight: { fontWeight },
							backgroundColor: backgroundColor,
							"& .MuiSvgIcon-root": {
								borderColor: borderColor,
							},
						}}
						onClick={handleButtonClick}
					>
						{children}
						{loadingStatus && (
							<CircularProgress
								size={24}
								sx={{
									color: "green",
									position: "absolute",
								}}
							/>
						)}
					</ButtonBase>
				</>
			) : (
				<IconButton
					type={type}
					component={component as React.ElementType}
					role={role}
					variant={variant}
					tabIndex={tabIndex}
					disabled={disabled || loadingStatus}
					disableRipple={disableRipple}
					sx={{
						...buttonStyle,
						borderRadius: { borderRadius },
						border: { borderWeight },
						"& .MuiSvgIcon-root": {
							color: color,
							borderColor: borderColor,
						},
						"&:hover": {
							backgroundColor: backgroundColor,
						},
						backgroundColor: backgroundColor,
						fontSize: { fontSize },
					}}
					onClick={handleButtonClick}
				>
					{buttonIcon}
					{loadingStatus && (
						<CircularProgress
							size={24}
							sx={{
								color: "green",
								position: "absolute",
							}}
						/>
					)}
				</IconButton>
			)}
		</>
	);

	return (
		<Tooltip
			title={toolTipText}
			placement="bottom"
			slotProps={{
				popper: {
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [0, 4],
							},
						},
					],
				},
			}}
		>
			<span>{buttonWithoutTooltipText}</span>
		</Tooltip>
	);
};

export default Button;
