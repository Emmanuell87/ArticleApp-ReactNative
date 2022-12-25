import { Handler } from 'express';
import { connect, QueryError } from '../database';
import jwt from 'jsonwebtoken';
import jwtSecret from '../config/jwt.config';
import bcrypt from 'bcrypt';
import { IUser } from '../interface/Users.interface';
import { decode } from '../services/token.services';

const createToken = (user: IUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    jwtSecret
  );
};

const createBcryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (
  password: string,
  bcryptPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, bcryptPassword);
};

export const signUp: Handler = async (req, res) => {
  const user: IUser = req.body;
  if (!user.email || !user.password || !user.username) {
    return res.status(400).json({
      message: 'Please submit all fields',
    });
  } else if (false) {
  } else {
    user.password = await createBcryptPassword(user.password);
    const connection = connect();
    connection
      .execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [user.username, user.email, user.password]
      )
      .then(() => {
        res.status(201).json({
          message: 'User created',
        });
      })
      .catch((error: QueryError) => {
        if (error.errno == 1062) {
          if (error.message.includes("'users.email'")) {
            res.status(409).json({
              message: 'El email ya está en uso',
              fieldError: 'email',
              error,
            });
          } else if (error.message.includes("'users.username'")) {
            res.status(409).json({
              message: 'El username ya existe',
              fieldError: 'username',
              error,
            });
          }
        } else {
          res.status(500).json({
            message: 'An error occurred',
            error,
          });
        }
      });
  }
};

export const signIn: Handler = async (req, res) => {
  const data: IUser = req.body;
  if (!data.email || !data.password) {
    res.status(400).json({
      message: 'Please. Send your email and password',
    });
  } else {
    console.log(data.email);
    const connection = connect();
    connection
      .execute('Select * FROM users WHERE email = ?', [data.email])
      .then(async ([result]) => {
        const user: IUser = JSON.parse(JSON.stringify(result))[0];

        if (user) {
          const isMatch = await comparePassword(data.password, user.password);

          if (isMatch) {
            return res.status(200).json({ token: createToken(user) });
          } else {
            res.status(401).send({
              message: 'Password invalid',
            });
          }
        } else {
          res.status(404).json({
            message: 'El correo no existe',
          });
        }
      })
      .catch((error: QueryError) => {
        console.log(error);
        res.status(500).json({
          message: 'An error occurred',
          error,
        });
      });
  }
};

export const listUsers: Handler = async (req, res) => {
  const user = (await decode(req.headers.token as string)) as IUser;

  const connection = connect();

  connection
    .execute(
      'SELECT users.id, users.username, users.email FROM users ' +
        'WHERE users.id != ?',
      [user.id]
    )
    .then(([rows]) => res.status(200).json(rows))
    .catch((error: QueryError) =>
      res.status(500).json({
        message: 'An error occurred',
        error,
      })
    );
};
