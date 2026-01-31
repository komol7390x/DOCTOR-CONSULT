import { compare, hash } from 'bcrypt';
export class Crypto {
  async encrypt(password: string): Promise<string> {
    return hash(password, 7);
  }

  async decrypt(oldPassword: string, newPassword: string): Promise<boolean> {
    return compare(oldPassword, newPassword);
  }
}
