import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../../context/RecipeContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload, FaTrash, FaPlus } from 'react-icons/fa';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipe, createRecipe, updateRecipe } = useRecipes();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '', note: '' }],
    instructions: [''],
    category: '',
    tags: [], // Make sure this is an array
    imageUrl: '',
    videoUrl: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    isFeatured: false,
  });

  const categories = ['Arabic', 'Pakistani', 'Indian', 'Fast Food', 'Dessert', 'Beverage', 'Breakfast', 'Healthy', 'Soups', 'BBQ', 'Seafood', 'Vegetarian'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (id) loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    setLoading(true);
    const recipe = await getRecipe(id);
    if (recipe) {
      setFormData({
        ...recipe,
        ingredients: recipe.ingredients || [{ name: '', quantity: '', unit: '', note: '' }],
        instructions: recipe.instructions || [''],
        tags: recipe.tags || [], // Ensure tags is always an array
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || 'Medium',
        isFeatured: recipe.isFeatured || false,
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '', unit: '', note: '' }],
    });
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      setFormData({ ...formData, instructions: newInstructions });
    }
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setFormData({ ...formData, imageUrl: data.url });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.imageUrl) {
      toast.error('Image is required');
      return;
    }
    if (formData.ingredients.some(ing => !ing.name.trim() || !ing.quantity.trim())) {
      toast.error('All ingredients must have name and quantity');
      return;
    }
    if (formData.instructions.some(inst => !inst.trim())) {
      toast.error('All instructions must have content');
      return;
    }

    setLoading(true);

    const data = {
      ...formData,
      prepTime: parseInt(formData.prepTime) || 0,
      cookTime: parseInt(formData.cookTime) || 0,
      servings: parseInt(formData.servings) || 1,
      ingredients: formData.ingredients.filter(ing => ing.name.trim() && ing.quantity.trim()),
      instructions: formData.instructions.filter(inst => inst.trim()),
    };

    const result = id ? await updateRecipe(id, data) : await createRecipe(data);
    setLoading(false);

    if (result) {
      navigate('/admin');
    }
  };

  if (loading && id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Safely get tags string - use empty array if undefined
  const tagsString = Array.isArray(formData.tags) ? formData.tags.join(', ') : '';

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-8">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              {id ? 'Edit Recipe' : 'Add New Recipe'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div>
            <label className="label-field">Recipe Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter recipe title"
              required
            />
          </div>

          <div>
            <label className="label-field">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input-field"
              placeholder="Brief description of the recipe"
              required
            />
          </div>

          <div>
            <label className="label-field">Recipe Image *</label>
            <div className="space-y-4">
              {formData.imageUrl ? (
                <div className="relative">
                  <img src={formData.imageUrl} alt="Recipe" className="w-full max-w-md h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload image</p>
                        <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input-field"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Prep Time (minutes)</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 15"
                min="0"
              />
            </div>
            <div>
              <label className="label-field">Cook Time (minutes)</label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 30"
                min="0"
              />
            </div>
            <div>
              <label className="label-field">Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 4"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="label-field">YouTube Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="label-field">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsString}
              onChange={handleTagChange}
              className="input-field"
              placeholder="e.g. vegetarian, spicy, quick"
            />
          </div>

          <div>
            <label className="label-field">Ingredients *</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Ingredient name"
                  />
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="input-field"
                    placeholder="Quantity"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="input-field"
                    placeholder="Unit"
                  />
                  <input
                    type="text"
                    value={ingredient.note}
                    onChange={(e) => handleIngredientChange(index, 'note', e.target.value)}
                    className="input-field"
                    placeholder="Note (optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn-secondary flex items-center"
            >
              <FaPlus className="mr-2" /> Add Ingredient
            </button>
          </div>

          <div>
            <label className="label-field">Instructions *</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2">
                <div className="flex-grow">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    rows="2"
                    className="input-field"
                    placeholder={`Step ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="btn-secondary flex items-center"
            >
              <FaPlus className="mr-2" /> Add Step
            </button>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">Feature this recipe</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary flex-1 md:flex-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loading-spinner w-5 h-5 mr-2"></span>
                  {id ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                id ? 'Update Recipe' : 'Create Recipe'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-secondary flex-1 md:flex-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;