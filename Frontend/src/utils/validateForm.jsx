export function validateDonation(form, categories = []) {
  if (!form.category || !form.quantity) {
    return "Category and quantity are required";
  }
  if (form.quantity < 1) return "Quantity must be at least 1";

  // Find the selected category
  const selectedCategory = categories.find(cat => cat._id === form.category);
  if (!selectedCategory) return "Please select a valid category";

  // Category-specific quantity rules
  const categoryName = selectedCategory.name.toLowerCase();
  if (categoryName.includes("food") && form.quantity < 5) {
    return `Food donations require at least 5 items`;
  }
  if (categoryName.includes("clothes") && form.quantity < 2) {
    return `Clothing donations require at least 2 items`;
  }
  if (categoryName.includes("books") && form.quantity < 3) {
    return `Book donations require at least 3 items`;
  }
  if (categoryName.includes("toys") && form.quantity < 1) {
    return `Toy donations require at least 1 item`;
  }
  // Default: no additional rules

  return "";
}

export function validateSignup(form) {
  if (!form.name || !form.email || !form.password) return "All fields required";
  if (!form.email.includes("@")) return "Invalid email";
  if (form.password.length < 6) return "Password too short";
  return "";
}

export function validateLogin(form) {
  if (!form.email || !form.password) return "Email and password are required";
  if (!form.email.includes("@")) return "Invalid email format";
  return "";
}

export function validateProfile(form) {
  if (!form.name) return "Name is required";
  if (form.email && !form.email.includes("@")) return "Invalid email format";
  return "";
}

export function validateCategory(form) {
  if (!form.name) return "Name and description are required";
  return "";
}

export function validatePasswordChange(form) {
  if (!form.oldPassword || !form.newPassword) return "All password fields are required";
  if (form.newPassword.length < 6) return "New password must be at least 6 characters";
  if (form.newPassword === form.oldPassword) return "New password must be different from old";
  return "";
}

