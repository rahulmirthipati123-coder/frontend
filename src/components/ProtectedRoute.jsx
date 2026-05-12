const ProtectedRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {
    return <h1>Access Denied</h1>;
  }

  return children;
};

export default ProtectedRoute;