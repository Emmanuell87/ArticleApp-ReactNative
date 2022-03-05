export interface IArticle {
	id?: number;
	name: string;
	description?: string;
	quantity: number;
	business_id?: number;
	public_id?: string;
	image_url?: string;
}

export interface IUser {
	username?: string;
	email: string;
	password?: string;
}

export interface IBusiness {
	id?: number;
	name: string;
	owner_id?: number;
}

export interface IMessage {
	status?: number;
	message: string;
}
