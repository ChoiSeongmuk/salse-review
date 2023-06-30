import { BrowserRouter, Routes, Route } from "react-router-dom";
import Review from "./pages/reveiw";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={"/"} element={<Review />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
