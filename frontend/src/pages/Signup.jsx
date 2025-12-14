import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import { isLoggedIn } from "../services/auth";

export default function Signup() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");


	React.useEffect(()=>{ if(isLoggedIn()) navigate('/profile') },[navigate]);

	function onSubmit(e) {
		e.preventDefault();
		if (password !== confirm) {
			alert("Passwords do not match");
			return;
		}
		api
			.post("/signup", { email, password, fullName: name })
			.then(() => {
				alert("Account created — please sign in");
				navigate("/login");
			})
			.catch((err) => alert(err.message || "Signup failed"));
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-6xl">
				{/* Left panel */}
				<div className="hidden md:flex items-center justify-center">
					<div className="w-96 h-96 bg-linear-to-tr from-green-400 to-cyan-500 rounded-3xl shadow-xl flex items-center justify-center">
						<div className="text-white text-center p-6">
							<h2 className="text-3xl font-bold tracking-tight">Create account</h2>
							<p className="mt-2 text-slate-100">Join and start building with our templates — fast, secure and modern.</p>
						</div>
					</div>
				</div>

				{/* Form card */}
				<div className="auth-card">
					<div className="mb-6 text-center">
						<h1 className="text-2xl font-semibold">Create your account</h1>
						<p className="mt-1 text-sm text-slate-600">Just a few details and you're ready to go</p>
					</div>

					<form onSubmit={onSubmit} className="grid gap-4">
						<label className="block">
							<span className="text-sm font-medium text-slate-700">Full name</span>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
								placeholder="John Doe"
							/>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-slate-700">Email</span>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
								placeholder="you@example.com"
							/>
						</label>

						<div className="grid md:grid-cols-2 gap-4">
							<label className="block">
								<span className="text-sm font-medium text-slate-700">Password</span>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
									placeholder="Create a password"
								/>
							</label>

							<label className="block">
								<span className="text-sm font-medium text-slate-700">Confirm</span>
								<input
									type="password"
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									required
									className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
									placeholder="Repeat password"
								/>
							</label>
						</div>

						<div>
							<button type="submit" className="w-full px-4 py-2 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
								Create account
							</button>
						</div>
					</form>

					<div className="mt-6 text-center text-sm text-slate-600">
						Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Sign in</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

