-- Обновляем таблицу education: добавляем отдельные поля для годов
ALTER TABLE education 
  ADD COLUMN start_year VARCHAR(4),
  ADD COLUMN end_year VARCHAR(4),
  ADD COLUMN is_current BOOLEAN DEFAULT FALSE;

-- Обновляем таблицу work_experience: добавляем годы и описание
ALTER TABLE work_experience 
  ADD COLUMN start_year VARCHAR(4),
  ADD COLUMN end_year VARCHAR(4),
  ADD COLUMN is_current BOOLEAN DEFAULT FALSE,
  ADD COLUMN description TEXT;

-- Создаем таблицу категорий транзакций
CREATE TABLE transaction_categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'DollarSign',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Добавляем дефолтные категории для тестового пользователя
INSERT INTO transaction_categories (user_id, name, icon)
VALUES 
    (1, 'Зарплата', 'Wallet'),
    (1, 'Обучение', 'BookOpen'),
    (1, 'Фриланс', 'Code'),
    (1, 'Питание', 'UtensilsCrossed'),
    (1, 'Транспорт', 'Car'),
    (1, 'Развлечения', 'PartyPopper'),
    (1, 'Здоровье', 'Heart'),
    (1, 'Другое', 'DollarSign');

-- Обновляем существующие данные education
UPDATE education 
SET start_year = '2020', end_year = '2024', is_current = FALSE
WHERE id = 1;

-- Обновляем существующие данные work_experience
UPDATE work_experience 
SET start_year = '2023', end_year = '', is_current = TRUE, description = 'Разработка веб-приложений на React и TypeScript'
WHERE id = 1;

-- Создаем индексы для оптимизации
CREATE INDEX idx_transaction_categories_user_id ON transaction_categories(user_id);