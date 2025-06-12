import { Home, UserRound, HandHelping } from "lucide-react";

const tabs = [
  { label: "Dashboard", path: "/dashboard", icon: <Home /> },
  { label: "المستفيدون", path: "/dashboard/recipients", icon: <UserRound /> },
  { label: "المساعدات", path: "/dashboard/aids", icon: <HandHelping /> },
];

export default tabs;
