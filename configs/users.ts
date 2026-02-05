type User = {
  email: string;
  password: string;
};

export function getUserByEnv(env: string): User {
  let user: User;

  switch (env) {
    case 'dev':
      user = {
        email: process.env.DEV_USER_EMAIL!,
        password: process.env.DEV_USER_PASSWORD!,
      };
      break;

    case 'qa':
      user = {
        email: process.env.QA_USER_EMAIL!,
        password: process.env.QA_USER_PASSWORD!,
      };
      break;

    case 'app':
      user = {
        email: process.env.APP_USER_EMAIL!,
        password: process.env.APP_USER_PASSWORD!,
      };
      break;

    default:
      throw new Error(`Environment not supported: ${env}`);
  }

  // 🔍 LOG SEGURO (sin password)
  console.log(`
------------------------------
 Test User Loaded
 ENV   : ${env}
 EMAIL : ${user.email}
------------------------------
`);

  return user;
}