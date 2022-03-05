import { createContext } from "react";
import { IMessage, IUser } from "../interface/api.interface";

interface IAppContext {
	// state: string | null;
	getToken: () => string | null;
	signIn: (user: IUser) => Promise<void | IMessage>;
	signOut: () => void;
	signUp: (user: IUser) => Promise<boolean | IMessage>;
}

export const AppContext = createContext({} as IAppContext);
