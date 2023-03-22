interface IUser {
  email: string;
  password: string;
}
export async function initUser(pactum, userPayload: IUser) {
  // register user
  await pactum.spec().post('/auth/register').withBody(userPayload);
  // login user
  const at = await pactum
    .spec()
    .post('/auth/login')
    .withBody(userPayload)
    .returns((ctx) => {
      return ctx.res.headers['set-cookie'][0];
    });

  return { at: at };
}
