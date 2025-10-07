import Category from '../models/Category';

// Controlador de Categorías
class CategoryController {
  constructor() {
    this.categories = [
      new Category(1, 'Tecnología', '💻', [
        'Celulares',
        'Computadores',
        'Tablets',
        'Accesorios Tech'
      ]),
      new Category(2, 'Electrodomésticos', '🏠', [
        'Neveras',
        'Lavadoras',
        'Estufas',
        'Microondas'
      ]),
      new Category(3, 'Televisores', '📺', [
        'Smart TV',
        'TV 4K',
        'TV 8K',
        'Soundbars'
      ]),
      new Category(4, 'Audio', '🎵', [
        'Audífonos',
        'Parlantes',
        'Equipos de Sonido',
        'Micrófonos'
      ]),
      new Category(5, 'Videojuegos', '🎮', [
        'PlayStation',
        'Xbox',
        'Nintendo',
        'Accesorios Gaming'
      ]),
      new Category(6, 'Hogar', '🛋️', [
        'Muebles',
        'Decoración',
        'Iluminación',
        'Textiles'
      ]),
    ];
  }

  getAllCategories() {
    return this.categories;
  }

  getCategoryById(id) {
    return this.categories.find(category => category.id === parseInt(id));
  }

  getCategoryByName(name) {
    return this.categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  }
}

const categoryControllerInstance = new CategoryController();
export default categoryControllerInstance;
