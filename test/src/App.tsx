import "./App.css";
// import users from './components/data'
import UserTable from "./components/UserTable";
import LoginForm from "./components/form/LoginForm";
import RegisterForm from "./components/form/RegisterForm";



function App() {
  return (
    <>
      {/* <LoginForm />
      <hr />
      <RegisterForm /> */}
      <UserTable  />
    </>
  );
}

export default App;
