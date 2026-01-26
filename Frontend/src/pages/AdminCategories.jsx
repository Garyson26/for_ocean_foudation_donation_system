import React, { useState, useEffect } from "react";
import { validateCategory } from "../utils/validateForm";
import { categoriesAPI } from "../utils/api";
import AddCategoryForm from "../components/AddCategoryForm";
import CategoriesList from "../components/CategoriesList";
import Toast from "../components/Toast";
import { useToast } from "../utils/useToast";

function AdminCategories() {
  const { toasts, showToast, hideToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    donationAmount: "",
    sortDescription: "",
    descriptions: [""] // Array for multiple descriptions
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(response => {
        if (response.ok) {
          setCategories(response.data);
        }
      });
  }, []);

  const handleAdd = e => {
    e.preventDefault();
    const validationError = validateCategory(form);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    categoriesAPI.create(form)
      .then(response => {
        if (response.ok) {
          setCategories([...categories, response.data.category || response.data]);
          setForm({
            name: "",
            donationAmount: "",
            sortDescription: "",
            descriptions: [""]
          });
          showToast("Category added successfully!", "success");
        } else {
          showToast(response.error, "error");
        }
      });
  };

  const handleUpdate = e => {
    e.preventDefault();
    const validationError = validateCategory(form);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    categoriesAPI.update(editing, form)
      .then(response => {
        if (response.ok) {
          setCategories(categories.map(c => c._id === editing ? (response.data.category || response.data) : c));
          setEditing(null);
          setForm({
            name: "",
            donationAmount: "",
            sortDescription: "",
            descriptions: [""]
          });
          showToast("Category updated successfully!", "success");
        } else {
          showToast(response.error, "error");
        }
      });
  };

  const handleDelete = id => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    categoriesAPI.delete(id)
      .then(response => {
        if (response.ok) {
          setCategories(categories.filter(c => c._id !== id));
          showToast("Category deleted successfully!", "success");
        } else {
          showToast(response.error, "error");
        }
      });
  };

  const startEdit = category => {
    setEditing(category._id);
    setForm({
      name: category.name,
      donationAmount: category.donationAmount || "",
      sortDescription: category.sortDescription || "",
      descriptions: category.descriptions && category.descriptions.length > 0
        ? category.descriptions
        : [""]
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      name: "",
      donationAmount: "",
      sortDescription: "",
      descriptions: [""]
    });
  };

  const handleReorder = async (reorderedCategories) => {
    try {
      const response = await categoriesAPI.reorder(reorderedCategories);
      if (response.ok) {
        // Update local state with new order
        const updatedCategories = [...categories];
        reorderedCategories.forEach(({ id, displayOrder }) => {
          const category = updatedCategories.find(c => c._id === id);
          if (category) {
            category.displayOrder = displayOrder;
          }
        });
        updatedCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setCategories(updatedCategories);
        showToast("Categories reordered successfully!", "success");
      } else {
        showToast(response.error || "Failed to reorder categories", "error");
      }
    } catch (error) {
      showToast("An error occurred while reordering categories", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
          duration={toast.duration}
        />
      ))}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Manage Categories</h2>
          <p className="text-gray-600">Create and manage donation categories with multiple descriptions</p>
        </div>

        <AddCategoryForm
          form={form}
          setForm={setForm}
          editing={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={handleCancel}
        />

        <CategoriesList
          categories={categories}
          onEdit={startEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}

export default AdminCategories;
