const API_BASE_URL = "http://localhost/nba/api";

export interface LoginCredentials {
	employeeIdOrEmail: string;
	password: string;
}

export interface User {
	employee_id: number;
	username: string;
	email: string;
	role: string;
	department_id: number | null;
	department_name?: string;
	department_code?: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		token: string;
		user: User;
	};
}

export interface ApiError {
	success: false;
	message: string;
	error?: string;
	errors?: string[];
}

class ApiService {
	private token: string | null = null;

	constructor() {
		// Load token from localStorage on initialization
		this.token = localStorage.getItem("auth_token");
	}

	setToken(token: string) {
		this.token = token;
		localStorage.setItem("auth_token", token);
	}

	clearToken() {
		this.token = null;
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user");
	}

	getToken(): string | null {
		return this.token;
	}

	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Login failed");
		}

		if (data.success) {
			this.setToken(data.data.token);
			localStorage.setItem("user", JSON.stringify(data.data.user));
		}

		return data;
	}

	async logout(): Promise<void> {
		if (this.token) {
			try {
				await fetch(`${API_BASE_URL}/logout`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				});
			} catch (error) {
				console.error("Logout error:", error);
			}
		}
		this.clearToken();
	}

	async getProfile(): Promise<User> {
		const response = await fetch(`${API_BASE_URL}/profile`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Failed to fetch profile");
		}

		return data.data;
	}

	getStoredUser(): User | null {
		const userStr = localStorage.getItem("user");
		if (userStr) {
			return JSON.parse(userStr);
		}
		return null;
	}
}

export const apiService = new ApiService();
