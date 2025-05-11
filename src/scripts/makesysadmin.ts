import "dotenv/config";
import { addRole, setPassword } from "~/server/auth/utils";
import { db } from "~/server/db";

const makesysadmin = async () => {
  if (process.argv.length !== 5) {
    console.log("Usage:");
    console.log("    yarn makesysadmin <fullName> <email> <password>");
    console.log("Example:");
    console.log(
      '    yarn makesysadmin "John Doe" johndoe@example.com S!llyS3cr3tPassw0rd',
    );
    return;
  }
  const name = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];
  if (!name || !email || !password) {
    throw Error("Args cannot be undefined or empty strings");
  }
  await db.$transaction(async (trx) => {
    const user = await trx.user.create({
      data: { email, name },
    });
    await setPassword(trx, user.id, password);
    await addRole(trx, user.id, "admin", "system", "system");
  });
};

void makesysadmin();
