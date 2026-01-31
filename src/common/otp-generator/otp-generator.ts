import otp from 'otp-generator';

export const generatorOTP = (length = 6) => {
  return otp.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  }) as string;
};
