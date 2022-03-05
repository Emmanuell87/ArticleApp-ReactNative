import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import jwtSecret from "../config/jwt.config";
import { connect } from "../database";

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: jwtSecret,
};

export default new Strategy(opts, async (payload, done) => {
	try {
		const connection = await connect();
		const [result] = await connection.query(
			"SELECT * FROM users WHERE id = ?",
			payload.id
		);
		const user = JSON.parse(JSON.stringify(result))[0];

		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	} catch (error) {
		console.log(error);
	}
});
