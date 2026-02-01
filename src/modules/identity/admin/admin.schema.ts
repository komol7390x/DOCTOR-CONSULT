export const createAdminSchema = {
  body: {
    type: 'object',
    required: ['username', 'password', 'phoneNumber'],
    properties: {
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 6 },
      phoneNumber: { type: 'string' },
      fullname: { type: 'string' }
    }
  }
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  }
};
