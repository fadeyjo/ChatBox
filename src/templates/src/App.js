import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IsNotAuthDashBoard from "./components/IsNotAuthDashBoard/IsNotAuthDashBoard";
import IsAuthDashBoard from "./components/IsAuthDashBoard/IsAuthDashBoard";
import SignUpPage from "./components/pages/SignUpPage/SignUpPage";
import SignInPage from "./components/pages/SignInPage/SignInPage";
import NotFoundPage from "./components/pages/NotFoundPage/NotFoundPage";
import AuthContext from "./context/index";
import ProfilePage, {profileLoader} from "./components/pages/ProfilePage/ProfilePage";


function App() {
  const [customer, setCustomer] = useState({});

  if (customer.email) {
    return (
      <AuthContext.Provider value={{
        customer,
        setCustomer
      }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IsAuthDashBoard />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    )
  }
  return (
    <AuthContext.Provider value={{
      customer,
      setCustomer
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IsNotAuthDashBoard/>} >
            <Route path="signup" element={<SignUpPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;