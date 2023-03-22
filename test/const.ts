interface IUser {
  email: string;
  password: string;
}
export async function initUser(pactum, userPayload: IUser) {
  // register user
  await registerUser(pactum, userPayload);
  // login user
  return await loginUser(pactum, userPayload);
}

export async function loginUser(pactum, userPayload: IUser) {
  // prevent concurrency problems when running test
  await pactum.sleep(1000);
  const credential_cookie = await pactum
    .spec()
    .post('/auth/login')
    .withBody(userPayload)
    .returns((ctx) => {
      return ctx.res.headers['set-cookie'];
    });

  return credential_cookie;
}

export async function registerUser(pactum, userPayload: IUser) {
  // prevent concurrency problems when running test
  await pactum.sleep(1000);
  await pactum.spec().post('/auth/register').withBody(userPayload);
}
