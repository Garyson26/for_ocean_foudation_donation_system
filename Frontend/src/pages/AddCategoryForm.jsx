import React, { useState } from "react";
import { categoriesAPI } from "../utils/api";

function AddCategoryForm() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ok } = await categoriesAPI.create(form);

      if (ok) {
        setMessage("Category added successfully!");
        setForm({ name: "", description: "" });
      } else {
        setMessage("Failed to add category.");
      }
    } catch {
      setMessage("Error while adding category.");
    }
  };

  return (
    <div>
      <h2>Add New Category (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Category Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Add Category</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCategoryForm;
