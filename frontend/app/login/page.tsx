'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterComponent() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter()

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", data.user.username);
        setForm({
          email: "",
          password: "",
        });
        console.log(router.push('/chats/666bcb7166540f92a983d788'))
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white px-5 py-5 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Login to your account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Dont have an account 
            <a href="" className="ml-2 underline text-gray-900 hover:underline">
              Sign up
            </a>
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="just@email.com"
                className="block w-full text-black appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full text-black appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"// This will make password dots black
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
