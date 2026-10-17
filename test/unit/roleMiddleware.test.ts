import { authorize } from '../../src/middlewares/role.middleware';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../src/middlewares/auth.middleware';

describe('Unit: authorize middleware (AAA pattern)', () => {
  it('returns 401 when req.user is missing', () => {
    // Arrange
    const middleware = authorize('ADMIN');
    const req = {} as AuthRequest;
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user role is not authorized', () => {
    // Arrange
    const middleware = authorize('ADMIN');
    const req = {
      user: { role: 'VOTER' },
    } as unknown as AuthRequest;
    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnValue({ json: jsonMock }),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    // Act
    middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when user role matches authorized roles', () => {
    // Arrange
    const middleware = authorize('ADMIN', 'EC');
    const req = {
      user: { role: 'ADMIN' },
    } as unknown as AuthRequest;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    // Act
    middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledTimes(1);
  });
});
