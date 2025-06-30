import { Home, UserRound, HandHelping, Search } from "lucide-react";

const tabs = [
  { label: "Dashboard", path: "/dashboard", icon: <Home /> },
  { label: "المستفيدون", path: "/dashboard/recipients", icon: <UserRound /> },
  { label: "المساعدات", path: "/dashboard/aids", icon: <HandHelping /> },
  { label: "بحث", path: "/dashboard/search", icon: <Search /> },
];

export default tabs;
