export const initialStore = () => {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    auth: {
      token: token || null,
      user: user || null,
      isAuthenticated: !!token,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "login":
      const { token, user } = action.payload;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      return {
        ...store,
        auth: {
          token,
          user,
          isAuthenticated: true,
        },
      };

    case "logout":
    
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      return {
        ...store,
        auth: {
          token: null,
          user: null,
          isAuthenticated: false,
        },
      };
    default:
      throw Error("Unknown action.");
  }
}
