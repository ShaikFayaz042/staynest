import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      <HomePage></HomePage>
      <ListingPage></ListingPage>
      <SignupPage></SignupPage>
      <LoginPage></LoginPage>
    </div>
  );
}
