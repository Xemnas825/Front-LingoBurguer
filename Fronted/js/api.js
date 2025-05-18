const API_BASE_URL = 'http://localhost:8080/PruebaDBConsola/Controller';

class ProductAPI {
    static async getProducts(category = '') {
        try {
            const url = `${API_BASE_URL}?ACTION=PRODUCT.FIND_ALL`;
            console.log('Obteniendo productos desde:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener los productos: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Log específico para productos de categoría 6 (postres)
            const postres = data.filter(p => p.m_iCategory === 6);
            console.table(postres.map(p => ({
                nombre: p.m_strName,
                id: p.m_iId,
                categoria: p.m_iCategory
            })));
            
            // Log específico para productos que parecen ser postres
            const posiblesDulces = data.filter(p => 
                p.m_strName.toLowerCase().includes('cookie') ||
                p.m_strName.toLowerCase().includes('brownie') ||
                p.m_strName.toLowerCase().includes('smoothie') ||
                p.m_strName.toLowerCase().includes('shake')
            );
            console.table(posiblesDulces.map(p => ({
                nombre: p.m_strName,
                categoriaId: p.m_iCategory,
                tipoCategoria: typeof p.m_iCategory,
                deberiaSerPostre: true
            })));
            
            // Verificar inconsistencias en la categorización
            posiblesDulces.forEach(p => {
                if (p.m_iCategory !== 6) {
                    console.error(`Posible error de categorización: ${p.m_strName} parece ser un postre pero está en la categoría ${p.m_iCategory}`);
                }
            });
            
            // Log de todos los productos con sus categorías
            console.log('DEBUG - Todas las categorías:', 
                data.map(p => ({
                    nombre: p.m_strName,
                    categoriaId: p.m_iCategory,
                    tipoCategoria: typeof p.m_iCategory
                }))
            );
            
            console.log('Datos recibidos de la API:', JSON.stringify(data, null, 2));
            
            // Validar que los datos sean un array
            if (!Array.isArray(data)) {
                console.error('Los datos recibidos no son un array:', data);
                throw new Error('Formato de datos inválido');
            }
            
            // Transformar los datos al formato esperado por el frontend
            const mappedProducts = data.map(product => {
                // Validar que el producto tenga los campos necesarios
                if (!product.m_iId || !product.m_strName || !product.m_iCategory) {
                    console.error('Producto con datos incompletos:', JSON.stringify(product, null, 2));
                    return null;
                }
                
                const categoryId = product.m_iCategory;
                console.table({
                    nombre: product.m_strName,
                    categoriaId: categoryId,
                    tipoCategoria: typeof categoryId,
                    categoriaOriginal: product.m_strCategory || 'No disponible'
                });
                
                const categoryName = this.mapCategory(categoryId);
                
                // Log específico si el producto debería ser un postre pero no se está mapeando como tal
                if ((product.m_strName.toLowerCase().includes('cookie') ||
                     product.m_strName.toLowerCase().includes('brownie') ||
                     product.m_strName.toLowerCase().includes('smoothie') ||
                     product.m_strName.toLowerCase().includes('shake')) && 
                    categoryName !== 'postres') {
                    console.table({
                        nombre: product.m_strName,
                        categoriaId: categoryId,
                        categoriaMapeada: categoryName,
                        deberíaSerPostre: true
                    });
                }
                
                return {
                    id: product.m_iId,
                    name: product.m_strName,
                    description: product.m_strDescription,
                    price: product.m_dblPrice,
                    category: categoryName,
                    imageUrl: `../images/products/${categoryName}/${product.m_strImageURL}`,
                    available: product.m_bAvailable
                };
            }).filter(product => product !== null);
            
            // Validar que haya productos después del mapeo
            if (mappedProducts.length === 0) {
                console.error('No se encontraron productos válidos después del mapeo');
                throw new Error('No se encontraron productos válidos');
            }

            // Mostrar resumen de productos por categoría
            const productsByCategory = mappedProducts.reduce((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {});
            console.table(productsByCategory);

            const filteredProducts = category 
                ? mappedProducts.filter(p => {
                    console.table({
                        nombre: p.name,
                        categoriaProducto: p.category,
                        categoriaFiltro: category,
                        coincide: p.category === category
                    });
                    return p.category === category;
                })
                : mappedProducts;
            
            console.log(`Productos filtrados para categoría '${category}':`, 
                filteredProducts.map(p => ({
                    nombre: p.name,
                    categoria: p.category
                })));

            return filteredProducts;
        } catch (error) {
            console.error('Error en getProducts:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const url = `${API_BASE_URL}?ACTION=PRODUCT.FIND_ALL&id=${id}`;
            console.log('Fetching product by ID from:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Producto no encontrado: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos del producto recibidos:', data);
            
            if (Array.isArray(data)) {
                // Buscar el producto específico por ID
                const product = data.find(p => p.m_iId === id);
                
                if (!product) {
                    throw new Error(`No se encontró el producto con ID ${id}`);
                }
                
                console.log('Datos crudos del producto encontrado:', product);
                
                const categoryName = this.mapCategory(product.m_iCategory);
                console.log('Categoría mapeada:', {
                    originalId: product.m_iCategory,
                    mappedName: categoryName
                });
                
                const imageUrl = `../images/products/${categoryName}/${product.m_strImageURL}`;
                console.log('URL de imagen construida:', {
                    categoryName,
                    imageFileName: product.m_strImageURL,
                    fullUrl: imageUrl
                });
                
                return {
                    id: product.m_iId,
                    name: product.m_strName,
                    description: product.m_strDescription,
                    price: product.m_dblPrice,
                    category: categoryName,
                    imageUrl: imageUrl,
                    available: product.m_bAvailable
                };
            }
            throw new Error('Respuesta inválida de la API');
        } catch (error) {
            console.error('Error en getProductById:', error);
            throw error;
        }
    }

    static async getCategories() {
        try {
            const url = `${API_BASE_URL}?ACTION=CATEGORY.FIND_ALL`;
            console.log('Fetching categories from:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error al obtener las categorías: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Categories received:', data);
            return data;
        } catch (error) {
            console.error('Error en getCategories:', error);
            throw error;
        }
    }

    // Mapear IDs de categoría a nombres de categoría según la base de datos
    static mapCategory(categoryId) {
        // Asegurarse de que categoryId sea un número
        const numericId = parseInt(categoryId, 10);
        
        // Log detallado del proceso de conversión
        console.table({
            valorOriginal: categoryId,
            tipoOriginal: typeof categoryId,
            valorConvertido: numericId,
            tipoConvertido: typeof numericId,
            esNumeroValido: !isNaN(numericId)
        });
        
        // Validar que el ID sea un número válido
        if (isNaN(numericId)) {
            console.error('ERROR - ID de categoría inválido:', JSON.stringify({
                valorRecibido: categoryId,
                tipo: typeof categoryId
            }, null, 2));
            return 'otros';
        }
        
        const categoryMap = {
            1: 'entrantes',      // Starters
            2: 'hamburguesas',   // Burgers
            3: 'acompañamientos', // Sides
            4: 'productos-compuestos', // Menú
            5: 'bebidas',        // Drinks
            6: 'postres'         // Desserts
        };
        
        // Verificar si el ID está en el rango válido
        if (numericId < 1 || numericId > 6) {
            console.error('ERROR - ID de categoría fuera de rango:', JSON.stringify({
                id: numericId,
                rangoValido: '1-6'
            }, null, 2));
            return 'otros';
        }
        
        const mappedCategory = categoryMap[numericId];
        
        // Log del resultado del mapeo
        console.table({
            idNumerico: numericId,
            categoriaResultante: mappedCategory,
            categoriasDisponibles: Object.entries(categoryMap).map(([id, cat]) => `${id}:${cat}`).join(', '),
            esPostre: numericId === 6,
            esBebida: numericId === 5
        });
        
        // Verificación adicional para postres y bebidas
        if (numericId === 6 && mappedCategory !== 'postres') {
            console.error('Error crítico: Producto de categoría 6 no mapeado como postre');
        } else if (numericId === 5 && mappedCategory !== 'bebidas') {
            console.error('Error crítico: Producto de categoría 5 no mapeado como bebida');
        }
        
        return mappedCategory;
    }
}

export default ProductAPI; 