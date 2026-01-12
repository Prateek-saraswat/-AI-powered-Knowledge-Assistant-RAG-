/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  
  /**
   * Get logged-in user object
   */
  export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };
  
  /**
   * Get user role (admin / user)
   */
  export const getUserRole = () => {
    const user = getUser();
    return user?.role || null;
  };
  
  /**
   * Logout user
   */
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  