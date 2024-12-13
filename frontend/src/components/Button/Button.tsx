import ButtonBase from "@mui/material/Button";
import IconButtonBase from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";

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
	buttonStyle?: Object;
	handleButtonClick?: (event: React.MouseEvent<HTMLElement>) => void;
	allUppercaseText?: boolean;
	fontSize?: string | number;
	fontFamily?: string;
	fontWeight?: string | number;
	toolTipText?: string;
	iconOnly?: boolean;
	disabled?: boolean;
	disableRipple?: boolean;
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
	iconOnly = false,
	disabled = false,
	disableRipple = false,
}: Prop) => {
	return (
		<>
			{!iconOnly ? (
				<Tooltip title={toolTipText}>
					<ButtonBase
						component={component as React.ElementType}
						role={role}
						variant={variant}
						tabIndex={tabIndex}
						startIcon={buttonIcon}
						disabled={disabled}
						size={size}
						disableRipple={disableRipple}
						sx={{
							...buttonStyle,
							borderRadius: { borderRadius },
							border: { borderWeight },
							marginLeft: 1,
							marginRight: 1,
							color: color,
							textTransform: allUppercaseText ? "uppercase" : "none",
							fontSize: { fontSize },
							fontFamily: { fontFamily },
							fontWeight: { fontWeight },
							"& .MuiSvgIcon-root": {
								borderColor: borderColor,
							},

							backgroundColor: backgroundColor,
						}}
						onClick={handleButtonClick}
					>
						{children}
					</ButtonBase>
				</Tooltip>
			) : (
				<Tooltip title={toolTipText}>
					<IconButtonBase
						component={component as React.ElementType}
						role={role}
						variant={variant}
						tabIndex={tabIndex}
						disabled={disabled}
						disableRipple={disableRipple}
						sx={{
							...buttonStyle,
							borderRadius: { borderRadius },
							border: { borderWeight },
							marginLeft: 1,
							marginRight: 1,
							"& .MuiSvgIcon-root": {
								color: color,
								borderColor: borderColor,
							},
							fontSize: { fontSize },
						}}
						onClick={handleButtonClick}
					>
						{buttonIcon}
					</IconButtonBase>
				</Tooltip>
			)}
		</>
	);
};

export default Button;
