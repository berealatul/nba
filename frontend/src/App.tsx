import { useState } from "react";
import "./App.css";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	return (
		<>
			{!isLoggedIn ? (
				<LoginPage onLogin={handleLogin} />
			) : (
				<AdminDashboard onLogout={handleLogout} />
			)}
		</>
	);
}

export default App;
