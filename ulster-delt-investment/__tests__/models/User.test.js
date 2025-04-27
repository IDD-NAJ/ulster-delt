const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  };

  it('should create a new user', async () => {
    const user = new User(userData);
    await user.save();

    expect(user.email).toBe(userData.email);
    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.role).toBe('user');
    expect(user.isEmailVerified).toBe(false);
    expect(user.twoFactorEnabled).toBe(false);
  });

  it('should hash password before saving', async () => {
    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
    const isMatch = await bcrypt.compare(userData.password, user.password);
    expect(isMatch).toBe(true);
  });

  it('should not hash password if not modified', async () => {
    const user = new User(userData);
    await user.save();
    const originalPassword = user.password;

    user.firstName = 'Jane';
    await user.save();

    expect(user.password).toBe(originalPassword);
  });

  it('should validate email format', async () => {
    const user = new User({
      ...userData,
      email: 'invalid-email'
    });

    await expect(user.save()).rejects.toThrow();
  });

  it('should validate password length', async () => {
    const user = new User({
      ...userData,
      password: 'short'
    });

    await expect(user.save()).rejects.toThrow();
  });

  it('should validate required fields', async () => {
    const user = new User({});

    await expect(user.save()).rejects.toThrow();
  });

  it('should compare password correctly', async () => {
    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
}); 