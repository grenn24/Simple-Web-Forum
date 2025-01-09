export interface AuthorDTO {
	authorID: number;
	email: string;
	name: string;
	username: string;
	avatarIconLink: string;
	createdAt: Date;
	isUser: boolean;
	followStatus: boolean
	faculty: string;
	birthday: Date;
	biography: string;
	followerCount: number
}
