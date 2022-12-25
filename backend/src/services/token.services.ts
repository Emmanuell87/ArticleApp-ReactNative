import jwt from 'jsonwebtoken';
import { connect } from '../database';
import { IUser } from '../interface/Users.interface';
import jwtSecret from '../config/jwt.config';

export const encode = (user: IUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    jwtSecret
  );
};

export const decode = async (token: string): Promise<IUser | false> => {
  try {
    const userDecode = jwt.verify(token, jwtSecret) as IUser;

    if (userDecode) {
      const connection = connect();

      const user = await connection
        .execute('SELECT * FROM users WHERE id = ?', [userDecode.id])
        .then(([result]): IUser => JSON.parse(JSON.stringify(result))[0]);

      if (user) {
        return user;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
