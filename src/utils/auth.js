export const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    }),
  );
  const signature = btoa(`${header}.${payload}.secret_key`);
  return `${header}.${payload}.${signature}`;
};

export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const findUser = (username) => {
  return getUsers().find((u) => u.username === username) || null;
};
