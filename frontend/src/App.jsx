import { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, profilePicture: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const body = new FormData();

      if (formData.profilePicture) {
        body.append("profilePicture", formData.profilePicture);
      }

      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Registration failed" });
        return;
      }

      setMessage({ type: "success", text: data.message || "User registered successfully!" });
      setFormData({ name: "", email: "", password: "", profilePicture: null });
      setPreview("");
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Network error. Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="px-10 py-5 bg-white rounded-lg">
        {message.text && (
          <div
            className={`mb-4 px-4 py-2 rounded text-white text-sm ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No photo
              </div>
            )}
            <span className="text-sm text-blue-600 hover:underline">
              {formData.profilePicture ? "Change photo" : "Choose profile picture"}
            </span>
            <input
              type="file"
              name="profilePicture"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;