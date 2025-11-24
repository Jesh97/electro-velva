const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Función helper para hacer peticiones
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// API de Autenticación
export const authAPI = {
  login: async (correo, contrasena) => {
    return request('/auth/login', {
      method: 'POST',
      body: { correo, contrasena }
    });
  },

  verify: async () => {
    return request('/auth/verify', {
      method: 'GET'
    });
  }
};

// API de Incidentes
export const incidentesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const query = queryParams.toString();
    return request(`/incidentes${query ? `?${query}` : ''}`);
  },

  getById: async (id) => {
    return request(`/incidentes/${id}`);
  },

  crear: async (data) => {
    return request('/incidentes', {
      method: 'POST',
      body: data
    });
  },

  gestionar: async (id, data) => {
    return request(`/incidentes/${id}/gestionar`, {
      method: 'PATCH',
      body: data
    });
  },

  tomar: async (id, idUsuario) => {
    return request(`/incidentes/${id}/tomar`, {
      method: 'POST'
    });
  },

  terminar: async (id) => {
    return request(`/incidentes/${id}/terminar`, {
      method: 'PATCH'
    });
  },

  getCategorias: async () => {
    return request('/incidentes/categorias');
  },

  getTecnicos: async () => {
    return request('/incidentes/tecnicos/disponibles');
  }
};

// API de Contratos
export const contratosAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const query = queryParams.toString();
    return request(`/contratos${query ? `?${query}` : ''}`);
  },

  getById: async (id) => {
    return request(`/contratos/${id}`);
  },

  crear: async (data) => {
    return request('/contratos', {
      method: 'POST',
      body: data
    });
  },

  firmar: async (id, idUsuario, firmaImagen) => {
    return request(`/contratos/${id}/firmar`, {
      method: 'POST',
      body: { firma_imagen: firmaImagen }
    });
  },

  rechazar: async (id, motivo) => {
    return request(`/contratos/${id}/rechazar`, {
      method: 'POST',
      body: { motivo }
    });
  }
};

