-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    birth_date DATE,
    city VARCHAR(100),
    avatar_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица образования
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100),
    field VARCHAR(100),
    years VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица опыта работы
CREATE TABLE work_experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    period VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица достижений
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    month VARCHAR(50),
    year VARCHAR(10),
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица навыков
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('hard', 'soft')),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица столбцов Kanban
CREATE TABLE kanban_columns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL,
    is_deletable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица задач Kanban
CREATE TABLE kanban_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    column_id INTEGER REFERENCES kanban_columns(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    responsible VARCHAR(100),
    creator VARCHAR(100),
    start_date DATE,
    deadline DATE,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 4),
    points INTEGER DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица исполнителей задачи
CREATE TABLE task_executors (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES kanban_tasks(id),
    executor_name VARCHAR(100) NOT NULL
);

-- Таблица навыков задачи
CREATE TABLE task_skills (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES kanban_tasks(id),
    skill_name VARCHAR(100) NOT NULL
);

-- Таблица тегов задачи
CREATE TABLE task_tags (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES kanban_tasks(id),
    tag_name VARCHAR(100) NOT NULL
);

-- Таблица комментариев к задачам
CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES kanban_tasks(id),
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица финансовых транзакций
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица проектов
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица технологий проекта
CREATE TABLE project_technologies (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    technology VARCHAR(100) NOT NULL
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_work_user_id ON work_experience(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_kanban_columns_user_id ON kanban_columns(user_id);
CREATE INDEX idx_kanban_tasks_user_id ON kanban_tasks(user_id);
CREATE INDEX idx_kanban_tasks_column_id ON kanban_tasks(column_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Вставка тестового пользователя
INSERT INTO users (first_name, last_name, middle_name, birth_date, city, avatar_url, cover_image_url)
VALUES ('Алексей', 'Иванов', 'Сергеевич', '2002-03-15', 'Москва', 
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop');

-- Вставка тестовых данных (используем user_id = 1)
INSERT INTO education (user_id, institution, degree, field, years)
VALUES (1, 'МГУ им. М.В. Ломоносова', 'Бакалавр', 'Информатика', '2020-2024');

INSERT INTO work_experience (user_id, company, position, period)
VALUES (1, 'Tech Solutions', 'Junior Developer', '2023-настоящее время');

INSERT INTO achievements (user_id, title, month, year, description, icon)
VALUES 
    (1, 'Победитель хакатона 2023', 'Ноябрь', '2023', 'Первое место в университетском хакатоне', 'Trophy'),
    (1, 'Сертификат React Developer', 'Сентябрь', '2023', 'Завершил курс по React', 'Award'),
    (1, 'Top Student Award', 'Июнь', '2023', 'Лучший студент курса', 'Medal');

INSERT INTO skills (user_id, name, type, points, level)
VALUES 
    (1, 'React', 'hard', 15, 2),
    (1, 'JavaScript', 'hard', 22, 3),
    (1, 'Коммуникация', 'soft', 8, 1);

INSERT INTO kanban_columns (user_id, title, order_index, is_deletable)
VALUES 
    (1, 'Мечты', 0, FALSE),
    (1, 'В работе', 1, TRUE),
    (1, 'Выполнено', 2, TRUE);

INSERT INTO kanban_tasks (user_id, column_id, title, description, responsible, creator, start_date, deadline, priority, points, completed)
VALUES (1, 1, 'Изучить React', 'Пройти курс по React', 'Иванов А.', 'Иванов А.', '2024-01-15', '2024-02-15', 3, 5, FALSE);

INSERT INTO task_skills (task_id, skill_name)
VALUES (1, 'React'), (1, 'JavaScript');

INSERT INTO task_tags (task_id, tag_name)
VALUES (1, 'обучение');

INSERT INTO transactions (user_id, type, amount, category, description, transaction_date)
VALUES 
    (1, 'income', 50000, 'Зарплата', 'Зарплата за январь', '2024-01-31'),
    (1, 'expense', 15000, 'Обучение', 'Онлайн курс', '2024-01-15');

INSERT INTO projects (user_id, name, status, progress)
VALUES 
    (1, 'E-commerce Platform', 'В разработке', 75),
    (1, 'Mobile App', 'Завершен', 100),
    (1, 'AI Chatbot', 'В разработке', 45);

INSERT INTO project_technologies (project_id, technology)
VALUES 
    (1, 'React'), (1, 'Node.js'),
    (2, 'React Native'),
    (3, 'Python'), (3, 'TensorFlow');