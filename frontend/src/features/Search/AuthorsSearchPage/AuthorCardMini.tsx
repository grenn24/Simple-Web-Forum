
import { AuthorDTO } from '../../../dtos/AuthorDTO'
import { Avatar, Box, Typography } from '@mui/material'

interface Prop {
    author: AuthorDTO
}
const AuthorCardMini = ({author}:Prop) => {
  return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box display="flex" alignItems="center">
				<Avatar src={author.avatarIconLink} />
				<Box display="flex" flexDirection="column" marginLeft={2}>
					<Typography fontSize={18} fontWeight={730}>
						@{author.username}
					</Typography>
					<Typography fontSize={15} fontWeight={530}>
						{author.name}
					</Typography>
				</Box>
			</Box>
			<Typography fontFamily="Open Sans" fontSize={17} display={author.faculty ? "inherit" : "none"}>Faculty of {author.faculty}</Typography>
		</Box>
	);
}

export default AuthorCardMini