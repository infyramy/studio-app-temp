export default defineEventHandler(async (event) => {
  // Clear the refresh token cookie
  setCookie(event, 'refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/'
  });

  return {
    statusCode: 200,
    status: 'success',
    message: 'Logged out successfully'
  };
}); 