import { Routes, Route } from "react-router";
import { SideBarLayout } from "./sideBar/Layout/SideBarLayout";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/home" element={<SideBarLayout />}>
        <Route path="usuarios" element={<div>usuarios</div>} />
      </Route>
    </Routes>
  )
}
