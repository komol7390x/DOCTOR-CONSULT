import { IResponse } from 'common/type/success-res.type';

export const successRes = (data: any, statusCode: number = 200): IResponse => {
  return {
    statusCode,
    status: true,
    message: 'success',
    data
  };
};
