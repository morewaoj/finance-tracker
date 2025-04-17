const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Data validation before sending
  const formData = {
    name: event.target.name.value.trim(),
    email: event.target.email.value.trim(),
    age: parseInt(event.target.age.value)
  };

  // Validation checks
  const errors = {};
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.email) errors.email = 'Email is required';
  if (isNaN(formData.age)) errors.age = 'Age must be a number';

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    const response = await makeApiRequest('/api/submit', formData);
    handleSuccess(response);
  } catch (error) {
    handleError(error);
  }
};