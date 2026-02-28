export const redirectToGoogle = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/google`;
};
