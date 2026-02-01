export interface IToken {
  id?: number;
  isActive?: boolean | null;
  role?: string;
  iat?: string;
  exp?: string;
}
