// Modelo de Categoría
class Category {
  constructor(id, name, icon, subcategories = []) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.subcategories = subcategories;
  }

  hasSubcategories() {
    return this.subcategories.length > 0;
  }
}

export default Category;
