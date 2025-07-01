CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(100) NOT NULL,
  equipo VARCHAR(100) NOT NULL,
  problema TEXT NOT NULL,
  estado ENUM('activo','entregado') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
