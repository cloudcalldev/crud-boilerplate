export interface IJwtData {
  userId: number;
  username: string;
}

declare namespace Express {
  export interface Request {
    jwt: IJwtData;
    jwtToken: string;
  }
}
