import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f3f4f6",
            minHeight: "100vh",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;