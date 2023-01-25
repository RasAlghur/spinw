import Spinner from "./components/wheel/Spinner";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Explore from "./components/dashboard/Explore";
import NavMenu from "./components/navbar/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Admin from "./components/Admin";
import Protected from "./components/Auth/Protected";
import Notfound from "./Notfound";
import Refer from "./components/refer";
import ReferBonus from "./components/refer/refer";
import AdminRefer from "./components/Admin/refers";
import Short from "./components/short";

export default function App() {
  return (
    <BrowserRouter>
      <NavMenu />
      <div className='container'>
        <div className='appWrapper'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/play' element={<Spinner />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<Notfound />} />
            <Route element={<Protected />}>
              <Route path='/admin' element={<Admin />} />
              <Route path='/admin/refer' element={<AdminRefer />} />
            </Route>
            {/* <Route path='/refer' element={<Refer />} />
            <Route path='/refer/:wallet' element={<ReferBonus />} />
            <Route path='/:id' element={<Short />} /> */}
          </Routes>
        </div>
      </div>
      <Footer />
    </BrowserRouter>
  )
}