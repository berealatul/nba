import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AssessmentsPage } from "./pages/AssessmentsPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/dashboard" element={<AdminDashboard />} />
				<Route path="/assessments" element={<AssessmentsPage />} />
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
