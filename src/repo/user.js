import db from "../db/knex/knex.js";
import logger from "../logger/index.js";

export async function insertUser({ id, email, name, picture, password, updatedAt }) {
  logger.info(`Inserting/updating user ${id}, ${email}, ${name}, ${picture}, ${password}, ${updatedAt} into DB`);

  await db.transaction(async (trx) => {
    await trx("cred").insert({ email, ...(password && { password }) }).onConflict("email").ignore();

    await trx("user")
      .insert({ ...(id && { id }), email, name, ...(picture && { picture }), ...(updatedAt && { updatedAt }) })
      .onConflict()
      .ignore();
  });
}

export async function getUserInfoByEmail(email) {
  logger.info(`Fetching user by email: ${email}`);
  const user = await db("user").where({ email }).first();
  logger.info(`User fetched for email ${email}: ${JSON.stringify(user)}`);
  return user;
}

export async function checkEmailPassword(email, password) {
  logger.info(`Checking email and password for ${email}`);

  const cred = await db("cred").where({ email }).first();

  if (!cred) {
    return { valid: false, message: "Email not found" };
  }

  const isPasswordValid = password === cred.password;

  return {
    valid: isPasswordValid,
    message: isPasswordValid ? "Credentials valid" : "Invalid password",
  };
}

export async function updatePassword(email, newPassword) {
  logger.info(`Updating password for ${email}`);
  await db("cred").where({ email }).update({ password: newPassword });
}
