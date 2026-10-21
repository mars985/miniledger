export interface User {
  _id: string;
  username: string;
}

export async function findUserById(_id: string): Promise<User | null> {
  // TODO: look the user up in Postgres
  throw new Error("findUserById is not implemented yet");
}
