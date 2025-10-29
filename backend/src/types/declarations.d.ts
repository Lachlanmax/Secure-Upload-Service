declare module 'bcryptjs';
declare module 'jsonwebtoken';
declare module 'uuid';
declare module 'multer' {
  export interface Request {
    file?: any;
  }
}
