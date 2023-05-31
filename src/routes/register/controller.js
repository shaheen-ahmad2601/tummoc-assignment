import { createToken } from "../../utility/encryption.js";

export default function (database) {
  return async (req, res) => {
    const { usersModel } = database;

    try {
      const existing = await usersModel
        .findOne({ email: req.body.email })
        .lean()
        .exec();

      if (existing) {
        return res.status(400).send({ message: "User is already registered" });
      }

      const rawUser = await usersModel.create(req.body);
      const user = fixJson(rawUser);

      const token = createToken(user);

      res.status(200).json({
        user,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    }
  };
}

const fixJson = (object) => JSON.parse(JSON.stringify(object));
