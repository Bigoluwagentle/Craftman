import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home";
import Browsecraftsmen from "./pages/browsecraftsmen";
import Publicprofile from "./pages/publicprofile";
import Userdashboard from "./pages/userdashboard";
import Unlockedcontact from "./pages/unlockedcontact";
import Subcription from "./pages/subscription";
import Review from "./pages/review";
import Profiledetails from "./pages/profiledetails";
import Admindashboard from "./pages/admindashboard";
import Registernow from "./pages/registernow";
import Login from "./pages/login";
import Browsecraft from "./pages/browsecraft";
import EmailVerification from "./pages/emailverification";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/> 
        <Route path="/Browsecraftsmen" element={<Browsecraftsmen/>}/>
        <Route path="/Registernow" element={<Registernow/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Publicprofile" element={<Publicprofile/>}/>
        <Route path="/Userdashboard" element={<Userdashboard/>}/>
        <Route path="/Unlockedcontact" element={<Unlockedcontact/>}/>
        <Route path="/Subcription" element={<Subcription/>}/>
        <Route path="/Review" element={<Review/>}/>
        <Route path="/Browsecraft" element={<Browsecraft/>}/>
        <Route path="/Profiledetails" element={<Profiledetails/>}/>
        <Route path="/Admindashboard" element={<Admindashboard/>}/>
        <Route path="/Emailverification" element={<EmailVerification/>}/>
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
