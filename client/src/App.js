import logo from './logo.svg';
import Navbar from './components/Navbar';
import dashboard from './pages/dashboard';
import calendars from './pages/calendars';
import reports from './pages/reports';
import { 
  BrowserRouter as Router,
  Routes,
  Route
 } from "react-router"

function App() {
  return (
    // <Router>
    //   {/* <nav/> */}
    //   <div className='mainContainer'>
    //     <Routes>
    //       <Route path="/dashboard" element={<dashboard/>} />
    //       <Route path="/calendars" element={<calendars/>} />
    //       <Route path="/reports" element={<reports/>} />
    //     </Routes>  
    //   </div> 
    // </Router>
    <>
    <Navbar />
    <div className='min-h-screen w-full relative bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 flex items-center justify-center text-center flex-col gap-10 text-white p-52'>
      <h1 className='text-7xl'>Section 1</h1>
      <p className='text-3xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    
    <div className='min-h-screen w-full relative bg-fuchsia-500 flex items-center justify-center text-center flex-col gap-10 text-white p-52'>
      <h1 className='text-7xl'>Section 2</h1>
      <p className='text-3xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    
    <div className='min-h-screen w-full relative bg-blue-300 flex items-center justify-center text-center flex-col gap-10 text-white p-52'>
      <h1 className='text-7xl'>Section 3</h1>
      <p className='text-3xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
