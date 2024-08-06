import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IsNotAuthDashBoard from "./components/IsNotAuthDashBoard/IsNotAuthDashBoard";
import SignUpPage from "./components/pages/SignUpPage/SignUpPage";
import SignInPage from "./components/pages/SignInPage/SignInPage";
import NotFoundPage from "./components/pages/NotFoundPage/NotFoundPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  if (isAuth) {
    return (
      <div>
        isAuth
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IsNotAuthDashBoard/>} >
          <Route path="signup" element={<SignUpPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
